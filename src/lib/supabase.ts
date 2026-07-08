import { createClient } from "@supabase/supabase-js";
import { MenuItem } from "@/data/hotNTastyMenu";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Safely construct client if credentials exist to prevent crashing on missing env variables
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Fetch all live menu items from Supabase
 */
export async function getSupabaseMenu(): Promise<MenuItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("hot_n_tasty_menu")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as MenuItem[];
  } catch (err) {
    console.warn("Supabase fetch menu failed, using local fallback", err);
    return null;
  }
}

/**
 * Upsert menu items list to live Supabase database
 */
export async function saveSupabaseMenu(items: MenuItem[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Delete existing to synchronize completely
    const { error: deleteError } = await supabase
      .from("hot_n_tasty_menu")
      .delete()
      .neq("id", "placeholder-to-allow-all-delete");

    if (deleteError) throw deleteError;

    // Prepare items for insertion
    const toInsert = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.image
    }));

    const { error: insertError } = await supabase
      .from("hot_n_tasty_menu")
      .insert(toInsert);

    if (insertError) throw insertError;
    return true;
  } catch (err) {
    console.error("Supabase save menu failed", err);
    return false;
  }
}

/**
 * Fetch homepage banner URLs from Supabase
 */
export async function getSupabaseBanners(): Promise<string[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("hot_n_tasty_banners")
      .select("url")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data.map((b) => b.url);
  } catch (err) {
    console.warn("Supabase fetch banners failed, using local fallback", err);
    return null;
  }
}

/**
 * Replace and synchronize banner URLs in Supabase
 */
export async function saveSupabaseBanners(urls: string[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Clear existing banners
    const { error: deleteError } = await supabase
      .from("hot_n_tasty_banners")
      .delete()
      .not("id", "is", null);

    if (deleteError) throw deleteError;

    // Prepare items for insertion
    const toInsert = urls.map((url, index) => ({
      url,
      order_index: index
    }));

    const { error: insertError } = await supabase
      .from("hot_n_tasty_banners")
      .insert(toInsert);

    if (insertError) throw insertError;
    return true;
  } catch (err) {
    console.error("Supabase save banners failed", err);
    return false;
  }
}