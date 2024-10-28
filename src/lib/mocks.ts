import { MealPlan, Meal } from "@/types";

export const mockMealPlan: MealPlan = {
  id: "mock-plan-1",
  user_id: "mock-user-1",
  name: "Mock Meal Plan",
  start_date: new Date().toISOString(),
  end_date: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
  days: [
    {
      id: "day-1",
      meal_plan_id: "mock-plan-1",
      date: new Date(),
      day_of_week: "Monday",
      meal_day_id: "meal-day-1",
      total_calories: 1200,
      total_protein: 75,
      total_carbs: 100,
      total_fats: 45,
      meals: [
        {
          id: "1",
          name: "Oatmeal with Berries",
          type: "breakfast",
          meal_type: "breakfast",
          serving_size: 1,
          calories: 300,
          protein: 10,
          carbs: 50,
          fats: 5,
          recipe_id: "recipe-1",
          recipe: {
            author: "System",
            ingredients: ["Oats", "Milk", "Mixed berries", "Honey"],
            instructions: ["Cook oats with milk", "Top with berries and honey"],
          },
          nutrition: { calories: 300, protein: 10, carbs: 50, fats: 5 },
          image: "/oatmeal-with-berries.webp",
        },
        {
          id: "2",
          name: "Grilled Chicken Salad",
          type: "lunch",
          meal_type: "lunch",
          serving_size: 1,
          calories: 400,
          protein: 30,
          carbs: 20,
          fats: 15,
          recipe_id: "recipe-2",
          recipe: {
            author: "System",
            ingredients: ["Chicken breast", "Mixed greens", "Tomatoes", "Cucumber", "Olive oil"],
            instructions: ["Grill chicken", "Mix vegetables", "Dress with olive oil"],
          },
          nutrition: { calories: 400, protein: 30, carbs: 20, fats: 15 },
          image: "/grilled-chicken-salad.webp",
        },
        {
          id: "3",
          name: "Salmon with Roasted Vegetables",
          type: "dinner",
          meal_type: "dinner",
          serving_size: 1,
          calories: 500,
          protein: 35,
          carbs: 30,
          fats: 25,
          recipe_id: "recipe-3",
          recipe: {
            author: "System",
            ingredients: ["Salmon fillet", "Broccoli", "Carrots", "Olive oil", "Lemon"],
            instructions: ["Roast vegetables", "Bake salmon", "Serve with lemon"],
          },
          nutrition: { calories: 500, protein: 35, carbs: 30, fats: 25 },
          image: "/salmon-with-roasted-vegetables.webp",
        },
      ],
    },
  ],
};

export const mockMeals: Meal[] = [
  {
    id: "1",
    name: "Oatmeal with Berries",
    type: "breakfast",
    meal_type: "breakfast",
    serving_size: 1,
    calories: 300,
    protein: 10,
    carbs: 50,
    fats: 5,
    recipe_id: "recipe-1",
    recipe: {
      author: "System",
      ingredients: ["Oats", "Milk", "Mixed berries", "Honey"],
      instructions: ["Cook oats with milk", "Top with berries and honey"],
    },
    nutrition: { calories: 300, protein: 10, carbs: 50, fats: 5 },
    image: "/oatmeal-with-berries.webp",
  },
  {
    id: "2",
    name: "Grilled Chicken Salad",
    type: "lunch",
    meal_type: "lunch",
    serving_size: 1,
    calories: 400,
    protein: 30,
    carbs: 20,
    fats: 15,
    recipe_id: "recipe-2",
    recipe: {
      author: "System",
      ingredients: ["Chicken breast", "Mixed greens", "Tomatoes", "Cucumber", "Olive oil"],
      instructions: ["Grill chicken", "Mix vegetables", "Dress with olive oil"],
    },
    nutrition: { calories: 400, protein: 30, carbs: 20, fats: 15 },
    image: "/grilled-chicken-salad.webp",
  },
  {
    id: "3",
    name: "Salmon with Roasted Vegetables",
    type: "dinner",
    meal_type: "dinner",
    serving_size: 1,
    calories: 500,
    protein: 35,
    carbs: 30,
    fats: 25,
    recipe_id: "recipe-3",
    recipe: {
      author: "System",
      ingredients: ["Salmon fillet", "Broccoli", "Carrots", "Olive oil", "Lemon"],
      instructions: ["Roast vegetables", "Bake salmon", "Serve with lemon"],
    },
    nutrition: { calories: 500, protein: 35, carbs: 30, fats: 25 },
    image: "/salmon-with-roasted-vegetables.webp",
  },
];

