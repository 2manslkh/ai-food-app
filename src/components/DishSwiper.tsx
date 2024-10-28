"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Meal } from "@/types";
import { MealCard } from "./MealCard";
import { X, Heart } from "lucide-react";

interface DishSwiperProps {
  dishes: Meal[];
  onComplete: (favorites: Meal[]) => void;
}

export function DishSwiper({ dishes, onComplete }: DishSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Meal[]>([]);

  const handleLike = () => {
    setFavorites([...favorites, dishes[currentIndex]]);
    nextDish();
  };

  const handleDislike = () => {
    nextDish();
  };

  const nextDish = () => {
    if (currentIndex < dishes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(favorites);
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
          <Button onClick={handleDislike} variant="outline" size="icon">
            <X className="h-4 w-4" />
          </Button>
          <Button onClick={handleLike} size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
