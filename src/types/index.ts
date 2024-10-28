export * from "./mealPlanTypes";
export * from "./database.types";
export * from "./types";

export interface Meal {
  id: string;
  name: string;
  type: string;
  nutrition: NutritionInfo;
  image?: string;
  recipe: {
    instructions: string[];
    ingredients: string[];
  };
  mealDayId?: string; // Add this line
}
