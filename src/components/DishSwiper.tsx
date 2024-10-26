"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Meal } from "@/types";

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
      <h2 className="text-2xl font-bold mb-4">Choose Your Favorite Dishes</h2>
      <p className="mb-4">
        Swipe or click to like/dislike ({currentIndex + 1}/{dishes.length})
      </p>
      <Card className="w-80 h-96 mb-4">
        <CardContent className="flex flex-col justify-between h-full p-4">
          <h3 className="text-xl font-semibold">{currentDish.name}</h3>
          <p>{currentDish.type}</p>
          {/* Add more dish details or an image here */}
        </CardContent>
      </Card>
      <div className="flex space-x-4">
        <Button onClick={handleDislike} variant="outline">
          Dislike
        </Button>
        <Button onClick={handleLike}>Like</Button>
      </div>
    </div>
  );
}
