import { HOT_N_TASTY_CATEGORIES, type MenuItem } from "@/data/hotNTastyMenu";

const FALLBACK_IMAGE = "/logo.jpg";

/**
 * Browser caches and Supabase rows are runtime data, not trusted TypeScript
 * objects. A single incomplete row must not bring down the whole restaurant site.
 * Normalizing is display-only; it does not write to Supabase.
 */
export function normalizeMenuItems(value: unknown): MenuItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((raw: unknown) => {
    if (raw === null || typeof raw !== "object") return [];
    const record = raw as Record<string, unknown>;
    const rawId = record.id;
    const normalizedId = typeof rawId === "string"
      ? rawId.trim()
      : typeof rawId === "number" && Number.isFinite(rawId) && Number.isInteger(rawId)
        ? String(rawId)
        : "";
    if (!normalizedId) return [];
    if (typeof record.name !== "string" || !record.name.trim()) return [];

    const parsedPrice = Number(record.price);
    const rawImage = typeof record.image === "string" && record.image.trim()
      ? record.image
      : typeof record.image_url === "string" && record.image_url.trim()
        ? record.image_url
        : "";
    return [{
      id: normalizedId,
      name: record.name,
      price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
      description: typeof record.description === "string" ? record.description : "",
      category: typeof record.category === "string" && record.category.trim()
        ? record.category
        : "other",
      image: rawImage || FALLBACK_IMAGE,
    }];
  });
}

/** Sort by established category order and then by natural name (Deal 2 before Deal 10). */
export function sortMenuItems(items: MenuItem[]): MenuItem[] {
  const categoryRanks = new Map(
    HOT_N_TASTY_CATEGORIES.map((category, index) => [category.id.toLowerCase(), index])
  );

  return [...items].sort((a, b) => {
    const aRank = categoryRanks.get((a.category || "").toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    const bRank = categoryRanks.get((b.category || "").toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;

    return (a.name || "").localeCompare(b.name || "", undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}
