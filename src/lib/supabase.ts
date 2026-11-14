import { createClient } from "@supabase/supabase-js";
import type { MenuItem } from "@/data/hotNTastyMenu";
import { normalizeMenuItems } from "@/utils/menuSorting";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://naisjutqwbsslfohpois.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haXNqdXRxd2Jzc2xmb2hwb2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NzgzNTMsImV4cCI6MjA5OTE1NDM1M30.wGRUI7FO82QnogtwN5AmKuiJrhmGnI0PwN455k-vfqY";

export const isSupabaseConfigured = true;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

/**
 * Upsert menu items list to live Supabase database with full error stacktrace output
 */
export async function saveSupabaseMenu(items: MenuItem[], removedIds: string[] = []): Promise<boolean> {
  try {
    // Preserve all existing records; only delete IDs explicitly removed in admin.
    // Never use a table-wide delete or destructive delete-and-reinsert fallback.
    const toUpsert = items.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price) || 0,
      description: item.description || "",
      category: item.category || "chicken-rolls",
      image: item.image || ""
    }));

    if (toUpsert.length > 0) {
      const { error } = await supabase
        .from("hot_n_tasty_menu")
        .upsert(toUpsert, { onConflict: "id" });
      if (error) throw error;
    }

    // Delete in small explicit batches; a failed delete must surface as an error.
    for (let i = 0; i < removedIds.length; i += 100) {
      const batch = removedIds.slice(i, i + 100);
      const { data, error } = await supabase
        .from("hot_n_tasty_menu")
        .delete()
        .in("id", batch)
        .select("id");
      if (error) throw error;
      if ((data?.length ?? 0) !== batch.length) {
        throw new Error("Some deleted items were not removed from Supabase. Check database permissions.");
      }
    }
    return true;
  } catch (err) {
    console.error("Supabase menu synchronization failed:", err);
    throw err;
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
  if (error) throw error;
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