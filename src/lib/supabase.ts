import { createClient } from "@supabase/supabase-js";
import type { MenuItem } from "@/data/hotNTastyMenu";
import { normalizeMenuItems } from "@/utils/menuSorting";
import { isExclusiveDeal } from "@/utils/exclusiveDeals";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://naisjutqwbsslfohpois.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haXNqdXRxd2Jzc2xmb2hwb2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NzgzNTMsImV4cCI6MjA5OTE1NDM1M30.wGRUI7FO82QnogtwN5AmKuiJrhmGnI0PwN455k-vfqY";

export const isSupabaseConfigured = true;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** PostgREST errors are plain objects; `instanceof Error` alone loses their message. */
export function describeSupabaseError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const info = error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
    const message = typeof info.message === "string" && info.message.trim()
      ? info.message
      : typeof info.details === "string" && info.details.trim()
        ? info.details
        : "Database request failed";
    const code = typeof info.code === "string" && info.code.trim() ? ` [${info.code}]` : "";
    const details = typeof info.details === "string" && info.details.trim() && info.details !== message
      ? `: ${info.details}` : "";
    const hint = typeof info.hint === "string" && info.hint.trim() ? ` Hint: ${info.hint}` : "";
    return `${message}${code}${details}${hint}`;
  }
  return "Unknown database error";
}

/**
 * Fetch all live menu items from Supabase with full error stacktrace output
 */
export async function getSupabaseMenu(): Promise<MenuItem[] | null> {
  try {
    const { data, error } = await supabase
      .from("hot_n_tasty_menu")
      .select("*");

    if (error) throw error;
    return normalizeMenuItems(data);
  } catch (err) {
    console.error("Supabase menu retrieval failed. Error stack:", err);
    return null;
  }
}

export class SupabaseMenuSaveError extends Error {
  constructor(message: string, public readonly insertedIdMap: Map<string, string>) {
    super(message);
    this.name = "SupabaseMenuSaveError";
  }
}

/**
 * Save only changed menu rows without ever sending client-only IDs to a BIGINT identity column.
 * Existing rows are updated by their numeric database ID. New rows omit `id`, allowing
 * PostgreSQL GENERATED AS IDENTITY to allocate it, and return a temporary-ID -> DB-ID map.
 */
export async function saveSupabaseMenu(
  items: MenuItem[],
  removedIds: string[] = [],
): Promise<Map<string, string>> {
  const insertedIdMap = new Map<string, string>();

  try {
    for (const item of items) {
      const isExclusive = isExclusiveDeal(item);
      const payload = {
        name: item.name,
        price: Number(item.price) || 0,
        description: item.description || "",
        category: isExclusive ? "exclusive-deals" : (item.category || "chicken-rolls"),
        image: item.image || "",
      };

      // Supabase BIGINT IDs are normalized to strings for React. Only digit-only IDs
      // represent rows that already exist in the database. All other IDs are local temp IDs.
      if (/^\d+$/.test(String(item.id))) {
        const { data, error } = await supabase
          .from("hot_n_tasty_menu")
          .update(payload)
          .eq("id", item.id)
          .select("id")
          .maybeSingle();

        if (error) {
          throw new Error(`Updating menu item "${item.name}" failed: ${describeSupabaseError(error)}`);
        }
        if (!data) {
          throw new Error(`Menu item "${item.name}" (ID ${item.id}) was not found in Supabase. Refresh the menu before saving.`);
        }
      } else {
        // Do NOT include item.id here. The database identity column generates the BIGINT ID.
        const { data, error } = await supabase
          .from("hot_n_tasty_menu")
          .insert(payload)
          .select("id")
          .single();

        if (error) {
          throw new Error(`Adding menu item "${item.name}" failed: ${describeSupabaseError(error)}`);
        }
        if (data?.id === undefined || data?.id === null) {
          throw new Error(`Supabase inserted "${item.name}" but did not return its generated ID.`);
        }
        insertedIdMap.set(item.id, String(data.id));
      }
    }

    // Only database-generated numeric IDs can be deleted from this BIGINT table.
    const databaseRemovedIds = [...new Set(removedIds.map(String).filter((id) => /^\d+$/.test(id)))];
    for (let i = 0; i < databaseRemovedIds.length; i += 100) {
      const batch = databaseRemovedIds.slice(i, i + 100);
      const { data, error } = await supabase
        .from("hot_n_tasty_menu")
        .delete()
        .in("id", batch)
        .select("id");
      if (error) {
        throw new Error(`Deleting menu items failed: ${describeSupabaseError(error)}`);
      }
      if ((data?.length ?? 0) !== batch.length) {
        throw new Error("Some menu items were not deleted. Refresh the menu and check database permissions.");
      }
    }

    return insertedIdMap;
  } catch (err) {
    console.error("Supabase menu synchronization failed:", err);
    const message = err instanceof Error ? err.message : describeSupabaseError(err);
    // If an earlier insert in this save succeeded before a later operation failed,
    // return its generated ID map with the error so the UI can avoid duplicate inserts
    // when the user retries.
    throw new SupabaseMenuSaveError(message, insertedIdMap);
  }
}

