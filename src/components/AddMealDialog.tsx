import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Meal } from "@/types";
import { MealCardCompact } from "./MealCardCompact";

interface AddMealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeals: (meals: Meal[]) => void;
  favoriteMeals: Meal[];
}

export function AddMealDialog({
  isOpen,
  onClose,
  onAddMeals,
  favoriteMeals,
}: AddMealDialogProps) {
  const [selectedMeals, setSelectedMeals] = useState<Set<string>>(new Set());

  const handleToggleMeal = (mealId: string) => {
    setSelectedMeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
      } else {
        newSet.add(mealId);
      }
      return newSet;
    });
  };

  const handleAddSelectedMeals = () => {
    const mealsToAdd = favoriteMeals.filter((meal) =>
      selectedMeals.has(meal.id)
    );
    onAddMeals(mealsToAdd);
    setSelectedMeals(new Set());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Meals</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="space-y-2">
            {favoriteMeals.map((meal) => (
              <div key={meal.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedMeals.has(meal.id)}
                  onCheckedChange={() => handleToggleMeal(meal.id)}
                  id={`meal-${meal.id}`}
                />
                <label
                  htmlFor={`meal-${meal.id}`}
                  className="flex-grow cursor-pointer"
                >
                  <MealCardCompact meal={meal} />
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAddSelectedMeals}
            disabled={selectedMeals.size === 0}
          >
            Add Selected Meals ({selectedMeals.size})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