export function generateMockMeals(count: number): Meal[] {
  const output: Meal[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * mockMeals.length);
    const randomMeal = mockMeals[randomIndex];
    output.push({
      ...randomMeal,
      id: `meal-${i + 1}`,
    });
  }

  return output;
}

export const mockUserPrompt = {
  cuisine: "Thai",
  foodPreferences: "unknown",
  nutritionalGoals: "unknown",
  dietaryRestrictions: "unknown",
  userPrompt:
    "What are your nutritional goals (e.g., weight loss, muscle gain, etc.)? Do you have any dietary restrictions (e.g., vegan, gluten-free)? What specific food preferences do you have (e.g., spicy food, favorite ingredients)?",
};

export const mockGenerateMealPlanResponse = {
  meals: [
    {
      id: "meal_001",
      name: "Pad Thai",
      recipe: {
        author: "AI Chef",
        ingredients: [
          "200g rice noodles",
          "150g shrimp",
          "2 eggs",
          "100g bean sprouts",
          "3 tablespoons fish sauce",
          "2 tablespoons sugar",
          "2 tablespoons lime juice",
          "1 tablespoon tamarind paste",
          "1 clove garlic, minced",
          "1 tablespoon peanut oil",
          "Chopped peanuts for garnish",
          "Fresh cilantro for garnish",
        ],
        instructions: [
          "Soak rice noodles in hot water for 30 minutes or until soft.",
          "In a pan, heat peanut oil over medium heat and sauté garlic until fragrant.",
          "Add shrimp and cook until pink, then push to the side.",
          "Crack eggs into the pan, scramble, and mix with shrimp.",
          "Add drained noodles, fish sauce, sugar, lime juice, and tamarind paste. Toss everything together.",
          "Add bean sprouts and mix well for another 2 minutes.",
          "Serve hot, garnished with chopped peanuts and cilantro.",
        ],
      },
      nutrition: {
        calories: 600,
        protein: 35,
        carbs: 80,
        fats: 15,
      },
      meal_type: "Dinner",
      serving_size: 1,
    },
    {
      id: "meal_002",
      name: "Green Curry Chicken",
      recipe: {
        author: "AI Chef",
        ingredients: [
          "500g chicken breast, cut into pieces",
          "2 tablespoons green curry paste",
          "400ml coconut milk",
          "1 bell pepper, sliced",
          "100g zucchini, sliced",
          "100g green beans, trimmed",
          "1 tablespoon fish sauce",
          "1 tablespoon basil leaves",
          "1 tablespoon lime juice",
          "Cooked jasmine rice for serving",
        ],
        instructions: [
          "In a pot, heat a little oil and sauté the green curry paste until fragrant.",
          "Add chicken and cook until browned.",
          "Pour in coconut milk and bring to a simmer.",
          "Add vegetables and cook until tender.",
          "Stir in fish sauce, basil, and lime juice before serving.",
          "Serve hot with jasmine rice.",
        ],
      },
      nutrition: {
        calories: 550,
        protein: 40,
        carbs: 45,
        fats: 30,
      },
      meal_type: "Dinner",
      serving_size: 1,
    },
    {
      id: "meal_003",
      name: "Tom Yum Soup",
      recipe: {
        author: "AI Chef",
        ingredients: [
          "500ml chicken broth",
          "200g shrimp",
          "1 stalk lemongrass, chopped",
          "3 lime leaves",
          "3-4 slices galangal",
          "2-3 Thai bird chilies, smashed",
          "100g mushrooms, sliced",
          "2 tablespoons lime juice",
          "1 tablespoon fish sauce",
          "Cilantro for garnish",
        ],
        instructions: [
          "In a pot, heat chicken broth and add lemongrass, lime leaves, galangal, and chilies.",
          "Simmer for 10 minutes to infuse flavors.",
          "Add shrimp and mushrooms, cooking until shrimp is pink.",
          "Stir in lime juice and fish sauce.",
          "Serve hot, garnished with cilantro.",
        ],
      },
      nutrition: {
        calories: 200,
        protein: 25,
        carbs: 10,
        fats: 8,
      },
      meal_type: "Appetizer",
      serving_size: 1,
    },
  ],
  cuisine: "Thai",
  foodPreferences: "unknown",
  nutritionalGoals: "unknown",
  dietaryRestrictions: "unknown",
};
