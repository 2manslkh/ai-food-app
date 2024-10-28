export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      health_data: {
        Row: {
          activity_level: string | null
          age: number | null
          health_goals: string[] | null
          height: number | null
          target_calories: number | null
          target_carbs: number | null
          target_fats: number | null
          target_protein: number | null
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          health_goals?: string[] | null
          height?: number | null
          target_calories?: number | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          health_goals?: string[] | null
          height?: number | null
          target_calories?: number | null
          target_carbs?: number | null
          target_fats?: number | null
          target_protein?: number | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          category: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      meal_day_meals: {
        Row: {
          id: string
          meal_day_id: string | null
          meal_id: string | null
        }
        Insert: {
          id?: string
          meal_day_id?: string | null
          meal_id?: string | null
        }
        Update: {
          id?: string
          meal_day_id?: string | null
          meal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_day_meals_meal_day_id_fkey"
            columns: ["meal_day_id"]
            isOneToOne: false
            referencedRelation: "meal_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_day_meals_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_days: {
        Row: {
          date: string | null
          day_of_week: string | null
          id: string
          meal_plan_id: string | null
          total_calories: number | null
          total_carbs: number | null
          total_fats: number | null
          total_protein: number | null
        }
        Insert: {
          date?: string | null
          day_of_week?: string | null
          id?: string
          meal_plan_id?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fats?: number | null
          total_protein?: number | null
        }
        Update: {
          date?: string | null
          day_of_week?: string | null
          id?: string
          meal_plan_id?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fats?: number | null
          total_protein?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_days_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number | null
          carbs: number | null
          fats: number | null
          id: string
          meal_type: string | null
          protein: number | null
          recipe_id: string | null
          serving_size: number | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          fats?: number | null
          id?: string
          meal_type?: string | null
          protein?: number | null
          recipe_id?: string | null
          serving_size?: number | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          fats?: number | null
          id?: string
          meal_type?: string | null
          protein?: number | null
          recipe_id?: string | null
          serving_size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_info: {
        Row: {
          calories: number | null
          carbs: number | null
          fats: number | null
          fiber: number | null
          protein: number | null
          recipe_id: string
          sugar: number | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          fats?: number | null
          fiber?: number | null
          protein?: number | null
          recipe_id: string
          sugar?: number | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          fats?: number | null
          fiber?: number | null
          protein?: number | null
          recipe_id?: string
          sugar?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_info_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: true
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          amount: number | null
          ingredient_id: string
          recipe_id: string
          unit: string | null
        }
        Insert: {
          amount?: number | null
          ingredient_id: string
          recipe_id: string
          unit?: string | null
        }
        Update: {
          amount?: number | null
          ingredient_id?: string
          recipe_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_time: number | null
          difficulty: string | null
          id: string
          image: string | null
          ingredients: string[] | null
          instructions: string[] | null
          name: string
          prep_time: number | null
          servings: number | null
          tags: string[] | null
          type: string | null
        }
        Insert: {
          cook_time?: number | null
          difficulty?: string | null
          id?: string
          image?: string | null
          ingredients?: string[] | null
          instructions?: string[] | null
          name: string
          prep_time?: number | null
          servings?: number | null
          tags?: string[] | null
          type?: string | null
        }
        Update: {
          cook_time?: number | null
          difficulty?: string | null
          id?: string
          image?: string | null
          ingredients?: string[] | null
          instructions?: string[] | null
          name?: string
          prep_time?: number | null
          servings?: number | null
          tags?: string[] | null
          type?: string | null
        }
        Relationships: []
      }
      shopping_items: {
        Row: {
          id: string
          ingredient_id: string | null
          shopping_list_id: string | null
          total_amount: number | null
          unit: string | null
        }
        Insert: {
          id?: string
          ingredient_id?: string | null
          shopping_list_id?: string | null
          total_amount?: number | null
          unit?: string | null
        }
        Update: {
          id?: string
          ingredient_id?: string | null
          shopping_list_id?: string | null
          total_amount?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          id: string
          meal_plan_id: string | null
        }
        Insert: {
          id?: string
          meal_plan_id?: string | null
        }
        Update: {
          id?: string
          meal_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorite_meals: {
        Row: {
          created_at: string | null
          id: string
          recipe_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          allergies: string[] | null
          breakfast_time: string | null
          cuisine_preferences: string[] | null
          dietary_restrictions: string[] | null
          dinner_time: string | null
          disliked_ingredients: string[] | null
          lunch_time: string | null
          meals_per_day: number | null
          snacks: boolean | null
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          breakfast_time?: string | null
          cuisine_preferences?: string[] | null
          dietary_restrictions?: string[] | null
          dinner_time?: string | null
          disliked_ingredients?: string[] | null
          lunch_time?: string | null
          meals_per_day?: number | null
          snacks?: boolean | null
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          breakfast_time?: string | null
          cuisine_preferences?: string[] | null
          dietary_restrictions?: string[] | null
          dinner_time?: string | null
          disliked_ingredients?: string[] | null
          lunch_time?: string | null
          meals_per_day?: number | null
          snacks?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_meal_day_to_meal_plan: {
        Args: {
          p_meal_plan_id: string
          p_date: string
        }
        Returns: string
      }
      add_meal_to_meal_day: {
        Args: {
          p_meal_day_id: string
          p_recipe_id: string
          p_meal_type: string
          p_serving_size: number
        }
        Returns: string
      }
      add_meals_to_meal_day: {
        Args: {
          p_meal_day_id: string
          p_meals: Json
        }
        Returns: boolean
      }
      create_meal_plan: {
        Args: {
          p_user_id: string
          p_name: string
          p_start_date: string
          p_end_date: string
        }
        Returns: string
      }
      create_or_get_meal: {
        Args: {
          p_name: string
          p_type: string
          p_instructions: string[]
          p_ingredients: string[]
          p_calories: number
          p_protein: number
          p_carbs: number
          p_fats: number
          p_image?: string
        }
        Returns: string
      }
      delete_meal_plan: {
        Args: {
          p_meal_plan_id: string
        }
        Returns: boolean
      }
      edit_meal_plan: {
        Args: {
          p_meal_plan_id: string
          p_name: string
          p_start_date: string
          p_end_date: string
        }
        Returns: boolean
      }
      get_favorite_meals: {
        Args: Record<PropertyKey, never>
        Returns: {
          recipe_id: string
          recipe_name: string
          recipe_type: string
          instructions: string[]
          ingredients: Json
          nutrition: Json
          image: string
          favorited_at: string
        }[]
      }
      get_meal_plan_days: {
        Args: {
          p_meal_plan_id: string
        }
        Returns: {
          id: string
          date: string
          day_of_week: string
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fats: number
          meals: Json
        }[]
      }
      get_user_favorite_meals: {
        Args: {
          p_user_id: string
        }
        Returns: {
          recipe_id: string
          recipe_name: string
          recipe_type: string
          instructions: string[]
          ingredients: string[]
          nutrition: Json
          image: string
          favorited_at: string
        }[]
      }
      handle_meal_interaction: {
        Args: {
          p_name: string
          p_type: string
          p_instructions: string[]
          p_ingredients: string[]
          p_calories: number
          p_protein: number
          p_carbs: number
          p_fats: number
          p_image: string
          p_is_favorite?: boolean
        }
        Returns: Json
      }
      save_meal_plan_days: {
        Args: {
          p_meal_plan_id: string
          p_days: Json
        }
        Returns: boolean
      }
      toggle_favorite_meal: {
        Args: {
          p_recipe_id: string
        }
        Returns: boolean
      }
      update_meal_day: {
        Args: {
          p_meal_day_id: string
          p_meals: Json
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

