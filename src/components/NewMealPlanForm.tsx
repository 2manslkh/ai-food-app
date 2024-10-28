"use client";

import React, { useState, useCallback, use, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PieChartComponent as PieChart } from "@/components/ui/pie-chart";
import { Meal, WeeklyPlan } from "@/types";
import { Progress } from "@/components/ui/progress";
import { AddMealDialog } from "./AddMealDialog";
import { MealCardCompact } from "./MealCardCompact";
import {
  useCreateMealPlan,
  useFetchMealPlans,
  useFetchUserFavoriteMeals,
  useSaveMealPlanDays,
  useFetchMealPlanDays,
} from "@/hooks/useApi";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/dist/client/components/navigation";

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

export function NewMealPlanForm() {
  const today = new Date();
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 6);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [nutritionTarget, setNutritionTarget] = useState<NutritionTarget>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  });

  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(
    daysOfWeek.map((day) => ({
      id: "",
      meal_plan_id: "",
      date: new Date(),
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fats: 0,
      meals: [],
      day_of_week: day,
      meal_day_id: "",
    }))
  );

  // New state for meal plan details
  const [mealPlanName, setMealPlanName] = useState("");
  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(oneWeekFromNow));

  const userId = useUserId();
  const createMealPlanMutation = useCreateMealPlan();
  const { isLoading, error } = useFetchMealPlans();
  const router = useRouter();

  const handleCreateMealPlan = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!mealPlanName || !startDate || !endDate || !userId) {
        toast({
          title: "Error",
          description: "Please fill in all fields and ensure you're logged in",
          variant: "destructive",
        });
        return;
      }

      try {
        const result = await createMealPlanMutation.mutateAsync({
          name: mealPlanName,
          startDate,
          endDate,
        });

        router.push(`/meal-plan/${result}`);
        // setCurrentMealPlanId(result);
        // toast({
        //   title: "Success",
        //   description: "Meal plan created successfully",
        // });
        // setShowPlanner(true);
      } catch (error) {
        console.error("Failed to create meal plan:", error);
        toast({
          title: "Error",
          description: "Failed to create meal plan",
          variant: "destructive",
        });
      }
    },
    [mealPlanName, startDate, endDate, userId, createMealPlanMutation]
  );

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
