import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Meal } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface MealCardCompactProps {
  meal: Meal;
  isSelected?: boolean;
}

export function MealCardCompact({ meal, isSelected = false }: MealCardCompactProps) {
  return (
    <Card
      className={`w-full overflow-hidden transition-all ${
        isSelected ? "shadow-[0_0_0_2px_rgba(59,130,246,0.5)] brightness-105 filter" : ""
      }`}
    >
      <div className="flex h-16 items-center">
        <div className="relative h-16 w-16 flex-shrink-0">
          {meal.image ? (
            <Image src={meal.image} alt={meal.name} layout="fill" objectFit="cover" />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
        <CardContent className="flex flex-grow items-center justify-between p-2">
          <div className="overflow-hidden">
            <h3 className="mb-1 max-w-48 truncate text-sm font-semibold" title={meal.name}>
              {meal.name}
            </h3>
            <div className="text-xs text-muted-foreground">
              <span>P: {meal.nutrition.protein}g</span>
              <span className="mx-1">C: {meal.nutrition.carbs}g</span>
              <span>F: {meal.nutrition.fats}g</span>
            </div>
          </div>
          <div className="ml-2 whitespace-nowrap text-sm font-medium">
            {meal.nutrition.calories} kcal
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
