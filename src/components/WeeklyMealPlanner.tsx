"use client";

import React, { useState, useCallback, use, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PieChartComponent as PieChart } from "@/components/ui/pie-chart";
import { Meal } from "@/types";
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

  // const favoriteMeals: Meal[] = mockMeals;
  const { data: favoriteMeals } = useFetchUserFavoriteMeals();

  const userId = useUserId();
  const createMealPlanMutation = useCreateMealPlan();
  const { isLoading, error } = useFetchMealPlans();
  const saveMealPlanDaysMutation = useSaveMealPlanDays();
  const [currentMealPlanId, setCurrentMealPlanId] = useState<string | null>(null);

  // Add state for tracking the current meal day ID
  const [currentMealDayId, setCurrentMealDayId] = useState<string | null>(null);

  const { data: mealPlanDays, isLoading: isLoadingMealPlanDays } =
    useFetchMealPlanDays(currentMealPlanId);

  console.log("🚀 | WeeklyMealPlanner | mealPlanDays:", mealPlanDays);
  useEffect(() => {
    if (mealPlanDays) {
      setWeeklyPlan(mealPlanDays);
    }
  }, [mealPlanDays]);

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
        console.log("🚀 | result:", result);
        console.log("🚀 | result:", result);
        setCurrentMealPlanId(result);
        toast({
          title: "Success",
          description: "Meal plan created successfully",
        });
        setShowPlanner(true);
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
    const dayMeals = weeklyPlan[day];
    const mealDayId = dayMeals.length > 0 ? dayMeals[0].mealDayId : null;

    if (!mealDayId) {
      toast({
        title: "Error",
        description: "Could not find meal day ID",
        variant: "destructive",
      });
      return;
    }

    setSelectedDay(day);
    setCurrentMealDayId(mealDayId);
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

  const handleSaveMealPlan = async () => {
    console.log("🚀 | handleSaveMealPlan | currentMealPlanId:", currentMealPlanId);
    console.log("🚀 | handleSaveMealPlan | currentMealPlanId:", weeklyPlan);
    if (!currentMealPlanId) {
      toast({
        title: "Error",
        description: "No active meal plan to save",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🚀 | handleSaveMealPlan | currentMealPlanId:", currentMealPlanId);
      await saveMealPlanDaysMutation.mutateAsync({
        mealPlanId: currentMealPlanId,
        weeklyPlan,
      });
      toast({
        title: "Success",
        description: "Meal plan saved successfully",
      });
    } catch (error) {
      console.error("Failed to save meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to save meal plan",
        variant: "destructive",
      });
    }
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
              <Button
                className="mt-4"
                onClick={() => handleAddMealClick(day)}
                disabled={!weeklyPlan[day]?.[0]?.mealDayId}
              >
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
        favoriteMeals={favoriteMeals || []}
        mealDayId={currentMealDayId} // You'll need to track this when a day is selected
      />

      <Button
        className="w-full"
        onClick={handleSaveMealPlan}
        disabled={false}
        // disabled={saveMealPlanDaysMutation.isPending}
      >
        {saveMealPlanDaysMutation.isPending ? "Saving..." : "Save Meal Plan"}
      </Button>
    </div>
  );
}
