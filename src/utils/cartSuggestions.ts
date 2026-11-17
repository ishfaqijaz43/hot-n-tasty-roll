import type { MenuItem } from "@/data/hotNTastyMenu";

type CartSelection = { item: MenuItem; quantity: number };

type FoodGroup =
  | "pizza" | "burger" | "roll" | "sandwich" | "broast" | "bbq"
  | "pasta" | "rice" | "noodles" | "fries" | "wings" | "drinks" | "other";

/** Match real menu categories first, then names (for newly added admin items). */
function foodGroup(item: MenuItem): FoodGroup {
  const category = (item.category || "").toLowerCase();
  const name = (item.name || "").toLowerCase();
  const text = `${category} ${name}`;

  if (/\b(pizza|pizzas)\b/.test(text)) return "pizza";
  if (/\b(drinks?|beverages?|cold\s*drinks?|soft\s*drinks?|sodas?|pepsi|sprite|7\s*up|coke|cola|fanta|mirinda|sting)\b/.test(text)) return "drinks";
  if (/\b(fries|french\s*fries|chips)\b/.test(text)) return "fries";
  if (/\b(wings?|appetizers?|nuggets?)\b/.test(text)) return "wings";
  if (/\b(sandwiches|sandwich)\b/.test(text)) return "sandwich";
  if (/\b(burgers?|zinger)\b/.test(text)) return "burger";
  if (/\b(rolls?|paratha)\b/.test(text)) return "roll";
  if (/\b(broast|fried\s*chicken)\b/.test(text)) return "broast";
  if (/\b(bbq|b\.b\.q|barbeque|barbecue|tikka|kabab|kebab|boti)\b/.test(text)) return "bbq";
  if (/\b(pasta|macaroni|spaghetti)\b/.test(text)) return "pasta";
  if (/\b(rice|biryani)\b/.test(text)) return "rice";
  if (/\b(chowmein|noodles?)\b/.test(text)) return "noodles";
  return "other";
}

function isColdDrink(item: MenuItem): boolean {
  return /\b(cold\s*drinks?|soft\s*drinks?|cola|coke|pepsi|sprite|7\s*up|fanta|mirinda|soda)\b/i.test(item.name || "");
}

const PAIRINGS: Record<FoodGroup, FoodGroup[]> = {
  pizza: ["fries", "wings", "sandwich", "roll", "burger"],
  burger: ["fries", "wings", "sandwich", "roll", "bbq"],
  roll: ["fries", "wings", "sandwich", "burger", "bbq"],
  sandwich: ["fries", "wings", "roll", "burger", "bbq"],
  broast: ["fries", "wings", "rice", "sandwich", "roll"],
  bbq: ["fries", "roll", "wings", "rice", "sandwich"],
  pasta: ["wings", "fries", "sandwich", "burger", "roll"],
  rice: ["wings", "bbq", "fries", "roll", "sandwich"],
  noodles: ["wings", "fries", "bbq", "sandwich", "roll"],
  fries: ["sandwich", "burger", "roll", "wings", "bbq"],
  wings: ["fries", "sandwich", "burger", "roll", "bbq"],
  drinks: ["fries", "burger", "roll", "sandwich", "wings"],
  other: ["fries", "wings", "sandwich", "roll", "burger"],
};

const isEligible = (item: MenuItem): boolean =>
  typeof item.id === "string" && item.id.length > 0 &&
  typeof item.name === "string" && item.name.trim().length > 0 &&
  typeof item.price === "number" && Number.isFinite(item.price) && item.price > 0 &&
  // Limited-time and combo deals are main courses, not relevant add-ons.
  item.category !== "exclusive-deals" && item.category !== "deals-festival";

/**
 * Curated cart add-ons, backed by the current menu (including Supabase edits).
 * No hardcoded prices, no made-up products, no database writes.
 * Cold drink is the first suggestion when the menu contains one. If all cold
 * drinks are already in the cart, suggest one more rather than inventing stock.
 */
export function getCartSuggestions(
  cartItems: readonly CartSelection[],
  menuItems: readonly MenuItem[],
  limit = 5,
): MenuItem[] {
  if (cartItems.length === 0 || limit <= 0) return [];

  const inCart = new Set(cartItems.map(({ item }) => String(item.id)));
  const seen = new Set<string>();
  const eligible = menuItems.filter((item) => {
    if (!isEligible(item) || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  // Focus on the most recently added main item for mixed carts. Ignore drinks
  // and sides if a main food is present, as they should not dominate pairings.
  const mainGroups = cartItems.map(({ item }) => foodGroup(item));
  const primary = [...mainGroups].reverse().find((group) => !["drinks", "fries", "wings", "other"].includes(group))
    || mainGroups[mainGroups.length - 1] || "other";
  const preferredGroups = PAIRINGS[primary];

  const result: MenuItem[] = [];
  const used = new Set<string>();
  const add = (item: MenuItem) => {
    if (!used.has(item.id) && result.length < limit) {
      used.add(item.id);
      result.push(item);
    }
  };

  const drinks = eligible.filter(isColdDrink);
  const drinkPreference = (item: MenuItem): number => {
    // Prefer classic individual soft drinks, rather than 1L+ bottles.
    if (/cold\s*drink\s*regular/i.test(item.name)) return 0;
    if (/345\s*ml/i.test(item.name)) return 1;
    if (/500\s*ml/i.test(item.name)) return 2;
    return 3;
  };
  drinks.sort((a, b) => drinkPreference(a) - drinkPreference(b) || a.price - b.price || a.name.localeCompare(b.name));
  const coldDrink = drinks.find((item) => !inCart.has(item.id)) || drinks[0];
  if (coldDrink) add(coldDrink);

  // Rank complementary snacks above expensive full meals, and spread options
  // across categories so the user sees variety rather than five types of fries.
  const candidates = eligible
    .filter((item) => !inCart.has(item.id) && !used.has(item.id) && foodGroup(item) !== "drinks")
    .map((item) => {
      const group = foodGroup(item);
      const position = preferredGroups.indexOf(group);
      const score = position >= 0 ? 100 - position * 17 : (group === primary ? -20 : 0);
      return { item, group, score };
    })
    .sort((a, b) => b.score - a.score || a.item.price - b.item.price || a.item.name.localeCompare(b.item.name));

  const usedGroups = new Set<FoodGroup>();
  for (const candidate of candidates) {
    if (!usedGroups.has(candidate.group)) {
      add(candidate.item);
      usedGroups.add(candidate.group);
    }
  }
  // If there are fewer than five complementary categories, fill with other
  // valid distinct menu items without showing items already in the cart.
  for (const candidate of candidates) add(candidate.item);

  // The catalog may only contain beverages; use remaining beverages if needed.
  for (const item of eligible) {
    if (foodGroup(item) === "drinks" && !inCart.has(item.id)) add(item);
  }
  return result;
}
