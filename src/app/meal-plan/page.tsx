"use client";

import React from "react";

import { WeeklyMealPlanner } from "@/components/WeeklyMealPlanner";
import { useFetchMealPlans } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This is a mock meal plan. In a real application, you would fetch this data from your API.

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
          <h1 className="text-2xl font-bold mb-4">Your Meal Plans</h1>
          {mealPlans && mealPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Start Date:{" "}
                      {new Date(plan.start_date).toLocaleDateString()}
                    </p>
                    <p>
                      End Date: {new Date(plan.end_date).toLocaleDateString()}
                    </p>
                    <Button
                      className="mt-2"
                      onClick={() => {
                        /* TODO: Implement view/edit functionality */
                      }}
                    >
                      View/Edit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>You haven't created any meal plans yet.</p>
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
