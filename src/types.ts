// Meal-related types
export interface Meal {
    id: string;
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipe: Recipe;
    nutrition: NutritionInfo;
    image: string;
}

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
export interface MealDay {
    date: Date;
    meals: Meal[];
    nutritionSummary: NutritionInfo;
}

export interface MealPlan {
    days: MealDay[];
}

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
