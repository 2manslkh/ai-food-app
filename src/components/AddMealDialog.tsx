import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Meal } from "@/types";
import { MealCardCompact } from "./MealCardCompact";
import { useUpdateMealDay } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

interface AddMealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeals: (meals: Meal[]) => void;
  favoriteMeals: Meal[];
  mealDayId: string;
  currentMeals: Meal[];
}

export function AddMealDialog({
  isOpen,
  onClose,
  onAddMeals,
  favoriteMeals,
  mealDayId,
  currentMeals,
}: AddMealDialogProps) {
  console.log("🚀 | currentMeals:", currentMeals);
  const [selectedMeals, setSelectedMeals] = useState<Set<string>>(new Set());
  const updateMealDay = useUpdateMealDay();

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

  const handleAddSelectedMeals = async () => {
    const mealsToAdd = favoriteMeals.filter((meal) => selectedMeals.has(meal.id));

    try {
      // Combine current meals with new meals
      const updatedMeals = [...currentMeals, ...mealsToAdd];
      console.log("🚀 | handleAddSelectedMeals | updatedMeals:", updatedMeals);

      await updateMealDay.mutateAsync({
        mealDayId,
        meals: updatedMeals,
      });

      onAddMeals(updatedMeals);
      setSelectedMeals(new Set());
      onClose();

      toast({
        title: "Success",
        description: "Meals updated successfully",
      });
    } catch (error) {
      console.error("Failed to update meals:", error);
      toast({
        title: "Error",
        description: "Failed to update meals",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Meals</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-0">
            {favoriteMeals.map((meal) => (
              <div
                key={meal.id}
                className="cursor-pointer p-1"
                onClick={() => handleToggleMeal(meal.id)}
              >
                <MealCardCompact meal={meal} isSelected={selectedMeals.has(meal.id)} />
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleAddSelectedMeals}
            disabled={selectedMeals.size === 0 || updateMealDay.isPending}
          >
            {updateMealDay.isPending ? "Adding..." : `Add Selected Meals (${selectedMeals.size})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
