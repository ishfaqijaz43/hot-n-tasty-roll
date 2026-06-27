import { MenuItem } from "./menu/types";
import { CATEGORIES } from "./menu/categories";
import { sidesItems } from "./menu/items/sides";
import { broastItems } from "./menu/items/broast";
import { shawarmaItems } from "./menu/items/shawarma";
import { wrapsItems } from "./menu/items/wraps";
import { rollsItems } from "./menu/items/rolls";
import { dealsItems } from "./menu/items/deals";
import { pizzaItems } from "./menu/items/pizza";
import { combosItems } from "./menu/items/combos";
import { pastaItems } from "./menu/items/pasta";
import { friesItems } from "./menu/items/fries";
import { burgersItems } from "./menu/items/burgers";
import { bbqItems } from "./menu/items/bbq";
import { sandwichesItems } from "./menu/items/sandwiches";
import { beveragesItems } from "./menu/items/beverages";

export type { MenuItem };
export { CATEGORIES };

export const menuItems: MenuItem[] = [
  ...sidesItems,
  ...broastItems,
  ...shawarmaItems,
  ...wrapsItems,
  ...rollsItems,
  ...dealsItems,
  ...pizzaItems,
  ...combosItems,
  ...pastaItems,
  ...friesItems,
  ...burgersItems,
  ...bbqItems,
  ...sandwichesItems,
  ...beveragesItems
];