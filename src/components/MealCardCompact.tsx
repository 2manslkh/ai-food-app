import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Meal } from "@/types/types";

interface MealCardCompactProps {
  meal: Meal;
  isSelected?: boolean;
}

export function MealCardCompact({
  meal,
  isSelected = false,
}: MealCardCompactProps) {
  return (
    <Card
      className={`w-full transition-all overflow-hidden ${
        isSelected
          ? "shadow-[0_0_0_2px_rgba(59,130,246,0.5)] filter brightness-105"
          : ""
      }`}
    >
      <div className="flex items-center h-16">
        <div className="relative h-16 w-16 flex-shrink-0">
          <Image
            src={meal.image}
            alt={meal.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <CardContent className="flex-grow p-2 flex justify-between items-center">
          <div className="overflow-hidden">
            <h3
              className="font-semibold text-sm mb-1 max-w-48 truncate"
              title={meal.name}
            >
              {meal.name}
            </h3>
            <div className="text-xs text-muted-foreground">
              <span>P: {meal.nutrition.protein}g</span>
              <span className="mx-1">C: {meal.nutrition.carbs}g</span>
              <span>F: {meal.nutrition.fats}g</span>
            </div>
          </div>
          <div className="text-sm font-medium ml-2 whitespace-nowrap">
            {meal.nutrition.calories} kcal
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
