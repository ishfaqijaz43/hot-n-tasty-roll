import type { MenuItem } from "@/data/hotNTastyMenu";

/** Exclusive promotions share the existing menu table/category but have unique IDs. */
export function isExclusiveDeal(item: Pick<MenuItem, "id" | "category">): boolean {
  return (typeof item?.id === "string" && item.id.startsWith("exclusive-"))
    || item?.category === "exclusive-deals";
}
