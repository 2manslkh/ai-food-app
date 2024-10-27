import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MealPlan, MealDay, Meal } from '@/lib/api';
import { useUserId } from './useUserId';
import { useSupabase } from '@/components/providers/SupabaseProvider';

// Create Meal Plan
export function useCreateMealPlan() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({ name, startDate, endDate }: { name: string; startDate: string; endDate: string }) => {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await supabase.rpc('create_meal_plan', {
        p_user_id: userId,
        p_name: name,
        p_start_date: startDate,
        p_end_date: endDate
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
    },
  });
}

// Edit Meal Plan
export function useEditMealPlan() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({ mealPlanId, name, startDate, endDate }: { mealPlanId: string; name: string; startDate: string; endDate: string }) => {
      const { data, error } = await supabase.rpc('edit_meal_plan', {
        p_meal_plan_id: mealPlanId,
        p_name: name,
        p_start_date: startDate,
        p_end_date: endDate
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
    },
  });
}

// Delete Meal Plan
export function useDeleteMealPlan() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async (mealPlanId: string) => {
      const { data, error } = await supabase.rpc('delete_meal_plan', {
        p_meal_plan_id: mealPlanId
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
    },
  });
}

// Fetch Meal Plans
export function useFetchMealPlans() {
  const { supabase } = useSupabase();

  return useQuery<MealPlan[], Error>({
    queryKey: ['mealPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .order('start_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// Add Meal Day
export function useAddMealDay() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({ mealPlanId, date }: { mealPlanId: string; date: string }) => {
      const { data, error } = await supabase.rpc('add_meal_day_to_meal_plan', {
        p_meal_plan_id: mealPlanId,
        p_date: date
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mealDays', variables.mealPlanId] });
    },
  });
}

// Fetch Meal Days
export function useFetchMealDays(mealPlanId: string) {
  const { supabase } = useSupabase();

  return useQuery<MealDay[], Error>({
    queryKey: ['mealDays', mealPlanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meal_days')
        .select('*')
        .eq('meal_plan_id', mealPlanId)
        .order('date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// Add Meal to Meal Day
export function useAddMealToMealDay() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({ mealDayId, recipeId, mealType, servingSize }: { mealDayId: string; recipeId: string; mealType: string; servingSize: number }) => {
      const { data, error } = await supabase.rpc('add_meal_to_meal_day', {
        p_meal_day_id: mealDayId,
        p_recipe_id: recipeId,
        p_meal_type: mealType,
        p_serving_size: servingSize
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meals', variables.mealDayId] });
    },
  });
}

// Fetch Meals for Meal Day
export function useFetchMealsForMealDay(mealDayId: string) {
  const { supabase } = useSupabase();

  return useQuery<Meal[], Error>({
    queryKey: ['meals', mealDayId],
    queryFn: async () => {
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
      if (error) throw error;
      return data.map((item: { meals: Meal }) => item.meals);
    },
  });
}
