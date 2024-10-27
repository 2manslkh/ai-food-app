import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Meal } from "@/types";

interface MealCardCompactProps {
  meal: Meal;
}

export function MealCardCompact({ meal }: MealCardCompactProps) {
  return (
    <Card className="w-full overflow-hidden">
      <div className="flex items-center">
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={meal.image}
            alt={meal.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <CardContent className="flex-grow p-4 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm mb-1">{meal.name}</h3>
            <div className="text-xs text-muted-foreground">
              <span>P: {meal.nutrition.protein}g</span>
              <span className="mx-1">C: {meal.nutrition.carbs}g</span>
              <span>F: {meal.nutrition.fats}g</span>
            </div>
          </div>
          <div className="text-sm font-medium">
            {meal.nutrition.calories} kcal
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
