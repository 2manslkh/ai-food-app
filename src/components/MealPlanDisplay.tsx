import React from "react";
import { MealPlan, MealDay, Meal } from "@/types";
import { MealCard } from "./MealCard";

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
}

export const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Your Meal Plan</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mealPlan.days.flatMap((day: MealDay, dayIndex: number) =>
          day.meals.map((meal: Meal, mealIndex: number) => (
            <MealCard key={`${dayIndex}-${mealIndex}`} meal={meal} />
          ))
        )}
      </div>
    </div>
  );
};
