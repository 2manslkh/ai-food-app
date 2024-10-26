import React from "react";
import { MealPlan, MealDay } from "../types"; // You'll need to create this types file

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Meal Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mealPlan.days.map((day: MealDay, index: number) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">
              {new Date(day.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h3>
            {day.meals.map((meal, mealIndex) => (
              <div key={mealIndex} className="mb-2">
                <h4 className="font-medium">
                  {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                </h4>
                <p>{meal.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanDisplay;
