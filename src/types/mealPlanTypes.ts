// Represents a meal plan with its basic details
export interface MealPlan {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
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
}

// Represents a meal within a meal day, including nutritional information
export interface Meal {
  id: string;
  recipe: Recipe;
  meal_type: string;
  serving_size: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  recipe_id: string;
  name: string;
  type: string;
  nutrition: NutritionInfo;
  image: string;
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
