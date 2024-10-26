"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface Message {
  role: string;
  content: string;
}

interface Meal {
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  recipe: {
    ingredients: string[];
    instructions: string[];
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  image: string;
}

interface MealPlan {
  days: {
    date: Date;
    meals: Meal[];
  }[];
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm here to help you create a personalized meal plan. Tell me about your dietary preferences, health goals, and any other relevant information.",
    },
  ]);
  const [input, setInput] = useState("");
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Thank you for sharing that information. I can now generate a meal plan for you.",
          },
        ]);
        setShowGenerateButton(true);
      }, 1000);
      setInput("");
    }
  };

  const handleGenerateMealPlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockMealPlan: MealPlan = {
        days: [
          {
            date: new Date(),
            meals: [
              {
                name: "Oatmeal with Berries",
                type: "breakfast",
                recipe: {
                  ingredients: ["Oats", "Milk", "Mixed berries", "Honey"],
                  instructions: [
                    "Cook oats with milk",
                    "Top with berries and honey",
                  ],
                },
                nutrition: { calories: 300, protein: 10, carbs: 50, fats: 5 },
                image: "/oatmeal-with-berries.webp",
              },
              {
                name: "Grilled Chicken Salad",
                type: "lunch",
                recipe: {
                  ingredients: [
                    "Chicken breast",
                    "Mixed greens",
                    "Tomatoes",
                    "Cucumber",
                    "Olive oil",
                  ],
                  instructions: [
                    "Grill chicken",
                    "Mix vegetables",
                    "Dress with olive oil",
                  ],
                },
                nutrition: { calories: 400, protein: 30, carbs: 20, fats: 15 },
                image: "/grilled-chicken-salad.webp",
              },
              {
                name: "Salmon with Roasted Vegetables",
                type: "dinner",
                recipe: {
                  ingredients: [
                    "Salmon fillet",
                    "Broccoli",
                    "Carrots",
                    "Olive oil",
                    "Lemon",
                  ],
                  instructions: [
                    "Roast vegetables",
                    "Bake salmon",
                    "Serve with lemon",
                  ],
                },
                nutrition: { calories: 500, protein: 35, carbs: 30, fats: 25 },
                image: "/salmon-with-roasted-vegetables.webp",
              },
            ],
          },
        ],
      };
      setMealPlan(mockMealPlan);
      setIsLoading(false);
    }, 5000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="hidden">AI Meal Planner</CardTitle>
      </CardHeader>
      <CardContent>
        {!mealPlan && !isLoading && (
          <ScrollArea className="h-[400px] w-full pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
            {showGenerateButton && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleGenerateMealPlan}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Generate meal plan
                </Button>
              </div>
            )}
          </ScrollArea>
        )}
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-lg font-semibold w-full">
              Generating your meal plan...
            </p>
          </div>
        )}
        {mealPlan && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealPlan.days.flatMap((day, dayIndex) =>
              day.meals.map((meal, mealIndex) => (
                <Card
                  key={`${dayIndex}-${mealIndex}`}
                  className="flex flex-col"
                >
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
                      {meal.nutrition.protein}g | Carbs: {meal.nutrition.carbs}g
                      | Fats: {meal.nutrition.fats}g
                    </p>
                    <h4 className="font-semibold mt-2">Ingredients:</h4>
                    <ul className="list-disc list-inside text-sm">
                      {meal.recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </CardContent>
      {!mealPlan && !isLoading && (
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
};
