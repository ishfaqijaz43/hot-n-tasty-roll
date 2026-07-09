import { createClient } from "@supabase/supabase-js";
import { MenuItem } from "@/data/hotNTastyMenu";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://naisjutqwbsslfohpois.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haXNqdXRxd2Jzc2xmb2hwb2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NzgzNTMsImV4cCI6MjA5OTE1NDM1M30.wGRUI7FO82QnogtwN5AmKuiJrhmGnI0PwN455k-vfqY";

export const isSupabaseConfigured = true;
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch all live menu items from Supabase
 */
export async function getSupabaseMenu(): Promise<MenuItem[] | null> {
  try {
    const { data, error } = await supabase
      .from("hot_n_tasty_menu")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as MenuItem[];
  } catch (err) {
    console.warn("Supabase fetch menu failed", err);
    return null;
  }
}

/**
 * Upsert menu items list to live Supabase database
 */
export async function saveSupabaseMenu(items: MenuItem[]): Promise<boolean> {
  try {
    const { error: deleteError } = await supabase
      .from("hot_n_tasty_menu")
      .delete()
      .neq("id", "placeholder-to-allow-all-delete");

    if (deleteError) throw deleteError;

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
 * Fetch homepage banner URLs from Supabase (supporting both 'url' and 'image_url' schemas dynamically)
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
    console.warn("Supabase fetch banners failed", err);
    return null;
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
    console.error("Supabase save banners failed", err);
    return false;
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
    console.warn("Supabase fetch logo failed", err);
    return null;
  }
}

/**
 * Save customized restaurant logo to Supabase settings
 */
export async function saveSupabaseLogo(url: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("hot_n_tasty_settings")
      .upsert({ key: "logo", value: url });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Supabase save logo failed", err);
    return false;
  }
}