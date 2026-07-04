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
  { id: "beef-boti-rolls", name: "🥩 Beef Boti Rolls" },
  { id: "beef-kabab-rolls", name: "🥩 Beef Kabab Rolls" },
  { id: "chicken-burgers", name: "🍔 Chicken Burgers" },
  { id: "beef-burgers", name: "🍔 Beef Burgers" },
  { id: "broast", name: "🍗 Chicken Broast" },
  { id: "wings-appetizers", name: "🍗 Wings & Appetizers" },
  { id: "fries", name: "🍟 French Fries" },
  { id: "bbq-plates", name: "🔥 BBQ Plates" },
  { id: "sandwiches", name: "🥪 Sandwiches" },
  { id: "pasta", name: "🍝 Pasta" },
  { id: "chinese-fried-rice", name: "🥢 Chinese Fried Rice" },
  { id: "chinese-chowmein", name: "🥢 Chinese Chowmein" },
  { id: "chinese-rice-counter", name: "🥢 Chinese with Rice" },
  { id: "drinks", name: "🥤 Drinks" }
];

export const defaultHotNTastyMenuItems: MenuItem[] = [
  // --- HOT N TASTY DEALS FESTIVAL ---
  {
    id: "deal-1",
    name: "Deal 1",
    price: 700,
    description: "1 Zinger Burger, 2 Pcs Chicken Wings, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-2",
    name: "Deal 2",
    price: 800,
    description: "1 BBQ Sandwich, 1 Chicken Juicy Roll, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-3",
    name: "Deal 3",
    price: 750,
    description: "1 Chicken Burger, Qtr. Breast (Leg Pcs), 1 Plain Bun, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-4",
    name: "Deal 4",
    price: 700,
    description: "1 Crispy Breast Qtr. (Leg Pcs), 1 Malai Mayo Roll, 1 Plain Bun, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-5",
    name: "Deal 5",
    price: 850,
    description: "1 Chicken Big Burger, 1 Chicken Behari Tikka (Leg Pcs), Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-6",
    name: "Deal 6",
    price: 900,
    description: "1 Mega Zinger Burger, 1 Chicken Malai Spicy Mayo Roll, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-7",
    name: "Deal 7",
    price: 550,
    description: "1 Junior Zinger Burger, 1 Pc Drumstick, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-8",
    name: "Deal 8",
    price: 600,
    description: "1 Zinger Burger, Half Club Sandwich, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-9",
    name: "Deal 9",
    price: 1350,
    description: "4 Pcs Drumstick, 2 Mayo Rolls, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-10",
    name: "Deal 10",
    price: 650,
    description: "1 Quarter Breast (Leg Pcs), Half Club Sandwich, 1 Plain Bun, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-11",
    name: "Deal 11",
    price: 950,
    description: "3 Pcs Drumstick, 1 Chicken Sandwich, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-12",
    name: "Deal 12",
    price: 1100,
    description: "3 Pcs Drumstick, 2 Chicken Chatni Rolls, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-13",
    name: "Deal 13",
    price: 1150,
    description: "1 Chicken Boti Plate, 1 Behari Tikka, 4 Parathas, Chatni Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-14",
    name: "Deal 14",
    price: 600,
    description: "1 Junior Zinger Burger, 1 Chicken Chatni Roll, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-15",
    name: "Deal 15",
    price: 700,
    description: "1 Junior Zinger Burger, 1 Chicken Chatni Roll, 1 Pc Wings, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-16",
    name: "Deal 16",
    price: 1450,
    description: "2 Chicken Tikka (Leg Pcs), 2 Chicken Mayo Rolls, 2 Parathas, 500ml Cold Drink, Raita Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-17",
    name: "Deal 17",
    price: 700,
    description: "1 Chicken Tikka (Leg Pcs), 1 Chicken Roll, 2 Parathas, Raita Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-18",
    name: "Deal 18",
    price: 800,
    description: "1 Plate Reshmi Kabab, 1 Mayo Roll, 2 Parathas, Raita Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-19",
    name: "Deal 19",
    price: 1100,
    description: "1 Plate Reshmi Kabab, 1 Plate Malai Boti, 2 Parathas, Raita Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-20",
    name: "Deal 20",
    price: 1300,
    description: "1 Plate Malai Boti, 1 Chicken Boti, 4 Parathas, Raita Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-21",
    name: "Deal 21",
    price: 850,
    description: "1 Plate Chicken Boti, 1 Chicken Mayo Roll, 1 Paratha, Raita Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-22",
    name: "Deal 22",
    price: 500,
    description: "1 Chicken Burger, 1 Drumstick, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-23",
    name: "Deal 23",
    price: 700,
    description: "1 Zinger Burger, 1 Chicken Crispy Roll, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-24",
    name: "Deal 24",
    price: 600,
    description: "1 Chicken Burger, 1 Chicken Mayo Garlic Roll, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-25",
    name: "Deal 25",
    price: 550,
    description: "1 Beef Burger, 1 Chicken Roll, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-26",
    name: "Deal 26",
    price: 700,
    description: "1 Club Sandwich, 1 Crispy Roll, Fries, Coleslaw",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-27",
    name: "Deal 27",
    price: 2150,
    description: "2 Tikka Chest, 2 Tikka Leg, 5 Parathas, 4 Chapati, Raita Salad, 1.5 Ltr Cold Drink",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-28",
    name: "Deal 28",
    price: 2350,
    description: "1 Qtr Leg, 1 Qtr Chest, 1 Chicken Burger, 1 Zinger Burger, 1.5 Ltr Cold Drink",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-29",
    name: "Deal 29",
    price: 650,
    description: "Chinese - 1 Chicken Fried Rice, Half Plate Malai Boti, Chatni Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-30",
    name: "Deal 30",
    price: 1200,
    description: "Chinese - 1 Shashlik with Rice, 1 Chicken Chowmein",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-31",
    name: "Deal 31",
    price: 650,
    description: "Chinese - 1 Vegetable Fried Rice, Half Plate Chicken Boti, Chatni Salad",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "deal-32",
    name: "Deal 32",
    price: 1250,
    description: "Chinese - 1 Chicken Shashlik with Rice, Zinger Burger with Fries, 1 Cold Drink 345ml",
    category: "deals-festival",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHICKEN ROLLS ---
  {
    id: "chk-roll-1",
    name: "Chicken Chatni Roll",
    price: 250,
    description: "Spicy grilled chicken boti wrapped in a crispy paratha with green chutney.",
    category: "chicken-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-roll-2",
    name: "Chicken Garlic Mayo Roll",
    price: 280,
    description: "Tender chicken boti with rich, creamy garlic mayo sauce.",
    category: "chicken-rolls",
    image: "https://images.unsplash.com/photo-1619193100624-f6755258f275?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-roll-3",
    name: "Chicken Mayo Cheese Roll",
    price: 300,
    description: "Juicy chicken boti with melted cheddar cheese and mayo.",
    category: "chicken-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-roll-4",
    name: "Chicken Behari Cheese Roll",
    price: 300,
    description: "Spicy Behari chicken boti with melted cheese.",
    category: "chicken-rolls",
    image: "https://images.unsplash.com/photo-1619193100624-f6755258f275?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-roll-5",
    name: "Chicken Behari Garlic Mayo Roll",
    price: 280,
    description: "Spicy Behari chicken boti with rich garlic mayo.",
    category: "chicken-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHICKEN CRISPY ROLLS ---
  {
    id: "crispy-roll-1",
    name: "Chicken Crispy Mayo Roll",
    price: 300,
    description: "Golden fried crispy chicken strip with mayo in a paratha.",
    category: "crispy-rolls",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "crispy-roll-2",
    name: "Chicken Crispy Cheese Roll",
    price: 350,
    description: "Crispy chicken strip with a slice of melted cheese.",
    category: "crispy-rolls",
    image: "https://images.unsplash.com/photo-1619193100624-f6755258f275?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "crispy-roll-3",
    name: "Chicken Crispy Jumbo Roll",
    price: 600,
    description: "Double crispy chicken strips with signature sauces.",
    category: "crispy-rolls",
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "crispy-roll-4",
    name: "Chicken Crispy Jumbo Cheese Roll",
    price: 650,
    description: "Double crispy chicken strips with extra melted cheese.",
    category: "crispy-rolls",
    image: "https://images.unsplash.com/photo-1619193100624-f6755258f275?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHICKEN MALAI BOTI ROLLS ---
  {
    id: "malai-roll-1",
    name: "Chicken Malai Chatni Roll",
    price: 250,
    description: "Melt-in-your-mouth cream-marinated chicken boti with green chutney.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "malai-roll-2",
    name: "Chicken Malai Garlic Mayo Roll",
    price: 280,
    description: "Creamy malai boti with extra garlic mayo sauce.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "malai-roll-3",
    name: "Chicken Malai Cheese Roll",
    price: 300,
    description: "Creamy malai boti with melted cheddar cheese.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "malai-roll-4",
    name: "Chicken Malai Behari Chatni Roll",
    price: 300,
    description: "Creamy Behari malai boti with green chutney.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "malai-roll-5",
    name: "Chicken Malai Behari Garlic Mayo Roll",
    price: 300,
    description: "Creamy Behari malai boti with garlic mayo.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "malai-roll-6",
    name: "Chicken Malai Behari Cheese Roll",
    price: 350,
    description: "Creamy Behari malai boti with melted cheese.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "malai-roll-7",
    name: "Chicken Malai Spicy Mayo Roll",
    price: 280,
    description: "Creamy malai boti with spicy mayo sauce.",
    category: "malai-boti-rolls",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHICKEN RESHMI KABAB ROLLS ---
  {
    id: "reshmi-roll-1",
    name: "Chicken Reshmi Kabab Chatni Roll",
    price: 230,
    description: "Soft chicken reshmi kabab wrapped with green chutney.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "reshmi-roll-2",
    name: "Chicken Reshmi Garlic Mayo Roll",
    price: 260,
    description: "Soft chicken reshmi kabab with garlic mayo.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "reshmi-roll-3",
    name: "Chicken Reshmi Cheese Roll",
    price: 300,
    description: "Soft chicken reshmi kabab with melted cheese.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "reshmi-roll-4",
    name: "Chicken Reshmi Behari Chatni Roll",
    price: 260,
    description: "Soft chicken reshmi kabab with Behari spices and chutney.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "reshmi-roll-5",
    name: "Chicken Reshmi Behari Garlic Mayo Roll",
    price: 300,
    description: "Soft chicken reshmi kabab with Behari spices and garlic mayo.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "reshmi-roll-6",
    name: "Chicken Reshmi Behari Cheese Roll",
    price: 300,
    description: "Soft chicken reshmi kabab with Behari spices and melted cheese.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "reshmi-roll-7",
    name: "Chicken Reshmi Spicy Mayo Roll",
    price: 260,
    description: "Soft chicken reshmi kabab with spicy mayo.",
    category: "reshmi-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },

  // --- BEEF BOTI ROLLS ---
  {
    id: "beef-boti-roll-1",
    name: "Beef Boti Roll",
    price: 250,
    description: "Spicy, tender beef boti with onions and green chutney.",
    category: "beef-boti-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-boti-roll-2",
    name: "Beef Garlic Mayo Roll",
    price: 280,
    description: "Tender beef boti with rich garlic mayo.",
    category: "beef-boti-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-boti-roll-3",
    name: "Beef Mayo Cheese Roll",
    price: 300,
    description: "Tender beef boti with melted cheese and mayo.",
    category: "beef-boti-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-boti-roll-4",
    name: "Beef Spicy Mayo Roll",
    price: 280,
    description: "Tender beef boti with spicy mayo.",
    category: "beef-boti-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-boti-roll-5",
    name: "Beef Jumbo Roll",
    price: 600,
    description: "Double beef boti wrapped in a large paratha.",
    category: "beef-boti-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-boti-roll-6",
    name: "Beef Jumbo Cheese Roll",
    price: 650,
    description: "Double beef boti with extra melted cheese.",
    category: "beef-boti-rolls",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },

  // --- BEEF KABAB ROLLS ---
  {
    id: "beef-kabab-roll-1",
    name: "Beef Kabab Chatni Roll",
    price: 230,
    description: "Traditional beef kabab wrapped with green chutney.",
    category: "beef-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-kabab-roll-2",
    name: "Beef Kabab Garlic Roll",
    price: 260,
    description: "Traditional beef kabab with garlic mayo.",
    category: "beef-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-kabab-roll-3",
    name: "Beef Kabab Cheese Roll",
    price: 300,
    description: "Traditional beef kabab with melted cheese.",
    category: "beef-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-kabab-roll-4",
    name: "Beef Kabab Chatpata Roll",
    price: 260,
    description: "Traditional beef kabab with spicy chatpata sauce.",
    category: "beef-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-kabab-roll-5",
    name: "Beef Kabab Behari Chatni Roll",
    price: 260,
    description: "Traditional beef kabab with Behari spices and chutney.",
    category: "beef-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-kabab-roll-6",
    name: "Beef Kabab Behari Mayo Garlic Roll",
    price: 260,
    description: "Traditional beef kabab with Behari spices and garlic mayo.",
    category: "beef-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-kabab-roll-7",
    name: "Beef Kabab Behari Mayo Cheese Roll",
    price: 300,
    description: "Traditional beef kabab with Behari spices and melted cheese.",
    category: "beef-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-kabab-roll-8",
    name: "Beef Kabab Spicy Mayo Roll",
    price: 260,
    description: "Traditional beef kabab with spicy mayo.",
    category: "beef-kabab-rolls",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHICKEN BURGERS ---
  {
    id: "chk-burger-1",
    name: "Chicken Burger",
    price: 350,
    description: "Juicy chicken patty with lettuce and mayo.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-2",
    name: "Chicken Cheese Burger",
    price: 400,
    description: "Juicy chicken patty topped with melted cheese.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-3",
    name: "Chicken Big Burger",
    price: 600,
    description: "Double chicken patty with extra sauces.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-4",
    name: "Chicken Big Cheese Burger",
    price: 650,
    description: "Double chicken patty with melted cheese layers.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-5",
    name: "Chicken Zinger Burger",
    price: 500,
    description: "Crispy chicken breast fillet, lettuce, and signature mayo.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-6",
    name: "Chicken Zinger with Cheese Burger",
    price: 550,
    description: "Crispy zinger fillet topped with melted cheddar cheese.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-7",
    name: "Chicken Zinger Jumbo Burger",
    price: 750,
    description: "Double crispy zinger fillet with signature sauces.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-8",
    name: "Chicken Zinger Jumbo Cheese Burger",
    price: 800,
    description: "Double crispy zinger fillet with extra melted cheese.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-9",
    name: "Junior Zinger Burger",
    price: 400,
    description: "Perfect size crispy zinger burger for lighter appetites.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-10",
    name: "Junior Zinger Cheese Burger",
    price: 450,
    description: "Junior zinger burger with melted cheese.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chk-burger-11",
    name: "Chicken Spicy Grill Burger",
    price: 450,
    description: "Flame-grilled chicken patty with spicy sauces.",
    category: "chicken-burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },

  // --- BEEF BURGERS ---
  {
    id: "beef-burger-1",
    name: "Beef Burger",
    price: 350,
    description: "Juicy beef patty with lettuce and mayo.",
    category: "beef-burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-burger-2",
    name: "Beef Cheese Burger",
    price: 400,
    description: "Juicy beef patty topped with melted cheese.",
    category: "beef-burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-burger-3",
    name: "Beef Jumbo Burger",
    price: 600,
    description: "Double beef patty with extra sauces.",
    category: "beef-burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-burger-4",
    name: "Beef Jumbo Cheese Burger",
    price: 650,
    description: "Double beef patty with melted cheese layers.",
    category: "beef-burgers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "beef-burger-5",
    name: "Beef Spicy Grill Burger",
    price: 450,
    description: "Flame-grilled beef patty with spicy sauces.",
    category: "beef-burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHICKEN BROAST ---
  {
    id: "broast-1",
    name: "Chicken Broast Full",
    price: 2000,
    description: "Crispy, golden deep-fried full chicken served with fries, bun, and garlic sauce.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-2",
    name: "Chicken Broast Half",
    price: 1000,
    description: "Crispy, golden deep-fried half chicken served with fries, bun, and garlic sauce.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-3",
    name: "Chicken Broast Leg Pcs",
    price: 450,
    description: "Crispy, golden deep-fried chicken leg piece served with fries, bun, and garlic sauce.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-4",
    name: "Chicken Breast Chest Pcs",
    price: 550,
    description: "Crispy, golden deep-fried chicken chest piece served with fries, bun, and garlic sauce.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-5",
    name: "Chicken Cheese Broast Quarter Leg Pcs",
    price: 550,
    description: "Crispy broast leg piece topped with melted cheese.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-6",
    name: "Mayo Garlic Broast Quarter Chest Pcs",
    price: 600,
    description: "Crispy broast chest piece topped with rich garlic mayo.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "broast-7",
    name: "Mayo Garlic Broast Quarter Leg Pcs",
    price: 500,
    description: "Crispy broast leg piece topped with rich garlic mayo.",
    category: "broast",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80"
  },

  // --- WINGS & APPETIZERS ---
  {
    id: "wings-1",
    name: "Crispy Wings (5 Pcs.)",
    price: 1000,
    description: "5 pieces of crispy, golden-fried chicken wings.",
    category: "wings-appetizers",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "wings-2",
    name: "Hot & Drumstick (5 Pcs.)",
    price: 1200,
    description: "5 pieces of spicy, crispy-fried chicken drumsticks.",
    category: "wings-appetizers",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80"
  },

  // --- FRENCH FRIES ---
  {
    id: "fries-1",
    name: "Regular Fries",
    price: 200,
    description: "Crispy golden potato fries.",
    category: "fries",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fries-2",
    name: "Mayo Garlic Fries",
    price: 300,
    description: "Crispy fries topped with rich garlic mayo.",
    category: "fries",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fries-3",
    name: "Cheese Fries",
    price: 350,
    description: "Crispy fries smothered in melted cheese.",
    category: "fries",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80"
  },

  // --- B-B-Q PLATES ---
  {
    id: "bbq-1",
    name: "Chicken Tikka Leg Pcs",
    price: 400,
    description: "Spicy flame-grilled chicken leg piece served with raita.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-2",
    name: "Chicken Tikka Chest Pcs",
    price: 450,
    description: "Spicy flame-grilled chicken chest piece served with raita.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-3",
    name: "Chicken Malai Tikka Chest Pcs",
    price: 480,
    description: "Creamy, melt-in-your-mouth grilled chicken malai tikka chest piece.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-4",
    name: "Chicken Boti Plate",
    price: 500,
    description: "Succulent marinated grilled chicken boti plate.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-5",
    name: "Chicken Reshmi Kabab Plate",
    price: 500,
    description: "Soft, juicy chicken reshmi kababs plate.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-6",
    name: "Chicken Malai Boti Plate",
    price: 600,
    description: "Creamy, melt-in-your-mouth grilled chicken malai boti plate.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-7",
    name: "Beef Boti Plate",
    price: 650,
    description: "Spicy, tender beef boti plate.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "bbq-8",
    name: "Beef Kabab Plate",
    price: 600,
    description: "Traditional grilled beef kababs plate.",
    category: "bbq-plates",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },

  // --- SANDWICHES ---
  {
    id: "sandwich-1",
    name: "Chicken Sandwich",
    price: 260,
    description: "Classic sandwich with tender chicken and savory sauces.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-2",
    name: "Club Sandwich",
    price: 400,
    description: "Classic triple-decker sandwich with chicken, egg, cheese, and lettuce.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-3",
    name: "B.B.Q. Sandwich",
    price: 450,
    description: "Toasted sandwich filled with smoky BBQ chicken.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-4",
    name: "B.B.Q. Club Sandwich",
    price: 600,
    description: "Triple-decker sandwich filled with smoky BBQ chicken and egg.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-5",
    name: "Malai B.B.Q. Sandwich",
    price: 650,
    description: "Toasted sandwich with creamy malai BBQ chicken.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-6",
    name: "Beef B.B.Q. Sandwich",
    price: 700,
    description: "Toasted sandwich filled with smoky BBQ beef.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sandwich-7",
    name: "Zinger Club Sandwich",
    price: 600,
    description: "Triple-decker sandwich with crispy zinger chicken and cheese.",
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
  },

  // --- PASTA ---
  {
    id: "pasta-1",
    name: "Chicken Pasta",
    price: 600,
    description: "Delicious pasta tossed with seasoned chicken and herbs.",
    category: "pasta",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pasta-2",
    name: "Chicken Red Pasta",
    price: 600,
    description: "Pasta in rich, tangy red tomato sauce with chicken.",
    category: "pasta",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pasta-3",
    name: "Chicken Creamy Pasta",
    price: 650,
    description: "Pasta in rich, creamy white sauce with chicken.",
    category: "pasta",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pasta-4",
    name: "Vegetable Pasta",
    price: 500,
    description: "Delicious pasta tossed with fresh seasonal vegetables.",
    category: "pasta",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHINESE FRIED RICE ---
  {
    id: "rice-1",
    name: "Chicken Fried Rice",
    price: 400,
    description: "Stir-fried rice with chicken, eggs, and vegetables.",
    category: "chinese-fried-rice",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-2",
    name: "Vegetable Fried Rice",
    price: 350,
    description: "Stir-fried rice with fresh seasonal vegetables.",
    category: "chinese-fried-rice",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-3",
    name: "Egg Fried Rice",
    price: 350,
    description: "Stir-fried rice with scrambled eggs and green onions.",
    category: "chinese-fried-rice",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-4",
    name: "Chicken Masalah Rice",
    price: 400,
    description: "Spicy stir-fried rice with chicken and local masala.",
    category: "chinese-fried-rice",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHINESE CHOWMEIN ---
  {
    id: "chowmein-1",
    name: "Chicken Chowmein",
    price: 550,
    description: "Stir-fried noodles with chicken and vegetables.",
    category: "chinese-chowmein",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chowmein-2",
    name: "Vegetable Chowmein",
    price: 450,
    description: "Stir-fried noodles with fresh seasonal vegetables.",
    category: "chinese-chowmein",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chowmein-3",
    name: "Chinese Special Kofta Noodles",
    price: 500,
    description: "Stir-fried noodles topped with flavorful Chinese koftas.",
    category: "chinese-chowmein",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },

  // --- CHINESE WITH RICE COUNTER ---
  {
    id: "rice-counter-1",
    name: "Chicken Shashlik with Rice",
    price: 650,
    description: "Sweet and sour chicken shashlik gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-counter-2",
    name: "Chicken Chilli with Rice",
    price: 750,
    description: "Spicy chicken chilli gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-counter-3",
    name: "Chicken Manchurian with Rice",
    price: 750,
    description: "Classic spicy Chinese Manchurian gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-counter-4",
    name: "Chicken Jafrezi with Rice",
    price: 750,
    description: "Spicy chicken jafrezi gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-counter-5",
    name: "Chicken Chilli Garlic Rice",
    price: 750,
    description: "Spicy chicken chilli garlic gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-counter-6",
    name: "Chicken Lemon with Rice",
    price: 750,
    description: "Tangy chicken lemon gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-counter-7",
    name: "Chicken Mushroom with Rice",
    price: 750,
    description: "Savory chicken mushroom gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-counter-8",
    name: "Chicken Ginger with Rice",
    price: 750,
    description: "Aromatic chicken ginger gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "rice-counter-9",
    name: "Chicken Garlic with Rice",
    price: 750,
    description: "Rich chicken garlic gravy served with fried rice.",
    category: "chinese-rice-counter",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80"
  },

  // --- BEVERAGES / DRINKS ---
  {
    id: "drink-1",
    name: "Cold Drink Regular",
    price: 70,
    description: "Chilled regular soft drink.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-2",
    name: "Sting Regular",
    price: 70,
    description: "Chilled regular Sting energy drink.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-3",
    name: "Cold Drink (345ml)",
    price: 90,
    description: "Chilled 345ml soft drink bottle.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-4",
    name: "Sting (345ml)",
    price: 100,
    description: "Chilled 345ml Sting energy drink bottle.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-5",
    name: "Cold Drink (500ml)",
    price: 120,
    description: "Chilled 500ml soft drink bottle.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-6",
    name: "Sting (500ml)",
    price: 130,
    description: "Chilled 500ml Sting energy drink bottle.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-7",
    name: "Cold Drink (1000ml)",
    price: 180,
    description: "Chilled 1 Litre soft drink bottle.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-8",
    name: "Cold Drink 1.5 Ltr",
    price: 240,
    description: "Chilled 1.5 Litre soft drink bottle.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-9",
    name: "Mineral Water Small",
    price: 60,
    description: "Chilled small mineral water bottle.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1608885898957-a599fb15ec36?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "drink-10",
    name: "Mineral Water Large",
    price: 120,
    description: "Chilled large mineral water bottle.",
    category: "drinks",
    image: "https://images.unsplash.com/photo-1608885898957-a599fb15ec36?auto=format&fit=crop&w=600&q=80"
  }
];