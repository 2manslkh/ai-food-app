-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    dietary_restrictions TEXT[],
    allergies TEXT[],
    disliked_ingredients TEXT[],
    cuisine_preferences TEXT[],
    breakfast_time TIME,
    lunch_time TIME,
    dinner_time TIME,
    snacks BOOLEAN,
    meals_per_day INTEGER
);

-- Health data table
CREATE TABLE IF NOT EXISTS health_data (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    age INTEGER,
    height NUMERIC,
    weight NUMERIC,
    activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active')),
    health_goals TEXT[],
    target_calories INTEGER,
    target_protein NUMERIC,
    target_carbs NUMERIC,
    target_fats NUMERIC
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    instructions TEXT[],
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    tags TEXT[]
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT
);

-- Recipe ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id UUID REFERENCES recipes(id),
    ingredient_id UUID REFERENCES ingredients(id),
    amount NUMERIC,
    unit TEXT,
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- Nutrition info table
CREATE TABLE IF NOT EXISTS nutrition_info (
    recipe_id UUID PRIMARY KEY REFERENCES recipes(id),
    calories INTEGER,
    protein NUMERIC,
    carbs NUMERIC,
    fats NUMERIC,
    fiber NUMERIC,
    sugar NUMERIC
);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    start_date DATE,
    end_date DATE,
    name TEXT NOT NULL DEFAULT 'Untitled Meal Plan'
);

-- Meal days table
CREATE TABLE IF NOT EXISTS meal_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_plan_id UUID REFERENCES meal_plans(id),
    date DATE,
    total_calories INTEGER DEFAULT 0,
    total_protein NUMERIC DEFAULT 0,
    total_carbs NUMERIC DEFAULT 0,
    total_fats NUMERIC DEFAULT 0
);

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES recipes(id),
    meal_type TEXT,
    serving_size NUMERIC,
    calories INTEGER,
    protein NUMERIC,
    carbs NUMERIC,
    fats NUMERIC
);

-- New table to link meals to meal days
CREATE TABLE IF NOT EXISTS meal_day_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_day_id UUID REFERENCES meal_days(id),
    meal_id UUID REFERENCES meals(id),
    UNIQUE(meal_day_id, meal_id)
);

-- Shopping lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_plan_id UUID REFERENCES meal_plans(id)
);

-- Shopping items table
CREATE TABLE IF NOT EXISTS shopping_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_list_id UUID REFERENCES shopping_lists(id),
    ingredient_id UUID REFERENCES ingredients(id),
    total_amount NUMERIC,
    unit TEXT
);

