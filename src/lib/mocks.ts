import { MealPlan, Meal } from '@/types';


export const mockMealPlan: MealPlan = {
  days: [
    {
      date: new Date(),
      meals: [
        {
          id: '1',
          name: "Oatmeal with Berries",
          type: "breakfast",
          recipe: {
            ingredients: ["Oats", "Milk", "Mixed berries", "Honey"],
            instructions: [
              "Cook oats with milk",
              "Top with berries and honey",
            ],
          },
          nutrition: { calories: 300, protein: 10, carbs: 50, fats: 5 },
          image: "/oatmeal-with-berries.webp",
        },
        {
          id: '2',
          name: "Grilled Chicken Salad",
          type: "lunch",
          recipe: {
            ingredients: [
              "Chicken breast",
              "Mixed greens",
              "Tomatoes",
              "Cucumber",
              "Olive oil",
            ],
            instructions: [
              "Grill chicken",
              "Mix vegetables",
              "Dress with olive oil",
            ],
          },
          nutrition: { calories: 400, protein: 30, carbs: 20, fats: 15 },
          image: "/grilled-chicken-salad.webp",
        },
        {
          id: '3',
          name: "Salmon with Roasted Vegetables",
          type: "dinner",
          recipe: {
            ingredients: [
              "Salmon fillet",
              "Broccoli",
              "Carrots",
              "Olive oil",
              "Lemon",
            ],
            instructions: [
              "Roast vegetables",
              "Bake salmon",
              "Serve with lemon",
            ],
          },
          nutrition: { calories: 500, protein: 35, carbs: 30, fats: 25 },
          image: "/salmon-with-roasted-vegetables.webp",
        },
      ],
      nutritionSummary: {
        calories: 1200,
        protein: 75,
        carbs: 100,
        fats: 45,
        fiber: 18,
        sugar: 20
      }
    },
  ],
};

export const mockMeals = [{
    id: '1',
    name: "Oatmeal with Berries",
    type: "breakfast",
    recipe: {
      ingredients: ["Oats", "Milk", "Mixed berries", "Honey"],
      instructions: [
        "Cook oats with milk",
        "Top with berries and honey",
      ],
    },
    nutrition: { calories: 300, protein: 10, carbs: 50, fats: 5 },
    image: "/oatmeal-with-berries.webp",
  },
  {
    id: '2',
    name: "Grilled Chicken Salad",
    type: "lunch",
    recipe: {
      ingredients: [
        "Chicken breast",
        "Mixed greens",
        "Tomatoes",
        "Cucumber",
        "Olive oil",
      ],
      instructions: [
        "Grill chicken",
        "Mix vegetables",
        "Dress with olive oil",
      ],
    },
    nutrition: { calories: 400, protein: 30, carbs: 20, fats: 15 },
    image: "/grilled-chicken-salad.webp",
  },
  {
    id: '3',
    name: "Salmon with Roasted Vegetables",
    type: "dinner",
    recipe: {
      ingredients: [
        "Salmon fillet",
        "Broccoli",
        "Carrots",
        "Olive oil",
        "Lemon",
      ],
      instructions: [
        "Roast vegetables",
        "Bake salmon",
        "Serve with lemon",
      ],
    },
    nutrition: { calories: 500, protein: 35, carbs: 30, fats: 25 },
    image: "/salmon-with-roasted-vegetables.webp",
  },
];

export function generateMockMeals(count: number): Meal[] {
  const mockMeals: Meal[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * mockMeals.length);
    const randomMeal = mockMeals[randomIndex];
    mockMeals.push({
      ...randomMeal,
      id: `meal-${i + 1}`,
    });
  }

  return mockMeals;
}
