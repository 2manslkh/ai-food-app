import { MealPlan, Meal } from "@/types";

export const mockMealPlan: MealPlan = {
  id: "mock-plan-1",
  name: "Mock Meal Plan",
  start_date: new Date(),
  end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
  days: [
    {
      id: "day-1",
      meal_plan_id: "mock-plan-1",
      date: new Date(),
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
