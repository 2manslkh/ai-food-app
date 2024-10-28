"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PieChartComponent as PieChart } from "@/components/ui/pie-chart";
import { Meal } from "@/types";
import { Progress } from "@/components/ui/progress";
import { AddMealDialog } from "./AddMealDialog";
import { mockMeals } from "@/lib/mocks";
import { MealCardCompact } from "./MealCardCompact";
import { useCreateMealPlan, useFetchMealPlans } from "@/hooks/useApi";
import { useUserId } from "@/hooks/useUserId";

interface NutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WeeklyMealPlanner() {
  const today = new Date();
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [nutritionTarget] = useState<NutritionTarget>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  });
  const [showPlanner, setShowPlanner] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<{ [key: string]: Meal[] }>(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );
  const [isAddMealDialogOpen, setIsAddMealDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // New state for meal plan details
  const [mealPlanName, setMealPlanName] = useState("");
  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(oneWeekFromNow));

  const favoriteMeals: Meal[] = mockMeals;

  const userId = useUserId();
  const createMealPlanMutation = useCreateMealPlan();
  const { isLoading, error } = useFetchMealPlans();

  const handleCreateMealPlan = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!mealPlanName || !startDate || !endDate || !userId) {
        alert("Please fill in all fields and ensure you're logged in");
        return;
      }

      try {
        await createMealPlanMutation.mutateAsync({
          name: mealPlanName,
          startDate,
          endDate,
        });
        console.log("Meal plan created successfully");
        setShowPlanner(true);
      } catch (error) {
        console.error("Failed to create meal plan:", error);
        alert("Failed to create meal plan");
      }
    },
    [mealPlanName, startDate, endDate, userId, createMealPlanMutation]
  );

  const calculateDailyNutrition = (meals: Meal[]): DailyNutrition => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.nutrition.calories,
        protein: acc.protein + meal.nutrition.protein,
        carbs: acc.carbs + meal.nutrition.carbs,
        fats: acc.fats + meal.nutrition.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const renderNutrientBar = (current: number, target: number, color: string, fillColor: string) => {
    const percentage = Math.min((current / target) * 100, 100);
    return <Progress value={percentage} className={`h-2 w-8 ${color}`} fillColor={fillColor} />;
  };

  const createChartData = (nutrition: DailyNutrition) => [
    { name: "Protein", value: nutrition.protein, fill: "hsl(var(--chart-1))" },
    { name: "Carbs", value: nutrition.carbs, fill: "hsl(var(--chart-2))" },
    { name: "Fats", value: nutrition.fats, fill: "hsl(var(--chart-3))" },
  ];

  const handleAddMealClick = (day: string) => {
    setSelectedDay(day);
    setIsAddMealDialogOpen(true);
  };

  const handleAddMeals = (meals: Meal[]) => {
    if (selectedDay) {
      setWeeklyPlan((prev) => ({
        ...prev,
        [selectedDay]: [...prev[selectedDay], ...meals],
      }));
      setIsAddMealDialogOpen(false);
    }
  };

  const handleSaveMealPlan = () => {
    // TODO: Implement the logic to save the meal plan
    console.log("Saving meal plan:", weeklyPlan);
    // You can add an API call here to save the meal plan to a backend
  };

  if (!showPlanner) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateMealPlan} className="space-y-4">
            <div>
              <Label htmlFor="mealPlanName">Meal Plan Name</Label>
              <Input
                id="mealPlanName"
                value={mealPlanName}
                onChange={(e) => setMealPlanName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create New Meal Plan"}
            </Button>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PieChart data={createChartData(nutritionTarget)} />

      {daysOfWeek.map((day) => {
        const dailyNutrition = calculateDailyNutrition(weeklyPlan[day]);
        return (
          <Card key={day}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 pr-2">
              <CardTitle className="text-lg">{day}</CardTitle>
              <div className="flex items-center space-x-2">
                {renderNutrientBar(
                  dailyNutrition.protein,
                  nutritionTarget.protein,
                  "bg-[hsl(var(--chart-bg-1))]",
                  "hsl(var(--chart-1))"
                )}
                {renderNutrientBar(
                  dailyNutrition.carbs,
                  nutritionTarget.carbs,
                  "bg-[hsl(var(--chart-bg-2))]",
                  "hsl(var(--chart-2))"
                )}
                {renderNutrientBar(
                  dailyNutrition.fats,
                  nutritionTarget.fats,
                  "bg-[hsl(var(--chart-bg-3))]",
                  "hsl(var(--chart-3))"
                )}
                <span className="text-xs font-medium">{dailyNutrition.calories} kcal</span>
              </div>
            </CardHeader>
            <CardContent className="pr-2">
              <div className="space-y-1">
                {weeklyPlan[day].map((meal, index) => (
                  <MealCardCompact key={index} meal={meal} />
                ))}
              </div>
              <Button className="mt-4" onClick={() => handleAddMealClick(day)}>
                Add Meal
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <AddMealDialog
        isOpen={isAddMealDialogOpen}
        onClose={() => setIsAddMealDialogOpen(false)}
        onAddMeals={handleAddMeals}
        favoriteMeals={favoriteMeals}
      />

      <Button className="w-full" onClick={handleSaveMealPlan}>
        Save Meal Plan
      </Button>
    </div>
  );
}
