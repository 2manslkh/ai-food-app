import React from "react";
import { MealPlan, MealDay, Meal } from "@/types";
import { MealCard } from "./MealCard";

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
}

export const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({
  mealPlan,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Meal Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mealPlan.days.flatMap((day: MealDay, dayIndex: number) =>
          day.meals.map((meal: Meal, mealIndex: number) => (
            <MealCard key={`${dayIndex}-${mealIndex}`} meal={meal} />
          ))
        )}
      </div>
    </div>
  );
};
