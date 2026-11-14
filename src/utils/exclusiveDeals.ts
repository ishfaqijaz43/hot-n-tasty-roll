import type { MenuItem } from "@/data/hotNTastyMenu";

/**
 * Exclusive promotions use the existing deals-festival database category.
 * The ID prefix distinguishes them from regular festival deals, avoiding any
 * need for a new category value, table, or database migration.
 */
export function isExclusiveDeal(item: Pick<MenuItem, "id" | "category">): boolean {
  return item.id.startsWith("exclusive-") || item.category === "exclusive-deals";
}