-- User favorite meals table
CREATE TABLE IF NOT EXISTS user_favorite_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    recipe_id UUID REFERENCES recipes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security for all tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_day_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_meals ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY user_preferences_policy ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY health_data_policy ON health_data FOR ALL USING (auth.uid() = user_id);
CREATE POLICY meal_plans_policy ON meal_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY meal_days_policy ON meal_days FOR ALL USING (meal_plan_id IN (SELECT id FROM meal_plans WHERE user_id = auth.uid()));
CREATE POLICY meals_policy ON meals FOR ALL USING (true);
CREATE POLICY shopping_lists_policy ON shopping_lists FOR ALL USING (meal_plan_id IN (SELECT id FROM meal_plans WHERE user_id = auth.uid()));
CREATE POLICY shopping_items_policy ON shopping_items FOR ALL USING (shopping_list_id IN (SELECT sl.id FROM shopping_lists sl JOIN meal_plans mp ON sl.meal_plan_id = mp.id WHERE mp.user_id = auth.uid()));
CREATE POLICY meal_day_meals_policy ON meal_day_meals FOR ALL USING (meal_day_id IN (SELECT md.id FROM meal_days md JOIN meal_plans mp ON md.meal_plan_id = mp.id WHERE mp.user_id = auth.uid()));
CREATE POLICY user_favorite_meals_policy ON user_favorite_meals 
    FOR ALL USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Revoke permissions from public
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_meal_days_meal_plan_id ON meal_days(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_day_meals_meal_day_id ON meal_day_meals(meal_day_id);
CREATE INDEX IF NOT EXISTS idx_meal_day_meals_meal_id ON meal_day_meals(meal_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_meals_user_id ON user_favorite_meals(user_id);

-- Create a function to update meal_day totals
CREATE OR REPLACE FUNCTION update_meal_day_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE meal_days md
        SET total_calories = md.total_calories + m.calories,
            total_protein = md.total_protein + m.protein,
            total_carbs = md.total_carbs + m.carbs,
            total_fats = md.total_fats + m.fats
        FROM meals m
        WHERE md.id = NEW.meal_day_id AND m.id = NEW.meal_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE meal_days md
        SET total_calories = md.total_calories - m.calories,
            total_protein = md.total_protein - m.protein,
            total_carbs = md.total_carbs - m.carbs,
            total_fats = md.total_fats - m.fats
        FROM meals m
        WHERE md.id = OLD.meal_day_id AND m.id = OLD.meal_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update meal_day totals
DROP TRIGGER IF EXISTS update_meal_day_totals_trigger ON meal_day_meals;
CREATE TRIGGER update_meal_day_totals_trigger
AFTER INSERT OR DELETE ON meal_day_meals
FOR EACH ROW EXECUTE FUNCTION update_meal_day_totals();

-- Function to create a new meal plan
CREATE OR REPLACE FUNCTION create_meal_plan(
    p_user_id UUID,
    p_name TEXT,
    p_start_date DATE,
    p_end_date DATE
) RETURNS UUID AS $$
DECLARE
    v_meal_plan_id UUID;
BEGIN
    INSERT INTO meal_plans (user_id, name, start_date, end_date)
    VALUES (p_user_id, p_name, p_start_date, p_end_date)
    RETURNING id INTO v_meal_plan_id;

    -- Create meal_days for each day in the meal plan
    INSERT INTO meal_days (meal_plan_id, date)
    SELECT v_meal_plan_id, generate_series(p_start_date, p_end_date, '1 day'::interval)::date;

    RETURN v_meal_plan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to edit an existing meal plan
CREATE OR REPLACE FUNCTION edit_meal_plan(
    p_meal_plan_id UUID,
    p_name TEXT,
    p_start_date DATE,
    p_end_date DATE
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Check if the meal plan belongs to the current user
    SELECT user_id INTO v_user_id
    FROM meal_plans
    WHERE id = p_meal_plan_id;

    IF v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'You do not have permission to edit this meal plan';
    END IF;

    -- Update the meal plan
    UPDATE meal_plans
    SET name = p_name,
        start_date = p_start_date,
        end_date = p_end_date
    WHERE id = p_meal_plan_id;

    -- Delete meal_days that are no longer in the date range
    DELETE FROM meal_days
    WHERE meal_plan_id = p_meal_plan_id
    AND date NOT BETWEEN p_start_date AND p_end_date;

    -- Add new meal_days for any new dates in the range
    INSERT INTO meal_days (meal_plan_id, date)
    SELECT p_meal_plan_id, generate_series(p_start_date, p_end_date, '1 day'::interval)::date
    ON CONFLICT (meal_plan_id, date) DO NOTHING;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete an existing meal plan
CREATE OR REPLACE FUNCTION delete_meal_plan(
    p_meal_plan_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Check if the meal plan belongs to the current user
    SELECT user_id INTO v_user_id
    FROM meal_plans
    WHERE id = p_meal_plan_id;

    IF v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'You do not have permission to delete this meal plan';
    END IF;

    -- Delete associated meal_days and meal_day_meals
    DELETE FROM meal_day_meals
    WHERE meal_day_id IN (SELECT id FROM meal_days WHERE meal_plan_id = p_meal_plan_id);

    DELETE FROM meal_days
    WHERE meal_plan_id = p_meal_plan_id;

    -- Delete the meal plan
    DELETE FROM meal_plans
    WHERE id = p_meal_plan_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a meal to a meal day
CREATE OR REPLACE FUNCTION add_meal_to_meal_day(
    p_meal_day_id UUID,
    p_recipe_id UUID,
    p_meal_type TEXT,
    p_serving_size NUMERIC
) RETURNS UUID AS $$
DECLARE
    v_meal_id UUID;
    v_user_id UUID;
    v_calories INTEGER;
    v_protein NUMERIC;
    v_carbs NUMERIC;
    v_fats NUMERIC;
BEGIN
    -- Check if the meal day belongs to the current user's meal plan
    SELECT mp.user_id INTO v_user_id
    FROM meal_days md
    JOIN meal_plans mp ON md.meal_plan_id = mp.id
    WHERE md.id = p_meal_day_id;

    IF v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'You do not have permission to add meals to this meal day';
    END IF;

    -- Get nutritional info for the recipe
    SELECT calories, protein, carbs, fats
    INTO v_calories, v_protein, v_carbs, v_fats
    FROM nutrition_info
    WHERE recipe_id = p_recipe_id;

    -- Insert or update the meal
    INSERT INTO meals (recipe_id, meal_type, serving_size, calories, protein, carbs, fats)
    VALUES (p_recipe_id, p_meal_type, p_serving_size, 
            v_calories * p_serving_size, 
            v_protein * p_serving_size, 
            v_carbs * p_serving_size, 
            v_fats * p_serving_size)
    ON CONFLICT (recipe_id, meal_type, serving_size) 
    DO UPDATE SET 
        calories = EXCLUDED.calories,
        protein = EXCLUDED.protein,
        carbs = EXCLUDED.carbs,
        fats = EXCLUDED.fats
    RETURNING id INTO v_meal_id;

    -- Link the meal to the meal day
    INSERT INTO meal_day_meals (meal_day_id, meal_id)
    VALUES (p_meal_day_id, v_meal_id)
    ON CONFLICT (meal_day_id, meal_id) DO NOTHING;

    RETURN v_meal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a meal day to a meal plan
CREATE OR REPLACE FUNCTION add_meal_day_to_meal_plan(
    p_meal_plan_id UUID,
    p_date DATE
) RETURNS UUID AS $$
DECLARE
    v_meal_day_id UUID;
    v_user_id UUID;
BEGIN
    -- Check if the meal plan belongs to the current user
    SELECT user_id INTO v_user_id
    FROM meal_plans
    WHERE id = p_meal_plan_id;

    IF v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'You do not have permission to add meal days to this meal plan';
    END IF;

    -- Check if the date is within the meal plan's date range
    IF p_date < (SELECT start_date FROM meal_plans WHERE id = p_meal_plan_id) OR
       p_date > (SELECT end_date FROM meal_plans WHERE id = p_meal_plan_id) THEN
        RAISE EXCEPTION 'The date is outside the meal plan''s date range';
    END IF;

    -- Insert the new meal day
    INSERT INTO meal_days (meal_plan_id, date)
    VALUES (p_meal_plan_id, p_date)
    ON CONFLICT (meal_plan_id, date) DO UPDATE SET
        total_calories = 0,
        total_protein = 0,
        total_carbs = 0,
        total_fats = 0
    RETURNING id INTO v_meal_day_id;

    RETURN v_meal_day_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle favorite meal
CREATE OR REPLACE FUNCTION toggle_favorite_meal(
    p_recipe_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Check if the meal is already favorited
    SELECT EXISTS (
        SELECT 1 
        FROM user_favorite_meals 
        WHERE user_id = auth.uid() 
        AND recipe_id = p_recipe_id
    ) INTO v_exists;

    IF v_exists THEN
        -- Remove from favorites
        DELETE FROM user_favorite_meals 
        WHERE user_id = auth.uid() 
        AND recipe_id = p_recipe_id;
        RETURN FALSE;
    ELSE
        -- Add to favorites
        INSERT INTO user_favorite_meals (user_id, recipe_id)
        VALUES (auth.uid(), p_recipe_id);
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's favorite meals
CREATE OR REPLACE FUNCTION get_favorite_meals()
RETURNS TABLE (
    recipe_id UUID,
    recipe_name TEXT,
    recipe_type TEXT,
    instructions TEXT[],
    ingredients JSONB,
    nutrition JSONB,
    image TEXT,
    favorited_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id as recipe_id,
        r.name as recipe_name,
        r.type as recipe_type,
        r.instructions,
        r.ingredients,
        (
            SELECT jsonb_build_object(
                'calories', n.calories,
                'protein', n.protein,
                'carbs', n.carbs,
                'fats', n.fats
            )
            FROM nutrition_info n
            WHERE n.recipe_id = r.id
        ) as nutrition,
        r.image,
        ufm.created_at as favorited_at
    FROM user_favorite_meals ufm
    JOIN recipes r ON ufm.recipe_id = r.id
    WHERE ufm.user_id = auth.uid()
    ORDER BY ufm.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_meal_plan(UUID, TEXT, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION edit_meal_plan(UUID, TEXT, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_meal_plan(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION add_meal_to_meal_day(UUID, UUID, TEXT, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION add_meal_day_to_meal_plan(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_favorite_meal(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_favorite_meals() TO authenticated;
