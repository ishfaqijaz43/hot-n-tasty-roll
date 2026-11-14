import { HOT_N_TASTY_CATEGORIES, type MenuItem } from "@/data/hotNTastyMenu";

/**
 * Sort by the restaurant's category order and then naturally by item name.
 * Numeric sorting is important: Deal 2 must appear before Deal 10.
 * Sorting on the client also fixes older menus stored in localStorage or Supabase.
 */
export function sortMenuItems(items: MenuItem[]): MenuItem[] {
  const categoryRanks = new Map(
    HOT_N_TASTY_CATEGORIES.map((category, index) => [category.id.toLowerCase(), index])
  );

  return [...items].sort((a, b) => {
    const aRank = categoryRanks.get(a.category.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    const bRank = categoryRanks.get(b.category.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;

    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}
