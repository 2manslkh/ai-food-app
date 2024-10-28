export * from "./mealPlanTypes";
export * from "./database.types";
export * from "./types";

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

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
  mealDayId?: string;
}

export interface MealDay {
  meals: Meal[];
  dayOfWeek: string;
  mealDayId: string;
}

export interface WeeklyPlan {
  [key: string]: MealDay;
}

// You can also create a type for the days of the week to ensure type safety
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

// Alternative version with DayOfWeek type
export interface TypedWeeklyPlan {
  [key in DayOfWeek]: MealDay;
}
