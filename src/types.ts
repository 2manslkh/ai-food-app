// Meal-related types
// export interface Meal {
//     id: string;
//     name: string;
//     type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
//     recipe: Recipe;
//     nutrition: NutritionInfo;
//     image: string;
// }

export interface Recipe {
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

// Day and Meal Plan types
// export interface MealDay {
//     date: Date;
//     meals: Meal[];
//     nutritionSummary: NutritionInfo;
// }

// export interface MealPlan {
//     days: MealDay[];
// }

// Shopping List types
export interface ShoppingList {
    items: ShoppingListItem[];
    categories: { [key: string]: ShoppingListItem[] };
}

export interface ShoppingListItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
}

// User-related types
export interface UserPreferences {
    dietPreference: string;
    healthGoals: string[];
    allergies: string[];
    cookingSkill: string;
    timeAvailability: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    preferences: UserPreferences;
}

// Message type for chat
export interface Message {
    role: string;
    content: string;
}

export interface MealPlan {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface MealDay {
  id: string;
  meal_plan_id: string;
  date: Date;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
}

export interface Meal {
  id: string;
  recipe_id: string;
  meal_type: string;
  serving_size: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe: Recipe;
  nutrition: NutritionInfo;
  image: string;
}
