import { createClient } from "@supabase/supabase-js";
import { MenuItem } from "@/data/hotNTastyMenu";

const SUPABASE_URL = "https://naisjutqwbsslfohpois.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5haXNqdXRxd2Jzc2xmb2hwb2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NzgzNTMsImV4cCI6MjA5OTE1NDM1M30.wGRUI7FO82QnogtwN5AmKuiJrhmGnI0PwN455k-vfqY";

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
 * Fetch homepage banner URLs from Supabase
 */
export async function getSupabaseBanners(): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from("hot_n_tasty_banners")
      .select("url")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data.map((b) => b.url);
  } catch (err) {
    console.warn("Supabase fetch banners failed", err);
    return null;
  }
}

/**
 * Replace and synchronize banner URLs in Supabase
 */
export async function saveSupabaseBanners(urls: string[]): Promise<boolean> {
  try {
    const { error: deleteError } = await supabase
      .from("hot_n_tasty_banners")
      .delete()
      .not("id", "is", null);

    if (deleteError) throw deleteError;

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