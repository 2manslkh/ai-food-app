import React from "react";
import MealPlanDisplay from "../../components/MealPlanDisplay";
import { MealPlan } from "../../types";

// This is a mock meal plan. In a real application, you would fetch this data from your API.
const mockMealPlan: MealPlan = {
  id: "1",
  userId: "1",
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  days: [
    {
      date: new Date(),
      meals: [
        {
          id: "1",
          name: "Oatmeal with Berries",
          type: "breakfast",
          recipe: {
            id: "1",
            name: "Oatmeal with Berries",
            ingredients: [],
            instructions: [],
          },
          servingSize: 1,
          nutrition: {
            calories: 300,
            protein: 10,
            carbs: 50,
            fats: 5,
            fiber: 5,
            sugar: 10,
          },
        },
        {
          id: "2",
          name: "Grilled Chicken Salad",
          type: "lunch",
          recipe: {
            id: "2",
            name: "Grilled Chicken Salad",
            ingredients: [],
            instructions: [],
          },
          servingSize: 1,
          nutrition: {
            calories: 400,
            protein: 30,
            carbs: 20,
            fats: 15,
            fiber: 5,
            sugar: 5,
          },
        },
        {
          id: "3",
          name: "Salmon with Roasted Vegetables",
          type: "dinner",
          recipe: {
            id: "3",
            name: "Salmon with Roasted Vegetables",
            ingredients: [],
            instructions: [],
          },
          servingSize: 1,
          nutrition: {
            calories: 500,
            protein: 35,
            carbs: 30,
            fats: 25,
            fiber: 8,
            sugar: 5,
          },
        },
      ],
      nutritionSummary: {
        calories: 1200,
        protein: 75,
        carbs: 100,
        fats: 45,
        fiber: 18,
        sugar: 20,
      },
    },
  ],
  nutritionSummary: {
    calories: 8400,
    protein: 525,
    carbs: 700,
    fats: 315,
    fiber: 126,
    sugar: 140,
  },
  shoppingList: { items: [], categories: {} },
};

export default function MealPlanPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Your Meal Plan</h1>
      <MealPlanDisplay mealPlan={mockMealPlan} />
    </>
  );
}
