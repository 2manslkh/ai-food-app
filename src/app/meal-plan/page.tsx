"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WeeklyMealPlanner } from "@/components/WeeklyMealPlanner";
import { useFetchMealPlans } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlanSummary } from "@/types";
import { toast } from "@/hooks/use-toast";

const MealPlanPage: React.FC = () => {
  const { data: mealPlans, isLoading, error } = useFetchMealPlans();
  const router = useRouter();

  const handleViewEdit = (planId: string) => {
    router.push(`/meal-plan/${planId}`);
  };

  const handleCreateNew = () => {
    router.push(`/meal-plan/new`);
  };

  if (error) {
    return <div>Error loading meal plans: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Meal Plans</h1>
          <Button onClick={handleCreateNew}>Create New Plan</Button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center pt-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : mealPlans && mealPlans.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mealPlans.map((plan: MealPlanSummary) => (
              <Card key={plan.id} className="transition-shadow duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Start Date: {new Date(plan.start_date).toLocaleDateString()}</p>
                    <p>End Date: {new Date(plan.end_date).toLocaleDateString()}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Days</p>
                        <p className="font-medium">{plan.total_days}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Meals</p>
                        <p className="font-medium">{plan.total_meals}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Total Calories</p>
                        <p className="font-medium">{plan.total_calories.toLocaleString()} kcal</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => handleViewEdit(plan.id)}
                      >
                        View/Edit
                      </Button>
                      {/* <Button
                          className="flex-1"
                          variant="destructive"
                          onClick={() => {
                            toast({
                              title: "Coming Soon",
                              description: "Delete functionality will be available soon",
                            });
                          }}
                        >
                          Delete
                        </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">
              You haven&apos;t created any meal plans yet.
            </p>
            <Button onClick={handleCreateNew}>Create Your First Meal Plan</Button>
          </div>
        )}
      </>
    </div>
  );
};

export default MealPlanPage;
