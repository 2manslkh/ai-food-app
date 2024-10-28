import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{meal.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="relative mb-4 h-40 w-full">
          <Image
            src={meal.image}
            alt={meal.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{meal.type}</p>
        <p className="mb-2 text-sm">
          Calories: {meal.nutrition.calories} | Protein: {meal.nutrition.protein}g | Carbs:{" "}
          {meal.nutrition.carbs}g | Fats: {meal.nutrition.fats}g
        </p>
        <h4 className="mt-2 font-semibold">Ingredients:</h4>
        <ul className="list-inside list-disc text-sm">
          {meal.recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
