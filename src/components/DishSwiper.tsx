"use client";

import React, { useState } from "react";
import { Meal } from "@/types";
import { MealCard } from "./MealCard";
import { X, Heart } from "lucide-react";
import { InteractiveButton } from "@/components/ui/InteractiveButton";
import { useHandleMealInteraction } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

interface DishSwiperProps {
  dishes: Meal[];
  onComplete: () => void;
}

export function DishSwiper({ dishes, onComplete }: DishSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleMealInteraction = useHandleMealInteraction();

  const handleLike = async () => {
    try {
      await handleMealInteraction.mutateAsync({
        meal: dishes[currentIndex],
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
        meal: dishes[currentIndex],
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
    if (currentIndex < dishes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  if (currentIndex >= dishes.length) {
    return null;
  }

  const currentDish = dishes[currentIndex];

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4">
        Swipe or click to like/dislike ({currentIndex + 1}/{dishes.length})
      </p>
      <div className="relative mb-4 w-full">
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
