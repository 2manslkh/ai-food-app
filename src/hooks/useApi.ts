import { QueryObserverResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserId } from "./useUserId";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { AggregatedMeal, Meal, MealDay, MealPlan, NutritionInfo } from "@/types";

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

  return useQuery<MealPlan[], Error>({
    queryKey: ["mealPlans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_plans")
        .select("*")
        .order("start_date", { ascending: true });
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

// Fetch Meal Days
export function useFetchMealDays(mealPlanId: string) {
  const { supabase } = useSupabase();

  return useQuery<MealDay[], Error>({
    queryKey: ["mealDays", mealPlanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_days")
        .select("*")
        .eq("meal_plan_id", mealPlanId)
        .order("date", { ascending: true });
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

  return useMutation({
    mutationFn: async ({
      mealPlanId,
      weeklyPlan,
    }: {
      mealPlanId: string;
      weeklyPlan: { [key: string]: Meal[] };
    }) => {
      // First, create meal days for each day of the week
      const mealDaysPromises = Object.entries(weeklyPlan).map(async ([day, meals]) => {
        // Convert day name to date
        const dayIndex = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].indexOf(day);
        const date = new Date();
        date.setDate(date.getDate() + (dayIndex - date.getDay() + 1));

        // Create meal day
        const { data: mealDay, error: mealDayError } = await supabase.rpc(
          "add_meal_day_to_meal_plan",
          {
            p_meal_plan_id: mealPlanId,
            p_date: date.toISOString().split("T")[0],
          }
        );

        if (mealDayError) throw mealDayError;

        // Add meals to the meal day
        const mealsPromises = meals.map((meal) =>
          supabase.rpc("add_meal_to_meal_day", {
            p_meal_day_id: mealDay.id,
            p_recipe_id: meal.id,
            p_meal_type: meal.type,
            p_serving_size: 1, // Default serving size
          })
        );

        await Promise.all(mealsPromises);
        return mealDay;
      });

      await Promise.all(mealDaysPromises);
      return true;
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
        (item): Meal => ({
          id: item.recipe_id,
          name: item.recipe_name,
          type: item.recipe_type,
          instructions: item.instructions,
          ingredients: item.ingredients,
          nutrition: item.nutrition,
          image: item.image,
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
        (item): Meal => ({
          id: item.recipe_id,
          name: item.recipe_name,
          type: item.recipe_type,
          instructions: item.instructions,
          ingredients: item.ingredients,
          image: item.image,
          nutrition: {
            calories: item.nutrition?.calories || 0,
            protein: item.nutrition?.protein || 0,
            carbs: item.nutrition?.carbs || 0,
            fats: item.nutrition?.fats || 0,
          },
        })
      );
    },
    enabled: !!userId,
  });
}
