"use client";

import React from "react";

import { WeeklyMealPlanner } from "@/components/WeeklyMealPlanner";
import { useFetchMealPlans } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealPlanSummary } from "@/types";

const MealPlanPage: React.FC = () => {
  const { data: mealPlans, isLoading, error } = useFetchMealPlans();
  const [showPlanner, setShowPlanner] = React.useState(false);

  if (isLoading) {
    return <div>Loading meal plans...</div>;
  }

  if (error) {
    return <div>Error loading meal plans: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!showPlanner && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Your Meal Plans</h1>
          {mealPlans && mealPlans.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mealPlans.map((plan: MealPlanSummary) => (
                <Card key={plan.id}>
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
                        <div>
                          <p className="text-muted-foreground">Total Calories</p>
                          <p className="font-medium">{plan.total_calories}</p>
                        </div>
                      </div>
                      <Button
                        className="mt-4 w-full"
                        onClick={() => {
                          /* TODO: Implement view/edit functionality */
                        }}
                      >
                        View/Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>You haven&apos;t created any meal plans yet.</p>
          )}
          <Button className="mt-4" onClick={() => setShowPlanner(true)}>
            Create New Meal Plan
          </Button>
        </>
      )}
      {showPlanner && <WeeklyMealPlanner />}
    </div>
  );
};

export default MealPlanPage;
