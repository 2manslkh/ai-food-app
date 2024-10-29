"use client";

import React, { useState } from "react";
import { Meal } from "@/types";
import { MealCard } from "./MealCard";
import { X, Heart, Check } from "lucide-react";
import { InteractiveButton } from "@/components/ui/InteractiveButton";
import { useHandleMealInteraction } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DishSwiperProps {
  dishes: Meal[];
  onComplete: () => void;
}

export function DishSwiper({ dishes, onComplete }: DishSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingDishes, setRemainingDishes] = useState([...dishes]);
  const [isComplete, setIsComplete] = useState(false);
  const handleMealInteraction = useHandleMealInteraction();

  const handleLike = async () => {
    try {
      await handleMealInteraction.mutateAsync({
        meal: remainingDishes[currentIndex],
        isFavorite: true,
      });
      nextDish();
    } catch (error) {
      console.error("Failed to save favorite:", error);
      toast({
        title: "Error",
        description: "Failed to save your favorite. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDislike = async () => {
    try {
      await handleMealInteraction.mutateAsync({
        meal: remainingDishes[currentIndex],
        isFavorite: false,
      });
      nextDish();
    } catch (error) {
      console.error("Failed to record dislike:", error);
      toast({
        title: "Error",
        description: "Failed to record your choice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextDish = () => {
    if (currentIndex < remainingDishes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
      setRemainingDishes([]);
      setTimeout(() => {
        onComplete();
      }, 1000); // Wait for animation to complete
    }
  };

  if (isComplete) {
    return (
      <div className="animate-pop-in-ai flex items-center justify-center space-x-2 rounded-lg bg-muted px-4 py-2">
        <span>Done</span>
        <Check className="h-4 w-4 text-green-500" />
      </div>
    );
  }

  if (remainingDishes.length === 0) {
    return null;
  }

  const currentDish = remainingDishes[currentIndex];

  return (
    <div className={cn("flex flex-col items-center", "animate-pop-in-ai")}>
      <div className="relative mb-4 w-full max-w-96">
        <MealCard meal={currentDish} />
        <div className="absolute bottom-4 right-4 flex space-x-4">
          <InteractiveButton onClick={handleDislike} icon={X} variant="outline" />
          <InteractiveButton
            onClick={handleLike}
            icon={Heart}
            showFloatingIcon
            floatingIconClassName="h-4 w-4 text-red-500 fill-red-500"
          />
        </div>
      </div>
    </div>
  );
}
