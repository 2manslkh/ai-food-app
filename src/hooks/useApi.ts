import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserId } from "./useUserId";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import {
  AggregatedMeal,
  Json,
  Meal,
  MealDay,
  MealPlan,
  MealPlanSummary,
  NutritionInfo,
  WeeklyPlan,
} from "@/types";

// Create Meal Plan
export function useCreateMealPlan() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({
      name,
      startDate,
      endDate,
    }: {
      name: string;
      startDate: string;
      endDate: string;
    }) => {
      if (!userId) throw new Error("User not authenticated");
      const { data, error } = await supabase.rpc("create_meal_plan", {
        p_user_id: userId,
        p_name: name,
        p_start_date: startDate,
        p_end_date: endDate,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });
}

// Edit Meal Plan
export function useEditMealPlan() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({
      mealPlanId,
      name,
      startDate,
      endDate,
    }: {
      mealPlanId: string;
      name: string;
      startDate: string;
      endDate: string;
    }) => {
      const { data, error } = await supabase.rpc("edit_meal_plan", {
        p_meal_plan_id: mealPlanId,
        p_name: name,
        p_start_date: startDate,
        p_end_date: endDate,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });
}

// Delete Meal Plan
export function useDeleteMealPlan() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async (mealPlanId: string) => {
      const { data, error } = await supabase.rpc("delete_meal_plan", {
        p_meal_plan_id: mealPlanId,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });
}

// Fetch Meal Plans
export function useFetchMealPlans() {
  const { supabase } = useSupabase();

  return useQuery<MealPlanSummary[], Error>({
    queryKey: ["mealPlans"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_meal_plans");

      if (error) throw error;
      if (!data) return [];

      return data.map(
        (plan): MealPlanSummary => ({
          id: plan.id,
          user_id: plan.user_id,
          name: plan.name,
          start_date: plan.start_date,
          end_date: plan.end_date,
          total_days: plan.total_days,
          total_meals: plan.total_meals,
          total_calories: plan.total_calories,
          created_at: plan.created_at,
        })
      );
    },
  });
}

// Add Meal Day
export function useAddMealDay() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({ mealPlanId, date }: { mealPlanId: string; date: string }) => {
      const { data, error } = await supabase.rpc("add_meal_day_to_meal_plan", {
        p_meal_plan_id: mealPlanId,
        p_date: date,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mealDays", variables.mealPlanId] });
    },
  });
}

// Add Meal to Meal Day
export function useAddMealToMealDay() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({
      mealDayId,
      recipeId,
      mealType,
      servingSize,
    }: {
      mealDayId: string;
      recipeId: string;
      mealType: string;
      servingSize: number;
    }) => {
      const { data, error } = await supabase.rpc("add_meal_to_meal_day", {
        p_meal_day_id: mealDayId,
        p_recipe_id: recipeId,
        p_meal_type: mealType,
        p_serving_size: servingSize,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meals", variables.mealDayId] });
    },
  });
}
// Fetch Meals for Meal Day
export function useFetchMealsForMealDay(mealDayId: string): QueryObserverResult<Meal[], Error> {
  const { supabase } = useSupabase();

  return useQuery<Meal[], Error>({
    queryKey: ["meals", mealDayId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_day_meals")
        .select(
          `
          id,
          recipe_id,
          meal_type,
          serving_size,
          calories,
          protein,
          carbs,
          fats,
          recipe:recipes (
            id,
            name,
            type,
            nutrition,
            image,
            author,
            ingredients,
            instructions
          )
        `
        )
        .eq("meal_day_id", mealDayId);

      if (error) throw error;
      if (!data) return [];

      return data.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any): AggregatedMeal => ({
          id: item.id,
          name: item.recipe.name,
          type: item.recipe.type,
          image: item.recipe.image,
          recipe: {
            author: item.recipe.author,
            ingredients: item.recipe.ingredients,
            instructions: item.recipe.instructions,
          },
          meal_type: item.meal_type,
          serving_size: item.serving_size,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fats: item.fats,
          recipe_id: item.recipe_id,
          nutrition: {
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
          },
        })
      );
    },
  });
}

