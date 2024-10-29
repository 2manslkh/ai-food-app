"use client";

import React, { useState, useCallback, use, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WeeklyPlan } from "@/types";

import { useCreateMealPlan, useFetchMealPlans } from "@/hooks/useApi";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/dist/client/components/navigation";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

const NUTRITION_PRESETS = {
  balanced: {
    name: "Balanced",
    calories: 2000,
    protein: 150,
    carbs: 225,
    fats: 65,
  },
  lowCarb: {
    name: "Low Carb",
    calories: 2000,
    protein: 175,
    carbs: 100,
    fats: 120,
  },
  highProtein: {
    name: "High Protein",
    calories: 2000,
    protein: 200,
    carbs: 175,
    fats: 55,
  },
  keto: {
    name: "Keto",
    calories: 2000,
    protein: 150,
    carbs: 50,
    fats: 155,
  },
};

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

  const [selectedPreset, setSelectedPreset] = useState<string>("balanced");

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    setNutritionTarget(NUTRITION_PRESETS[preset as keyof typeof NUTRITION_PRESETS]);
  };

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
          nutritionTarget: {
            calories: nutritionTarget.calories,
            protein: nutritionTarget.protein,
            carbs: nutritionTarget.carbs,
            fats: nutritionTarget.fats,
          },
        });

        router.push(`/meal-plan/${result}`);
      } catch (error) {
        console.error("Failed to create meal plan:", error);
        toast({
          title: "Error",
          description: "Failed to create meal plan",
          variant: "destructive",
        });
      }
    },
    [router, mealPlanName, startDate, endDate, userId, createMealPlanMutation, nutritionTarget]
  );

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Meal Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateMealPlan} className="space-y-6">
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

          <div className="space-y-4">
            <Label>Nutrition Presets</Label>
            <RadioGroup
              value={selectedPreset}
              onValueChange={handlePresetChange}
              className="flex flex-wrap gap-4"
            >
              {Object.entries(NUTRITION_PRESETS).map(([key, preset]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key}>{preset.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-6">
            <Label>Custom Nutrition Targets</Label>

            <div className="space-y-4">
              <div className="">
                <div className="flex items-center justify-between">
                  <Label>Calories</Label>
                  <span>{nutritionTarget.calories} kcal</span>
                </div>
                <Slider
                  value={[nutritionTarget.calories]}
                  onValueChange={(value) =>
                    setNutritionTarget((prev) => ({ ...prev, calories: value[0] }))
                  }
                  min={1000}
                  max={4000}
                  step={50}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Protein</Label>
                  <span>{nutritionTarget.protein}g</span>
                </div>
                <Slider
                  value={[nutritionTarget.protein]}
                  onValueChange={(value) =>
                    setNutritionTarget((prev) => ({ ...prev, protein: value[0] }))
                  }
                  rangeColor="--chart-1"
                  min={50}
                  max={300}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Carbs</Label>
                  <span>{nutritionTarget.carbs}g</span>
                </div>
                <Slider
                  value={[nutritionTarget.carbs]}
                  onValueChange={(value) =>
                    setNutritionTarget((prev) => ({ ...prev, carbs: value[0] }))
                  }
                  rangeColor="--chart-2"
                  min={20}
                  max={400}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Fats</Label>
                  <span>{nutritionTarget.fats}g</span>
                </div>
                <Slider
                  value={[nutritionTarget.fats]}
                  onValueChange={(value) =>
                    setNutritionTarget((prev) => ({ ...prev, fats: value[0] }))
                  }
                  rangeColor="--chart-3"
                  min={20}
                  max={200}
                  step={5}
                />
              </div>
            </div>
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
