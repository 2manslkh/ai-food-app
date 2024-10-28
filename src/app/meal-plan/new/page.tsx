"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFetchMealPlans } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NewMealPlanForm } from "@/components/NewMealPlanForm";

const MealPlanNewPage: React.FC = () => {
  const { data: mealPlans, isLoading, error } = useFetchMealPlans();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading meal plans...</div>;
  }

  if (error) {
    return <div>Error loading meal plans: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <Button variant="ghost" onClick={() => router.push("/meal-plan")} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Meal Plans
      </Button>
      <NewMealPlanForm />
    </div>
  );
};

export default MealPlanNewPage;
