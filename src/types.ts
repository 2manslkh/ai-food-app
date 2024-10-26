// Meal-related types
export interface Meal {
    id: string;
    name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipe: Recipe;
    servingSize: number;
    nutrition: NutritionInfo;
}

export interface Recipe {
    id: string;
    name: string;
    ingredients: string[];
    instructions: string[];
}

export interface NutritionInfo {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
}

// Day and Meal Plan types
export interface MealDay {
    date: Date;
    meals: Meal[];
    nutritionSummary: NutritionInfo;
}

export interface MealPlan {
    id: string;
    userId: string;
    startDate: Date;
    endDate: Date;
    days: MealDay[];
    nutritionSummary: NutritionInfo;
    shoppingList: ShoppingList;
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
