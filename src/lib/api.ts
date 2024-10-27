import { supabase } from './supabaseClient';

export interface MealPlan {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface MealDay {
  id: string;
  meal_plan_id: string;
  date: string;
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
}

// Helper functions for meal plans
export async function createMealPlan(name: string, startDate: string, endDate: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('create_meal_plan', {
    p_user_id: supabase.auth.user()?.id,
    p_name: name,
    p_start_date: startDate,
    p_end_date: endDate
  });

  if (error) {
    console.error('Error creating meal plan:', error);
    return null;
  }

  return data;
}

export async function editMealPlan(mealPlanId: string, name: string, startDate: string, endDate: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('edit_meal_plan', {
    p_meal_plan_id: mealPlanId,
    p_name: name,
    p_start_date: startDate,
    p_end_date: endDate
  });

  if (error) {
    console.error('Error editing meal plan:', error);
    return false;
  }

  return data;
}

export async function deleteMealPlan(mealPlanId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('delete_meal_plan', {
    p_meal_plan_id: mealPlanId
  });

  if (error) {
    console.error('Error deleting meal plan:', error);
    return false;
  }

  return data;
}

export async function fetchMealPlans(): Promise<MealPlan[]> {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching meal plans:', error);
    return [];
  }

  return data;
}

// Helper functions for meal days
export async function addMealDay(mealPlanId: string, date: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('add_meal_day_to_meal_plan', {
    p_meal_plan_id: mealPlanId,
    p_date: date
  });

  if (error) {
    console.error('Error adding meal day:', error);
    return null;
  }

  return data;
}

export async function fetchMealDays(mealPlanId: string): Promise<MealDay[]> {
  const { data, error } = await supabase
    .from('meal_days')
    .select('*')
    .eq('meal_plan_id', mealPlanId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching meal days:', error);
    return [];
  }

  return data;
}

// Helper functions for meals
export async function addMealToMealDay(mealDayId: string, recipeId: string, mealType: string, servingSize: number): Promise<string | null> {
  const { data, error } = await supabase.rpc('add_meal_to_meal_day', {
    p_meal_day_id: mealDayId,
    p_recipe_id: recipeId,
    p_meal_type: mealType,
    p_serving_size: servingSize
  });

  if (error) {
    console.error('Error adding meal to meal day:', error);
    return null;
  }

  return data;
}

export async function fetchMealsForMealDay(mealDayId: string): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meal_day_meals')
    .select(`
      meals (
        id,
        recipe_id,
        meal_type,
        serving_size,
        calories,
        protein,
        carbs,
        fats
      )
    `)
    .eq('meal_day_id', mealDayId);

  if (error) {
    console.error('Error fetching meals for meal day:', error);
    return [];
  }

  return data.map((item: any) => item.meals);
}

// You can keep the existing fetchMeals function for backwards compatibility if needed
export async function fetchMeals(): Promise<Meal[]> {
  // This function now returns an empty array as we're using the new structure
  return [];
}