// Save Meal Plan Days
export function useSaveMealPlanDays() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  console.log("useSaveMealPlanDays");

  return useMutation({
    mutationFn: async ({
      mealPlanId,
      weeklyPlan,
    }: {
      mealPlanId: string;
      weeklyPlan: WeeklyPlan;
    }) => {
      const { data, error } = await supabase.rpc("save_meal_plan_days", {
        p_meal_plan_id: mealPlanId,
        p_days: JSON.stringify(weeklyPlan),
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mealDays", variables.mealPlanId] });
      queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });
}

// Toggle favorite meal
export function useToggleFavoriteMeal() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async (recipeId: string) => {
      const { data, error } = await supabase.rpc("toggle_favorite_meal", {
        p_recipe_id: recipeId,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteMeals"] });
    },
  });
}

// Fetch favorite meals
export function useFetchFavoriteMeals() {
  const { supabase } = useSupabase();

  return useQuery<Meal[], Error>({
    queryKey: ["favoriteMeals"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_favorite_meals");

      if (error) throw error;
      if (!data) return [];

      return data.map(
        (item: any): Meal => ({
          id: item.recipe_id,
          name: item.recipe_name,
          type: item.recipe_type,
          recipe_id: item.recipe_id,
          recipe: {
            author: "",
            instructions: item.instructions,
            ingredients: item.ingredients,
          },
          nutrition: item.nutrition,
          image: item.image,
          meal_type: "",
          serving_size: 0,
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        })
      );
    },
  });
}

// Add this new hook to handle meal interactions
export function useHandleMealInteraction() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  console.log("useHandleMealInteraction");

  return useMutation({
    mutationFn: async ({ meal, isFavorite }: { meal: Meal; isFavorite: boolean }) => {
      const { data, error } = await supabase.rpc("handle_meal_interaction", {
        p_name: meal.name,
        p_type: meal.meal_type,
        p_instructions: meal.recipe.instructions,
        p_ingredients: meal.recipe.ingredients,
        p_calories: meal.nutrition.calories,
        p_protein: meal.nutrition.protein,
        p_carbs: meal.nutrition.carbs,
        p_fats: meal.nutrition.fats,
        p_image: meal.image || "", // Make sure to provide null if image is undefined
        p_is_favorite: isFavorite,
      });

      // public.handle_meal_interaction(p_calories, p_carbs, p_fats, p_image, p_ingredients, p_instructions, p_is_favorite, p_name, p_protein, p_type)
      // public.handle_meal_interaction(p_calories, p_carbs, p_fats, p_image, p_ingredients, p_instructions, p_is_favorite, p_name, p_protein)

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteMeals"] });
    },
  });
}

// Fetch favorite meals for a specific user
export function useFetchUserFavoriteMeals() {
  const { supabase } = useSupabase();
  const userId = useUserId();

  return useQuery<Meal[], Error>({
    queryKey: ["userFavoriteMeals", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("get_user_favorite_meals", {
        p_user_id: userId,
      });
      console.log("🚀 | queryFn: | data:", data);

      if (error) throw error;
      if (!data) return [];

      return data.map(
        (item: any): Meal => ({
          id: item.recipe_id,
          name: item.recipe_name,
          type: item.recipe_type,
          recipe_id: item.recipe_id,
          recipe: {
            author: "",
            instructions: item.instructions,
            ingredients: item.ingredients,
          },
          nutrition: item.nutrition,
          image: item.image,
          meal_type: "",
          serving_size: 0,
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        })
      );
    },
    enabled: !!userId,
  });
}

// Add Multiple Meals to Meal Day
export function useAddMealsToMealDay() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({ mealDayId, meals }: { mealDayId: string; meals: Meal[] }) => {
      const { data, error } = await supabase.rpc("add_meals_to_meal_day", {
        p_meal_day_id: mealDayId,
        p_meals: JSON.stringify(meals),
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meals", variables.mealDayId] });
    },
  });
}

// Fetch Meal Plan Days
export function useFetchMealPlanDays(mealPlanId: string | null) {
  const { supabase } = useSupabase();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return useQuery<WeeklyPlan>({
    queryKey: ["mealPlanDays", mealPlanId],
    queryFn: async () => {
      if (!mealPlanId) throw new Error("No meal plan ID provided");

      const { data, error } = await supabase.rpc("get_meal_plan_days", {
        p_meal_plan_id: mealPlanId,
      });

      if (error) throw error;

      // Initialize empty plan with all days
      const emptyPlan = daysOfWeek.reduce(
        (acc, day) => ({
          ...acc,
          [day]: {
            meals: [],
            dayOfWeek: day,
            mealDayId: "",
          },
        }),
        {} as any
      );

      // If no data, return empty plan
      if (!data || !Array.isArray(data)) return emptyPlan;

      // Merge data with empty plan to ensure all days exist
      return data.reduce((acc, day) => {
        if (!day || !day.day_of_week) return acc;

        const dayOfWeek = day.day_of_week;
        const meals = Array.isArray(day.meals) ? day.meals : [];

        // Transform meals to include mealDayId
        const transformedMeals = meals.map((meal: any) => ({
          id: meal.id,
          name: meal.name,
          type: meal.type,
          nutrition: meal.nutrition,
          image: meal.image,
          recipe: meal.recipe,
          mealDayId: meal.mealDayId,
        }));

        acc[dayOfWeek] = {
          meals: transformedMeals,
          dayOfWeek: dayOfWeek,
          mealDayId: day.id,
        };

        return acc;
      }, emptyPlan);
    },
    enabled: !!mealPlanId,
  });
}

// Update Meal Day
export function useUpdateMealDay() {
  const queryClient = useQueryClient();
  const { supabase } = useSupabase();

  return useMutation({
    mutationFn: async ({ mealDayId, meals }: { mealDayId: string; meals: Meal[] }) => {
      const { data, error } = await supabase.rpc("update_meal_day", {
        p_meal_day_id: mealDayId,
        p_meals: JSON.stringify(meals),
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meals", variables.mealDayId] });
      queryClient.invalidateQueries({ queryKey: ["mealPlanDays"] });
    },
  });
}
