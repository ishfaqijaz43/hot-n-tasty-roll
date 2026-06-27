export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const CATEGORIES = [
  { id: "all", name: "🔥 All Items" },
  { id: "delicious-deals", name: "🎁 Deals" },
  { id: "burgers", name: "🍔 Burgers" },
  { id: "bbq", name: "🍢 BBQ Tikka" },
  { id: "rolls", name: "🌯 Rolls" },
  { id: "wraps", name: "🌮 Wraps" },
  { id: "arabic-shawarma", name: "🥙 Shawarma" },
  { id: "broast", name: "🍗 Broast" },
  { id: "pizza", name: "🍕 Pizza" },
  { id: "pasta", name: "🍝 Pasta" },
  { id: "fries", name: "🍟 Fries" },
  { id: "sandwiches", name: "🥪 Sandwiches" },
  { id: "combo-meals", name: "🍱 Combos" },
  { id: "sides", name: "🥗 Sides" },
  { id: "beverages", name: "🥤 Drinks" }
];

export const menuItems: MenuItem[] = [
  // SIDES
  {
    id: "side-cheese-slice",
    name: "Cheese Slice",
    price: 50,
    description: "Melted cheese on a crispy base.",
    category: "sides",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "side-raita",
    name: "Raita",
    price: 50,
    description: "Plain yogurt with raw or cooked vegetables.",
    category: "sides",
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "side-double-paratha",
    name: "Double Paratha",
    price: 140,
    description: "Flaky, layered flatbread.",
    category: "sides",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "side-mayo",
    name: "Mayo",
    price: 50,
    description: "Creamy condiment.",
    category: "sides",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "side-single-paratha",
    name: "Single Paratha",
    price: 70,
    description: "Flaky, layered flatbread.",
    category: "sides",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "side-bread",
    name: "Bread",
    price: 50,
    description: "Savory loaf.",
    category: "sides",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },

  // BROAST
  {
    id: "broast-leg",
    name: "Leg Broast",
    price: 550,
    description: "Single serving crispy, deep-fried chicken.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-half",
    name: "Half Broast",
    price: 1150,
    description: "Crispy, deep-fried chicken seasoned to perfection.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-full",
    name: "Full Broast",
    price: 2300,
    description: "Crispy, deep-fried chicken seasoned to perfection.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-breast",
    name: "Breast Broast",
    price: 600,
    description: "Crispy, golden-fried chicken breast.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },

  // ARABIC SHAWARMA
  {
    id: "shawarma-classic",
    name: "Classic Shawarma",
    price: 220,
    description: "Chicken and beef skewers with lettuce, tomatoes, pickles, and garlic sauce.",
    category: "arabic-shawarma",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "shawarma-zinger-cheese",
    name: "Zinger Shawarma With Cheese",
    price: 350,
    description: "Crispy chicken skewers with cheese, lettuce, and spicy garlic.",
    category: "arabic-shawarma",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "shawarma-veg",
    name: "Vegetarian Shawarma",
    price: 200,
    description: "Spices mixed through cooked mushrooms and fresh vegetables.",
    category: "arabic-shawarma",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "shawarma-classic-cheese",
    name: "Classic Shawarma With Cheese",
    price: 270,
    description: "Chicken and beef skewers with cheese and hummus dips.",
    category: "arabic-shawarma",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "shawarma-zinger",
    name: "Zinger Shawarma",
    price: 300,
    description: "Crispy chicken skewers served with garlic and hummus dips.",
    category: "arabic-shawarma",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600&q=80"
  },

  // WRAPS
  {
    id: "wrap-crunchy-cheese",
    name: "The Crunchy Cheese Wrap",
    price: 500,
    description: "Golden, crispy wrap oozing with melted cheese.",
    category: "wraps",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wrap-crunchy",
    name: "The Crunchy Wrap",
    price: 450,
    description: "Grilled tortilla packed with savory fillings and satisfying crunch.",
    category: "wraps",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wrap-afghani",
    name: "Afghani Wrap",
    price: 500,
    description: "Spiced grilled meat, fresh veggies, and creamy sauces.",
    category: "wraps",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wrap-chipotle",
    name: "The Chipotle Wrap",
    price: 450,
    description: "Tortilla wrap packed with grilled meat and zesty chipotle sauce.",
    category: "wraps",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wrap-signature",
    name: "The Chilli Signature Wrap",
    price: 500,
    description: "Fiery, flavor-packed wrap loaded with spicy chili.",
    category: "wraps",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wrap-afghani-cheese",
    name: "Afghani Cheese Wrap",
    price: 550,
    description: "Rich and creamy wrap filled with marinated paneer/cheese and Afghani-style sauces.",
    category: "wraps",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },

  // ROLLS
  {
    id: "roll-veg",
    name: "Vegetable Roll",
    price: 200,
    description: "Flaky, soft, and buttery fresh roll.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-mayo-chk-cheese",
    name: "Mayo Chicken Cheese Roll",
    price: 300,
    description: "Serves with Fries and ketchup.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-beef-mayo",
    name: "Beef Mayo Roll",
    price: 250,
    description: "Flaky, soft, and buttery beef roll.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-mughlai-chk",
    name: "Mughlai Chicken Roll",
    price: 250,
    description: "With Fries and ketchup.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-chk-cheese",
    name: "Chicken Cheese Roll",
    price: 250,
    description: "1 Serve.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-kabab-cheese",
    name: "Kabab Cheese Roll",
    price: 200,
    description: "1 Serve.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-mayo-chk",
    name: "Mayo Chicken Roll",
    price: 250,
    description: "With Fries and ketchup.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-mayo-zinger-cheese",
    name: "Mayo Zinger Cheese Roll",
    price: 400,
    description: "With Fries and ketchup.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-mayo-zinger",
    name: "Mayo Zinger Roll",
    price: 350,
    description: "Crispy fried chicken, fresh veggies, and tangy sauce.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-beef-cheese",
    name: "Beef Cheese Roll",
    price: 300,
    description: "Flaky, soft, and buttery beef roll.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-beef-boti",
    name: "Beef Boti Roll",
    price: 250,
    description: "Tender beef boti wrapped in soft roll.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-kabab-mayo",
    name: "Kebab Mayo Roll",
    price: 200,
    description: "Flavorful kebab with creamy mayo.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-chk-chutney",
    name: "Chicken Chutney Roll",
    price: 220,
    description: "Chicken boti with local green chutney.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "roll-kabab",
    name: "Kebab Roll",
    price: 170,
    description: "Juicy kebab wrapped in a crispy paratha.",
    category: "rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },

  // DELICIOUS DEALS
  {
    id: "deal-1",
    name: "Deal 1",
    price: 600,
    description: "Chicken Burger & half club sandwich.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-2",
    name: "Deal 2",
    price: 730,
    description: "Zinger Cheese Burger & 1 Chicken Mayo Roll.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-3",
    name: "Deal 3",
    price: 1000,
    description: "Crispy quarter broast (leg) & zinger burger.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-4",
    name: "Deal 4",
    price: 750,
    description: "Crispy broast qtr (leg), half club sandwich.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-5",
    name: "Deal 5",
    price: 700,
    description: "Zinger Burger with Half Club Sandwich.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-6",
    name: "Deal 6",
    price: 700,
    description: "Crispy broast, chicken roll.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-7",
    name: "Deal 7",
    price: 2800,
    description: "3 Crispy broast qtr (leg), 2 crispy broast chest, 1.5 ltr drink.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-8",
    name: "Deal 8",
    price: 750,
    description: "Zinger burger & 1 Chatni Roll with 345 Ml.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-9",
    name: "Deal 9",
    price: 2600,
    description: "4 Zinger Burger and 4 Kabab Roll.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-10",
    name: "Deal 10",
    price: 600,
    description: "1 Chicken Tikka, 1 Chicken Roll and 1 Paratha.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-11",
    name: "Deal 11",
    price: 1600,
    description: "2 Chicken Roll, 1 Beef Roll, 1 Loaded zinger burger and 1 leg broast.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-12",
    name: "Deal 12",
    price: 1000,
    description: "1 Tikka Leg, 1 Tikka Chest with 4 Parathy.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-13",
    name: "Deal 13",
    price: 700,
    description: "1 Zinger Burger, 1 Kabab Roll with 345Ml Drink.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-14",
    name: "Deal 14",
    price: 2300,
    description: "2 Large Pizzas.",
    category: "delicious-deals",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  },

  // PIZZA
  {
    id: "pizza-6",
    name: "6 Inches Pan Pizza",
    price: 500,
    description: "Freshly baked single serving.",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pizza-9",
    name: "9 Inches Pizza",
    price: 900,
    description: "Serving for 1 to 2 persons.",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pizza-12",
    name: "12 Inches Pizza",
    price: 1200,
    description: "Serving for 2 to 3 persons.",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  },

  // COMBO MEALS
  {
    id: "combo-1",
    name: "Combo Meal 1",
    price: 720,
    description: "Zinger Burger, Kabab roll, soft drink, fries & coleslaw.",
    category: "combo-meals",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "combo-2",
    name: "Combo Meal 2",
    price: 750,
    description: "Zinger Burger, chicken roll, fries or coleslaw & 345ml cold drink.",
    category: "combo-meals",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80"
  },

  // PASTA
  {
    id: "pasta-regular",
    name: "Regular Pasta",
    price: 600,
    description: "Creamy chicken pasta dish with rich sauce, herbs, and cheese.",
    category: "pasta",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pasta-jumbo",
    name: "Jumbo Pasta",
    price: 800,
    description: "Large creamy chicken pasta dish with rich sauce and cheese layers.",
    category: "pasta",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },

  // FRIES
  {
    id: "fries-twister",
    name: "Potato Twister",
    price: 150,
    description: "Crispy swirled whole potato fry.",
    category: "fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fries-loaded-regular",
    name: "Regular Loaded Fries",
    price: 600,
    description: "Crispy fries topped with savory chicken, melted cheese, and marinara.",
    category: "fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fries-loaded-jumbo",
    name: "Jumbo Loaded Fries",
    price: 800,
    description: "Huge box of fries topped with chicken, melted cheese, and marinara.",
    category: "fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fries-lava-pizza",
    name: "Lava Pizza Fries",
    price: 830,
    description: "Crispy fries smothered in spicy sauce, chicken, gooey cheese, and jalapeños.",
    category: "fries",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
  },

  // BURGERS
  {
    id: "burger-chicken",
    name: "Chicken Burger",
    price: 400,
    description: "Juicy chicken patty, fresh veggies, and savory sauces.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-bbq-malai",
    name: "Bbq Malai Burger",
    price: 450,
    description: "Tender malai chicken patty with smoky BBQ sauce.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-chicken-cheese",
    name: "Chicken Burger With Cheese",
    price: 450,
    description: "Chicken burger topped with melted cheese.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-loaded-zinger",
    name: "Loaded Zinger Burger",
    price: 500,
    description: "Crispy zinger chicken fillet with spicy sauces.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-bbq-malai-cheese",
    name: "Bbq Malai Cheese Burger",
    price: 500,
    description: "Juicy malai chicken patty, BBQ sauce, and cheese.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-double-decker",
    name: "Double Decker Chicken Burger",
    price: 550,
    description: "Two juicy chicken patties in a soft bun.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-sriracha-zinger",
    name: "Siracha Zinger Burger",
    price: 550,
    description: "Spicy zinger chicken patty drizzled with tangy Sriracha.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-loaded-zinger-cheese",
    name: "Loaded Zinger Cheese Burger",
    price: 550,
    description: "Crispy zinger fillet with fresh veggies and melted cheese.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-dynamite-zinger",
    name: "Dynamite Zinger Burger",
    price: 550,
    description: "Crispy zinger chicken patty topped with spicy dynamite sauce.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-jalapeno-zinger",
    name: "Jalapeno Zinger Burger",
    price: 550,
    description: "Spicy zinger chicken patty paired with fiery jalapeños.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-ranch-zinger",
    name: "Ranch Zinger Burger",
    price: 550,
    description: "Crispy zinger chicken patty topped with creamy ranch sauce.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-special-zinger",
    name: "Special Zinger Burger",
    price: 600,
    description: "Premium thick crispy zinger fillet single serving.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-double-decker-cheese",
    name: "Double Decker Chicken Burger With Cheese",
    price: 600,
    description: "Two chicken patties stacked with melted cheese layers.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-mega-zinger",
    name: "Mega Zinger Burger",
    price: 800,
    description: "Bold massive burger with crispy chicken patty, cheese, and zesty sauces.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-beef-no-cheese",
    name: "Beef Burger Without Cheese",
    price: 500,
    description: "Double beef patties with dressing of mayo and lettuce.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-beef-cheese",
    name: "Beef Burger With Cheese",
    price: 550,
    description: "Stacked double beef patties with rich melted cheese.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },

  // BBQ
  {
    id: "bbq-tikka-leg",
    name: "Chicken Tikka Leg",
    price: 400,
    description: "Juicy, spice-marinated chicken leg roasted to perfection.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-malai-leg",
    name: "Malai Tikka Leg",
    price: 450,
    description: "Tender chicken leg marinated in rich fresh cream and mild spices.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-tikka-breast",
    name: "Chicken Tikka Breast",
    price: 450,
    description: "Tender chicken breast marinated in aromatic tikka spices.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-seekh-kabab",
    name: "Chicken Seekh Kabab",
    price: 500,
    description: "1 Plate of skewered minced chicken.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-malai-chest",
    name: "Malai Tikka Chest",
    price: 500,
    description: "Chicken chest pieces marinated in fresh cream and house spices.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-gola-kabab",
    name: "Gola Kabab Plate",
    price: 500,
    description: "Soft, melt-in-your-mouth gola kababs serving.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-boti",
    name: "Chicken Boti",
    price: 500,
    description: "1 Plate of succulent marinated grilled chicken cubes.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-reshmi-kabab",
    name: "Chicken Reshmi Kabab",
    price: 500,
    description: "1 Plate of soft, juicy chicken resham kababs.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-beef-seekh",
    name: "Beef Seekh Kabab",
    price: 500,
    description: "Minced beef blended with aromatic spices and grilled.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-malai-boti",
    name: "Chicken Malai Boti",
    price: 600,
    description: "Soft and juicy boneless chicken cubes in fresh cream.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-beef-bihari",
    name: "Beef Bihari Boti",
    price: 600,
    description: "Chunks of beef marinated in rich Bihari spices, grilled to smoky perfection.",
    category: "bbq",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },

  // SANDWICHES
  {
    id: "sandwich-chicken",
    name: "Chicken Sandwich",
    price: 400,
    description: "Classic sandwich with tender chicken and savory sauces.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-club",
    name: "Club Sandwich",
    price: 500,
    description: "Classic triple-layered sandwich stacked with chicken, egg, and veggies.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-club-cheese",
    name: "Club Cheese Sandwich",
    price: 550,
    description: "Single serving classic club sandwich loaded with cheese.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-bbq-club",
    name: "Bbq Club Sandwich",
    price: 600,
    description: "Triple-layered sandwich filled with smoky BBQ chicken and egg.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-malai-club",
    name: "Malai Club Sandwich",
    price: 600,
    description: "Triple-layered sandwich with malai-marinated chicken.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-zinger-club",
    name: "Zinger Club Sandwich",
    price: 600,
    description: "Triple-layered sandwich with crispy zinger chicken and egg.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-bbq-club-cheese",
    name: "Bbq Club Cheese Sandwich",
    price: 650,
    description: "Triple-layered sandwich with smoky BBQ chicken and cheese.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-zinger-club-cheese",
    name: "Zinger Club Cheese Sandwich",
    price: 650,
    description: "Triple-decker sandwich with crispy zinger chicken and cheese.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-mexican",
    name: "Mexican Sandwich",
    price: 650,
    description: "Zesty sandwich loaded with spicy chicken and bold Mexican flavors.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-malai-club-cheese",
    name: "Malai Club Cheese Sandwich",
    price: 650,
    description: "Creamy malai chicken sandwich topped with melted cheese layers.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-cheesy-lava",
    name: "Cheesy Lava Pizza Sandwich",
    price: 750,
    description: "Crispy golden structure loaded with molten cheese and rich sauce.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },

  // BEVERAGES
  {
    id: "bev-water-small",
    name: "Mineral Water Small",
    price: 80,
    description: "Pure natural hydration.",
    category: "beverages",
    image: "https://images.unsplash.com/photo-1608885898957-a599fb15ec36?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bev-345ml",
    name: "Cold Drink 345ml",
    price: 140,
    description: "Single serving bottle.",
    category: "beverages",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bev-500ml",
    name: "Cold Drink 500ml",
    price: 170,
    description: "Choice of Pepsi / 7Up bottle.",
    category: "beverages",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bev-sting",
    name: "Sting 500ml",
    price: 190,
    description: "Energy drink bottle.",
    category: "beverages",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  }
];