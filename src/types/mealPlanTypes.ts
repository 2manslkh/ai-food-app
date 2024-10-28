// Represents a meal plan with its basic details
export interface MealPlan {
  id: string;
  user_id: string | null;
  name: string;
  start_date: string | null;
  end_date: string | null;
  days: MealDay[];
}

// Represents a day within a meal plan, including nutritional totals
export interface MealDay {
  id: string;
  meal_plan_id: string;
  date: Date;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  meals: Meal[];
  day_of_week: string;
  meal_day_id: string;
}

// Represents a meal within a meal day, including nutritional information
export interface Meal {
  id: string;
  recipe_id: string;
  recipe: Recipe;
  meal_type: string;
  serving_size: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  name: string;
  type: string;
  nutrition: NutritionInfo;
  image: string;
  meal_day_id?: string;
}

export interface Recipe {
  author: string;
  ingredients: string[];
  instructions: string[];
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sugar?: number;
}

export interface AggregatedMeal {
  id: string;
  name: string;
  type: string;
  image: string;
  recipe: Recipe;
  meal_type: string;
  serving_size: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  recipe_id: string;
  nutrition: NutritionInfo;
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

// Update the MealPlan interface in types/mealPlanTypes.ts first
export interface MealPlanSummary {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  total_meals: number;
  total_calories: number;
  created_at: string;
}