/** Exclusive deals use an existing settings key and the existing menu table. */
export const DEFAULT_EXCLUSIVE_TITLE = "Exclusive Deals";

export async function getSupabaseExclusiveTitle(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("hot_n_tasty_settings")
      .select("value")
      .eq("key", "exclusive_deals_title")
      .maybeSingle();
    if (error) throw error;
    return typeof data?.value === "string" && data.value.trim() ? data.value : null;
  } catch (err) {
    console.error("Could not load exclusive deals title:", err);
    return null;
  }
}

export async function saveSupabaseExclusiveTitle(title: string): Promise<void> {
  const { error } = await supabase
    .from("hot_n_tasty_settings")
    .upsert({ key: "exclusive_deals_title", value: title }, { onConflict: "key" });
  if (error) throw new Error(`Saving Exclusive Deals title failed: ${describeSupabaseError(error)}`);
}

/**
 * Fetch homepage banner URLs from Supabase (supporting both 'url' and 'image_url' schemas dynamically) with error logs
 */
/**
 * Save customized restaurant logo to Supabase settings
 */
export async function saveSupabaseLogo(url: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("hot_n_tasty_settings")
      .upsert(
        {
          key: "logo",
          value: url
        },
        {
          onConflict: "key"
        }
      );

    if (error) {
      console.error("Supabase logo update failed:", error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error("Supabase save settings key (logo) failed:", err);
    throw err;
  }
}
/**
 * Replace and synchronize banner URLs in Supabase, dynamically validating schema to bypass sync mismatches
 */
export async function saveSupabaseBanners(urls: string[]): Promise<boolean> {
  try {
    // Delete existing entries cleanly without trigger restrictions
    await supabase
      .from("hot_n_tasty_banners")
      .delete()
      .neq("order_index", -999);

    // Try storing payload matching the 'url' schema
    const toInsertUrl = urls.map((url, index) => ({
      url,
      order_index: index
    }));
    const { error: errUrl } = await supabase
      .from("hot_n_tasty_banners")
      .insert(toInsertUrl);

    if (!errUrl) return true;

    // Fallback: Try storing payload matching the 'image_url' schema
    const toInsertImageUrl = urls.map((url, index) => ({
      image_url: url,
      order_index: index
    }));
    const { error: errImgUrl } = await supabase
      .from("hot_n_tasty_banners")
      .insert(toInsertImageUrl);

    if (!errImgUrl) return true;

    throw new Error(errImgUrl.message || "All fallback insert attempts failed.");
  } catch (err) {
    console.error("Supabase save banner sliders failed. Error stack:", err);
    throw err; // Rethrow to propagate to UI diagnostic module
  }
}

/**
 * Fetch customized restaurant logo from Supabase settings
 */
export async function getSupabaseLogo(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("hot_n_tasty_settings")
      .select("value")
      .eq("key", "logo")
      .maybeSingle();

    if (error) throw error;
    return data?.value || null;
  } catch (err) {
    console.error("Supabase fetch settings key (logo) failed. Error stack:", err);
    return null;
  }
}
/**
 * Fetch homepage banner URLs from Supabase
 */
export async function getSupabaseBanners(): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from("hot_n_tasty_banners")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    return data.map((b: any) => b.url || b.image_url || b.image);
  } catch (err) {
    console.error("Supabase fetch banner sliders failed:", err);
    return null;
  }
}
