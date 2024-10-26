# AI Meal Planner Development Context

## System Overview

The AI Meal Planner is a web application that generates personalized meal plans based on user preferences, dietary requirements, and health goals. The system uses AI to create balanced, nutritious meal plans while considering user constraints and preferences.

## Core Components

### 1. User Management System

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  healthData: HealthData;
  savedMealPlans: MealPlan[];
}

interface UserPreferences {
  dietaryRestrictions: string[]; // e.g., ["vegetarian", "gluten-free"]
  allergies: string[];
  dislikedIngredients: string[];
  cuisinePreferences: string[]; // e.g., ["italian", "mexican"]
  mealPreferences: {
    breakfastTime?: string;
    lunchTime?: string;
    dinnerTime?: string;
    snacks: boolean;
    mealsPerDay: number;
  };
}

interface HealthData {
  age: number;
  height: number;
  weight: number;
  activityLevel: "sedentary" | "light" | "moderate" | "very_active";
  healthGoals: string[]; // e.g., ["weight_loss", "muscle_gain"]
  targetCalories?: number;
  targetMacros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
}
```

### 2. Meal Planning System

```typescript
interface MealPlan {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  days: MealDay[];
  nutritionSummary: NutritionSummary;
  shoppingList: ShoppingList;
}

interface MealDay {
  date: Date;
  meals: Meal[];
  nutritionSummary: NutritionSummary;
}

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  recipe: Recipe;
  servingSize: number;
  nutrition: NutritionInfo;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  substitutes?: string[];
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

interface ShoppingList {
  items: ShoppingItem[];
  categories: Record<string, ShoppingItem[]>;
}

interface ShoppingItem {
  ingredient: Ingredient;
  totalAmount: number;
  unit: string;
  category: string;
}
```

## API Endpoints

### User Management

```typescript
interface UserAPI {
  // User CRUD operations
  createUser(userData: Partial<User>): Promise<User>;
  updateUser(userId: string, userData: Partial<User>): Promise<User>;
  getUserProfile(userId: string): Promise<User>;

  // Preference management
  updatePreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences>;
  updateHealthData(
    userId: string,
    healthData: Partial<HealthData>
  ): Promise<HealthData>;
}
```

### Meal Planning

```typescript
interface MealPlanningAPI {
  // Meal plan generation
  generateMealPlan(
    userId: string,
    options: {
      startDate: Date;
      duration: number;
      preferences?: Partial<UserPreferences>;
    }
  ): Promise<MealPlan>;

  // Meal plan management
  saveMealPlan(userId: string, mealPlan: MealPlan): Promise<MealPlan>;
  updateMealPlan(
    mealPlanId: string,
    updates: Partial<MealPlan>
  ): Promise<MealPlan>;
  getMealPlan(mealPlanId: string): Promise<MealPlan>;

  // Shopping list
  generateShoppingList(mealPlanId: string): Promise<ShoppingList>;
  updateShoppingList(
    shoppingListId: string,
    updates: Partial<ShoppingList>
  ): Promise<ShoppingList>;
}
```

## AI Features

### 1. Meal Plan Generation

- Consider user preferences and restrictions
- Balance nutrition across meals and days
- Optimize for variety and ingredient use
- Account for seasonal ingredients
- Consider meal prep efficiency

### 2. Recipe Substitution

- Handle ingredient allergies
- Provide alternative ingredients
- Maintain nutritional balance
- Consider availability

### 3. Smart Shopping List

- Consolidate ingredients across recipes
- Categorize by store sections
- Optimize for package sizes
- Suggest cost-effective alternatives

## UI Components

### 1. User Onboarding

- Diet preference selection
- Health goals input
- Allergies and restrictions
- Cooking skill level
- Time availability

### 2. Meal Plan Display

- Calendar view
- Daily breakdown
- Nutritional summary
- Recipe details
- Shopping list

### 3. Recipe Interface

- Step-by-step instructions
- Ingredient quantities
- Timing information
- Difficulty indicators
- Substitution options

## Business Rules

### 1. Meal Planning

- Must meet daily caloric requirements (±10%)
- Protein requirements based on user goals
- Maximum of 2 complex recipes per day
- Respect meal timing preferences
- Include meal prep suggestions

### 2. Nutrition

- Balance macronutrients according to diet type
- Meet micronutrient requirements
- Consider sodium and sugar limits
- Account for dietary restrictions

### 3. Shopping and Preparation

- Group similar ingredients
- Optimize for minimal food waste
- Consider ingredient shelf life
- Account for common pantry items

## Error Handling

### 1. Input Validation

```typescript
interface ValidationRules {
  calories: {
    min: 1200;
    max: 4000;
  };
  mealCount: {
    min: 2;
    max: 6;
  };
  restrictions: string[]; // Valid dietary restrictions
}
```

### 2. Error Types

```typescript
enum ErrorType {
  INVALID_INPUT = "INVALID_INPUT",
  NUTRITION_CONSTRAINT = "NUTRITION_CONSTRAINT",
  PREFERENCE_CONFLICT = "PREFERENCE_CONFLICT",
  RECIPE_NOT_FOUND = "RECIPE_NOT_FOUND",
  INGREDIENT_NOT_AVAILABLE = "INGREDIENT_NOT_AVAILABLE",
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: Record<string, any>;
}
```

## Performance Requirements

### 1. Response Times

- Meal plan generation: < 5 seconds
- Recipe substitution: < 1 second
- Shopping list generation: < 2 seconds

### 2. Scalability

- Support concurrent user requests
- Cache common recipe combinations
- Optimize nutritional calculations

## Integration Points

### 1. External Services

```typescript
interface ExternalServices {
  nutritionAPI: {
    getFoodData(ingredient: string): Promise<NutritionInfo>;
    validateMealPlan(plan: MealPlan): Promise<boolean>;
  };

  recipeAPI: {
    searchRecipes(criteria: SearchCriteria): Promise<Recipe[]>;
    getRecipeDetails(recipeId: string): Promise<Recipe>;
  };
}
```

### 2. Notifications

```typescript
interface NotificationSystem {
  mealReminders: {
    scheduleReminder(userId: string, mealTime: Date): Promise<void>;
    cancelReminder(reminderId: string): Promise<void>;
  };

  shoppingReminders: {
    scheduleShoppingReminder(userId: string, mealPlan: MealPlan): Promise<void>;
  };
}
```

## Security Considerations

### 1. Data Protection

- Encrypt user health data
- Secure API endpoints
- Validate user permissions
- Sanitize user input

### 2. Privacy

- Handle user data according to GDPR
- Implement data retention policies
- Provide data export functionality
- Allow data deletion

## Testing Requirements

### 1. Unit Tests

- Nutrition calculations
- Recipe substitutions
- Shopping list generation
- User preference handling

### 2. Integration Tests

- Meal plan generation
- External API interactions
- Database operations
- User workflows

### 3. Performance Tests

- Concurrent user handling
- Database query optimization
- Cache effectiveness
- API response times

This context provides the necessary information for an AI agent to understand and implement the meal planning application. The system architecture, data models, and business rules are defined in a way that enables systematic development and testing of the application's features.
