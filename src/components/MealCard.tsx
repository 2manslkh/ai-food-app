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
        <div className="relative w-full h-40 mb-4">
          <Image
            src={meal.image}
            alt={meal.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
        </p>
        <p className="text-sm mb-2">
          Calories: {meal.nutrition.calories} | Protein:{" "}
          {meal.nutrition.protein}g | Carbs: {meal.nutrition.carbs}g | Fats:{" "}
          {meal.nutrition.fats}g
        </p>
        <h4 className="font-semibold mt-2">Ingredients:</h4>
        <ul className="list-disc list-inside text-sm">
          {meal.recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
