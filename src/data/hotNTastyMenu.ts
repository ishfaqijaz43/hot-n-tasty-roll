export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
}

export const HOT_N_TASTY_CATEGORIES: Category[] = [
  { id: "all", name: "🔥 All Items" },
  { id: "deals-festival", name: "🎁 Deals Festival" },
  { id: "chicken-rolls", name: "🌯 Chicken Rolls" },
  { id: "crispy-rolls", name: "⚡ Crispy Rolls" },
  { id: "malai-boti-rolls", name: "🍢 Malai Boti Rolls" },
  { id: "reshmi-kabab-rolls", name: "🍢 Reshmi Kabab Rolls" },
  { id: "beef-rolls", name: "🥩 Beef Rolls" },
  { id: "burgers", name: "🍔 Burgers" },
  { id: "broast", name: "🍗 Broast" },
  { id: "bbq-plates", name: "🔥 BBQ Plates" },
  { id: "sandwiches", name: "🥪 Sandwiches" },
  { id: "pasta", name: "🍝 Pasta" },
  { id: "chinese", name: "🥢 Chinese" },
  { id: "drinks", name: "🥤 Drinks" }
];

export const defaultHotNTastyMenuItems: MenuItem[] = [
  // Deals Festival
  {
    id: "deal-1",
    name: "Festival Deal 1",
    price: 599,
    description: "2 Chicken Garlic Mayo Rolls + 1 Soft Drink (345ml)",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-2",
    name: "Festival Deal 2",
    price: 899,
    description: "1 Chicken Burger + 1 Crispy Roll + Fries + 1 Soft Drink (345ml)",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-3",
    name: "Mega Roll Feast",
    price: 1299,
    description: "4 Chicken Chatni Rolls + 1 Litre Soft Drink",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1619193100624-f6755258f275?auto=format&fit=crop&w=600&q=80"
  },

  // Chicken Rolls
  {
    id: "chk-roll-1",
    name: "Chicken Chatni Roll",
    price: 220,
    description: "Spicy grilled chicken boti wrapped in a crispy paratha with tangy green chutney.",
    category: "chicken-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-roll-2",
    name: "Chicken Garlic Mayo Roll",
    price: 250,
    description: "Tender chicken boti with rich, creamy garlic mayo sauce wrapped in golden paratha.",
    category: "chicken-rolls",
    image: "https://images.unsplash.com/photo-1619193100624-f6755258f275?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-roll-3",
    name: "Chicken Cheese Roll",
    price: 290,
    description: "Juicy chicken boti with melted cheddar cheese and signature sauces.",
    category: "chicken-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },

  // Crispy Rolls
  {
    id: "crispy-roll-1",
    name: "Crispy Zinger Roll",
    price: 280,
    description: "Golden fried crispy chicken strip with lettuce and mayo in a paratha.",
    category: "crispy-rolls",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "crispy-roll-2",
    name: "Crispy Cheese Zinger Roll",
    price: 330,
    description: "Crispy zinger strip with a slice of melted cheese and spicy sauce.",
    category: "crispy-rolls",
    image: "https://images.unsplash.com/photo-1619193100624-f6755258f275?auto=format&fit=crop&w=600&q=80"
  },

  // Malai Boti Rolls
  {
    id: "malai-roll-1",
    name: "Chicken Malai Boti Roll",
    price: 280,
    description: "Melt-in-your-mouth cream-marinated chicken boti wrapped in a soft paratha.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "malai-roll-2",
    name: "Malai Garlic Mayo Roll",
    price: 310,
    description: "Creamy malai boti with extra garlic mayo sauce for a rich flavor.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },

  // Reshmi Kabab Rolls
  {
    id: "reshmi-roll-1",
    name: "Chicken Reshmi Kabab Roll",
    price: 260,
    description: "Soft and silky chicken reshmi kabab wrapped with onions and chutney.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "reshmi-roll-2",
    name: "Reshmi Kabab Cheese Roll",
    price: 310,
    description: "Silky reshmi kabab with a generous layer of melted cheese.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },

  // Beef Rolls
  {
    id: "beef-roll-1",
    name: "Beef Bihari Boti Roll",
    price: 320,
    description: "Spicy, tender beef bihari boti with onions and green chutney.",
    category: "beef-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-roll-2",
    name: "Beef Dhaga Kabab Roll",
    price: 300,
    description: "Traditional melt-in-mouth beef dhaga kabab wrapped in paratha.",
    category: "beef-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },

  // Burgers
  {
    id: "burger-1",
    name: "Crispy Zinger Burger",
    price: 350,
    description: "Crispy chicken breast fillet, lettuce, and signature mayo in a toasted bun.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-2",
    name: "Zinger Cheese Burger",
    price: 400,
    description: "Crispy zinger fillet topped with a slice of melted cheddar cheese.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "burger-3",
    name: "Beef Grilled Burger",
    price: 450,
    description: "Juicy flame-grilled beef patty with caramelized onions and cheese.",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },

  // Broast
  {
    id: "broast-1",
    name: "Quarter Chicken Broast (Leg)",
    price: 480,
    description: "Crispy, golden deep-fried chicken leg served with fries, bun, and garlic sauce.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-2",
    name: "Quarter Chicken Broast (Breast)",
    price: 520,
    description: "Crispy, golden deep-fried chicken breast served with fries, bun, and garlic sauce.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },

  // BBQ Plates
  {
    id: "bbq-1",
    name: "Chicken Tikka Chest Plate",
    price: 380,
    description: "Spicy flame-grilled chicken chest piece served with paratha and raita.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-2",
    name: "Chicken Malai Boti Plate",
    price: 550,
    description: "10 pieces of creamy, melt-in-your-mouth grilled chicken malai boti.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },

  // Sandwiches
  {
    id: "sandwich-1",
    name: "Club Sandwich",
    price: 420,
    description: "Classic triple-decker sandwich with chicken, egg, cheese, lettuce, and fries.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-2",
    name: "Grilled Chicken Sandwich",
    price: 380,
    description: "Toasted bread filled with seasoned grilled chicken and creamy spread.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80"
  },

  // Pasta
  {
    id: "pasta-1",
    name: "Creamy Alfredo Pasta",
    price: 590,
    description: "Fettuccine pasta tossed in rich, creamy white sauce with grilled chicken and mushrooms.",
    category: "pasta",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pasta-2",
    name: "Spicy Macaroni Pasta",
    price: 480,
    description: "Stir-fried macaroni with spicy chicken chunks, bell peppers, and local spices.",
    category: "pasta",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },

  // Chinese
  {
    id: "chinese-1",
    name: "Chicken Shashlik with Egg Fried Rice",
    price: 650,
    description: "Sweet and sour chicken shashlik gravy served with premium egg fried rice.",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chinese-2",
    name: "Chicken Manchurian with Fried Rice",
    price: 650,
    description: "Classic spicy Chinese Manchurian gravy served with egg fried rice.",
    category: "chinese",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },

  // Drinks
  {
    id: "drink-1",
    name: "Soft Drink 345ml",
    price: 120,
    description: "Chilled Pepsi, 7Up, or Mirinda.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-2",
    name: "Soft Drink 1 Litre",
    price: 220,
    description: "Chilled 1 Litre bottle for sharing.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-3",
    name: "Mineral Water Small",
    price: 70,
    description: "Chilled pure drinking water.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1608885898957-a599fb15ec36?auto=format&fit=crop&w=600&q=80"
  }
];