"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChartComponent as PieChart } from "@/components/ui/pie-chart";
import { Meal, WeeklyPlan } from "@/types";
import { Progress } from "@/components/ui/progress";
import { AddMealDialog } from "./AddMealDialog";
import { MealCardCompact } from "./MealCardCompact";
import {
  useFetchUserFavoriteMeals,
  useSaveMealPlanDays,
  useFetchMealPlanDays,
  useFetchMealPlanDetails,
} from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

interface WeeklyMealPlannerProps {
  existingPlanId?: string;
}

export function WeeklyMealPlanner({ existingPlanId }: WeeklyMealPlannerProps) {
  const today = new Date();
  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 6);

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
  const [isAddMealDialogOpen, setIsAddMealDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // const favoriteMeals: Meal[] = mockMeals;
  const { data: favoriteMeals } = useFetchUserFavoriteMeals();

  const saveMealPlanDaysMutation = useSaveMealPlanDays();
  const [currentMealPlanId, setCurrentMealPlanId] = useState<string | null>(existingPlanId || null);

  // Add state for tracking the current meal day ID
  const [currentMealDayId, setCurrentMealDayId] = useState<string | null>(null);
  const router = useRouter();

  const { data: mealPlanDays, isLoading: isLoadingMealPlanDays } =
    useFetchMealPlanDays(currentMealPlanId);

  // Add the new query
  const { data: mealPlanDetails, isLoading: isLoadingMealPlan } =
    useFetchMealPlanDetails(existingPlanId);

  // Update nutritionTarget when meal plan details are loaded
  useEffect(() => {
    if (mealPlanDetails?.nutritionTarget) {
      setNutritionTarget(mealPlanDetails.nutritionTarget);
    }
  }, [mealPlanDetails]);

  useEffect(() => {
    if (mealPlanDays) {
      setWeeklyPlan(mealPlanDays);
    }
  }, [mealPlanDays]);

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

  const handleAddMealClick = (mealDayId: string, day: string) => {
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
      setWeeklyPlan((prev) =>
        prev.map((day) =>
          day.day_of_week === selectedDay ? { ...day, meals: [...day.meals, ...meals] } : day
        )
      );
      setIsAddMealDialogOpen(false);
    }
  };

  const handleSaveMealPlan = async () => {
    if (!currentMealPlanId) {
      toast({
        title: "Error",
        description: "No active meal plan to save",
        variant: "destructive",
      });
      return;
    }

    try {
      router.push(`/meal-plan`);
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

  return (
    <div className="space-y-4">
      {isLoadingMealPlan ? (
        <div>Loading meal plan details...</div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{mealPlanDetails?.name || "Untitled Meal Plan"}</h1>
            <div className="text-sm text-muted-foreground">
              {mealPlanDetails?.start_date && mealPlanDetails?.end_date && (
                <span>
                  {new Date(mealPlanDetails.start_date).toLocaleDateString()} -{" "}
                  {new Date(mealPlanDetails.end_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <PieChart data={createChartData(nutritionTarget)} />
          {daysOfWeek.map((dayName) => {
            const day = weeklyPlan.find((d) => d.day_of_week === dayName);
            if (!day) return null;

            const dailyNutrition = calculateDailyNutrition(day.meals);
            return (
              <Card key={dayName}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 pr-2">
                  <CardTitle className="text-lg">{dayName}</CardTitle>
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
                    {day.meals.map((meal, index) => (
                      <MealCardCompact key={`${meal.id}-${index}`} meal={meal} />
                    ))}
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() => handleAddMealClick(day.meal_day_id, day.day_of_week)}
                    disabled={!day.meal_day_id}
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
            mealDayId={currentMealDayId || ""}
            currentMeals={weeklyPlan.find((day) => day.day_of_week === selectedDay)?.meals || []}
          />

          <Button
            className="w-full"
            onClick={handleSaveMealPlan}
            disabled={false}
            // disabled={saveMealPlanDaysMutation.isPending}
          >
            {saveMealPlanDaysMutation.isPending ? "Saving..." : "Save Meal Plan"}
          </Button>
        </>
      )}
    </div>
  );
}
