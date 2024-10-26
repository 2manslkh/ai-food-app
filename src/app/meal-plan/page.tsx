import React from "react";
import { MealPlanDisplay } from "@/components/MealPlanDisplay";
import { mockMealPlan } from "@/lib/mocks";
import { WeeklyMealPlanner } from "@/components/WeeklyMealPlanner";

// This is a mock meal plan. In a real application, you would fetch this data from your API.

const MealPlanPage: React.FC = () => {
  return (
    <div>
      <WeeklyMealPlanner />
      <MealPlanDisplay mealPlan={mockMealPlan} />
    </div>
  );
};

export default MealPlanPage;
