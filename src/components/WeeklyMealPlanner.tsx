"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Meal } from "@/types";
import { MealCard } from "./MealCard";

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

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function WeeklyMealPlanner() {
  const [nutritionTarget, setNutritionTarget] = useState<NutritionTarget>({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fats: 65,
  });
  const [showPlanner, setShowPlanner] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<{ [key: string]: Meal[] }>(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );

  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNutritionTarget((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmitNutrition = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPlanner(true);
  };

  const addMealToDay = (day: string, meal: Meal) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: [...prev[day], meal],
    }));
  };

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

  const renderCompactProgressBar = (
    current: number,
    target: number,
    label: string
  ) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium w-8">{label[0]}</span>
        <Progress value={percentage} className="w-8 h-2" />
        <span className="text-xs font-medium w-8">
          {current}/{target}
        </span>
      </div>
    );
  };

  const renderNutrientIndicator = (
    current: number,
    target: number,
    label: string,
    color: string
  ) => {
    const percentage = (current / target) * 100;
    return (
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium">{label[0]}</span>
        <div
          className={`w-2 h-2 rounded-full ${color}`}
          style={{ opacity: Math.min(percentage / 100, 1) }}
        />
      </div>
    );
  };

  const renderNutrientBar = (
    current: number,
    target: number,
    color: string
  ) => {
    const percentage = Math.min((current / target) * 100, 100);
    return <Progress value={percentage} className={`w-8 h-2 ${color}`} />;
  };

  if (!showPlanner) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Set Your Daily Nutrition Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitNutrition} className="space-y-4">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                value={nutritionTarget.calories}
                onChange={handleNutritionChange}
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                name="protein"
                type="number"
                value={nutritionTarget.protein}
                onChange={handleNutritionChange}
              />
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                name="carbs"
                type="number"
                value={nutritionTarget.carbs}
                onChange={handleNutritionChange}
              />
            </div>
            <div>
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                name="fats"
                type="number"
                value={nutritionTarget.fats}
                onChange={handleNutritionChange}
              />
            </div>
            <Button type="submit">Set Targets</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Daily Nutrition Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Calories: {nutritionTarget.calories} kcal</p>
          <p>Protein: {nutritionTarget.protein}g</p>
          <p>Carbs: {nutritionTarget.carbs}g</p>
          <p>Fats: {nutritionTarget.fats}g</p>
        </CardContent>
      </Card>

      {daysOfWeek.map((day) => {
        const dailyNutrition = calculateDailyNutrition(weeklyPlan[day]);
        return (
          <Card key={day}>
            <CardHeader className="flex flex-row items-center justify-between py-2 pr-2">
              <CardTitle className="text-lg">{day}</CardTitle>
              <div className="flex items-center space-x-2">
                {renderNutrientBar(
                  dailyNutrition.protein,
                  nutritionTarget.protein,
                  "bg-blue-500"
                )}
                {renderNutrientBar(
                  dailyNutrition.carbs,
                  nutritionTarget.carbs,
                  "bg-yellow-500"
                )}
                {renderNutrientBar(
                  dailyNutrition.fats,
                  nutritionTarget.fats,
                  "bg-red-500"
                )}
                <span className="text-xs font-medium">
                  {dailyNutrition.calories} kcal
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {weeklyPlan[day].map((meal, index) => (
                <MealCard key={index} meal={meal} />
              ))}
              <Button
                onClick={() => {
                  /* TODO: Implement add meal functionality */
                }}
              >
                Add Meal
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
