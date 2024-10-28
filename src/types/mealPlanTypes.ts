// Represents a meal plan with its basic details
export interface MealPlan {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  days: MealDay[];
}

// Represents a day within a meal plan, including nutritional totals
export interface MealDay {
  id: string;
  meal_plan_id: string;
  date: string;
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
}

export interface Recipe {
  author: string ;
  ingredients: string[];
  instructions: string[];
}
