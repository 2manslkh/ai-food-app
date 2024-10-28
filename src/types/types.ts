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
