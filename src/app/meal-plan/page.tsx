import React from "react";
import Layout from "@/components/Layout";
import { MealPlanDisplay } from "@/components/MealPlanDisplay";
import { MealPlan } from "@/types";

// This is a mock meal plan. In a real application, you would fetch this data from your API.
const mockMealPlan: MealPlan = {
  days: [
    {
      date: new Date(),
      meals: [
        {
          id: "1",
          name: "Oatmeal with Berries",
          type: "breakfast",
          recipe: {
            ingredients: ["Oats", "Milk", "Mixed berries", "Honey"],
            instructions: ["Cook oats with milk", "Top with berries and honey"],
          },
          nutrition: {
            calories: 300,
            protein: 10,
            carbs: 50,
            fats: 5,
            fiber: 5,
            sugar: 10,
          },
          image: "/oatmeal-with-berries.webp",
        },
        {
          id: "2",
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
          nutrition: {
            calories: 400,
            protein: 30,
            carbs: 20,
            fats: 15,
            fiber: 5,
            sugar: 5,
          },
          image: "/grilled-chicken-salad.webp",
        },
        {
          id: "3",
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
          nutrition: {
            calories: 500,
            protein: 35,
            carbs: 30,
            fats: 25,
            fiber: 8,
            sugar: 5,
          },
          image: "/salmon-with-roasted-vegetables.webp",
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
};

const MealPlanPage: React.FC = () => {
  return (
    <div>
      <MealPlanDisplay mealPlan={mockMealPlan} />
    </div>
  );
};

export default MealPlanPage;
