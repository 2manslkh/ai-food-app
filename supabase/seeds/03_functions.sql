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
    v_current_date DATE;
    v_day_of_week TEXT;
BEGIN
    INSERT INTO meal_plans (user_id, name, start_date, end_date)
    VALUES (p_user_id, p_name, p_start_date, p_end_date)
    RETURNING id INTO v_meal_plan_id;

    -- Create meal_days for each day in the meal plan
    v_current_date := p_start_date;
    WHILE v_current_date <= p_end_date LOOP
        -- Get day of week name
        v_day_of_week := CASE EXTRACT(DOW FROM v_current_date)
            WHEN 1 THEN 'Monday'
            WHEN 2 THEN 'Tuesday'
            WHEN 3 THEN 'Wednesday'
            WHEN 4 THEN 'Thursday'
            WHEN 5 THEN 'Friday'
            WHEN 6 THEN 'Saturday'
            WHEN 0 THEN 'Sunday'
        END;

        INSERT INTO meal_days (meal_plan_id, date, day_of_week)
        VALUES (v_meal_plan_id, v_current_date, v_day_of_week);

        v_current_date := v_current_date + INTERVAL '1 day';
    END LOOP;

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
    ingredients TEXT[],
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

-- Function to create or get a meal
CREATE OR REPLACE FUNCTION create_or_get_meal(
    p_name TEXT,
    p_type TEXT,
    p_instructions TEXT[],
    p_ingredients TEXT[],
    p_calories INTEGER,
    p_protein NUMERIC,
    p_carbs NUMERIC,
    p_fats NUMERIC,
    p_image TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_recipe_id UUID;
    v_meal_id UUID;
BEGIN
    -- First try to find existing recipe
    SELECT id INTO v_recipe_id
    FROM recipes
    WHERE name = p_name
    AND type = p_type
    LIMIT 1;

    -- If recipe doesn't exist, create it
    IF v_recipe_id IS NULL THEN
        INSERT INTO recipes (name, type, instructions, ingredients, image)
        VALUES (p_name, p_type, p_instructions, p_ingredients, p_image)
        RETURNING id INTO v_recipe_id;

        -- Create nutrition info for the recipe
        INSERT INTO nutrition_info (recipe_id, calories, protein, carbs, fats)
        VALUES (v_recipe_id, p_calories, p_protein, p_carbs, p_fats);
    END IF;

    -- Create a new meal entry
    INSERT INTO meals (recipe_id, meal_type, serving_size, calories, protein, carbs, fats)
    VALUES (
        v_recipe_id,
        p_type,
        1,  -- default serving size
        p_calories,
        p_protein,
        p_carbs,
        p_fats
    )
    RETURNING id INTO v_meal_id;

    RETURN v_meal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle meal interaction (like/dislike)
CREATE OR REPLACE FUNCTION handle_meal_interaction(
    p_name TEXT,
    p_type TEXT,
    p_instructions TEXT[],
    p_ingredients TEXT[],
    p_calories INTEGER,
    p_protein NUMERIC,
    p_carbs NUMERIC,
    p_fats NUMERIC,
    p_image TEXT,
    p_is_favorite BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
    v_recipe_id UUID;
BEGIN
    -- First try to find existing recipe
    SELECT id INTO v_recipe_id
    FROM recipes
    WHERE name = p_name
    AND type = p_type
    LIMIT 1;

    -- If recipe doesn't exist, create it
    IF v_recipe_id IS NULL THEN
        INSERT INTO recipes (name, type, instructions, ingredients, image)
        VALUES (p_name, p_type, p_instructions, p_ingredients, p_image)
        RETURNING id INTO v_recipe_id;

        -- Create nutrition info for the recipe
        INSERT INTO nutrition_info (recipe_id, calories, protein, carbs, fats)
        VALUES (v_recipe_id, p_calories, p_protein, p_carbs, p_fats);
    END IF;

    -- If it's a favorite, add to user's favorites
    IF p_is_favorite THEN
        INSERT INTO user_favorite_meals (user_id, recipe_id)
        VALUES (auth.uid(), v_recipe_id)
        ON CONFLICT (user_id, recipe_id) DO NOTHING;
    END IF;

    RETURN jsonb_build_object(
        'recipe_id', v_recipe_id,
        'is_favorite', p_is_favorite
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function to get favorite meals for a specific user
CREATE OR REPLACE FUNCTION get_user_favorite_meals(p_user_id UUID)
RETURNS TABLE (
    recipe_id UUID,
    recipe_name TEXT,
    recipe_type TEXT,
    instructions TEXT[],
    ingredients TEXT[],
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
    WHERE ufm.user_id = p_user_id
    ORDER BY ufm.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to save meal plan days
CREATE OR REPLACE FUNCTION save_meal_plan_days(
    p_meal_plan_id UUID,
    p_days JSONB
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_day RECORD;
    v_meal RECORD;
    v_meal_day_id UUID;
    v_recipe_id UUID;
BEGIN
    -- Check if the meal plan belongs to the current user
    SELECT user_id INTO v_user_id
    FROM meal_plans
    WHERE id = p_meal_plan_id;

    IF v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'You do not have permission to modify this meal plan';
    END IF;

    -- Delete existing meal days and their meals
    DELETE FROM meal_day_meals
    WHERE meal_day_id IN (SELECT id FROM meal_days WHERE meal_plan_id = p_meal_plan_id);
    
    DELETE FROM meal_days
    WHERE meal_plan_id = p_meal_plan_id;

    -- Iterate through each day in the plan
    FOR v_day IN SELECT * FROM jsonb_each(p_days)
    LOOP
        -- Create meal day
        INSERT INTO meal_days (meal_plan_id, date, day_of_week)
        VALUES (
            p_meal_plan_id,
            (SELECT start_date + (array_position(ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], v_day.key) - 1) * INTERVAL '1 day'
            FROM meal_plans WHERE id = p_meal_plan_id),
            v_day.key
        )
        RETURNING id INTO v_meal_day_id;

        -- Process meals for this day
        FOR v_meal IN SELECT * FROM jsonb_array_elements(v_day.value)
        LOOP
            -- Create or get recipe
            SELECT create_or_get_meal(
                (v_meal.value->>'name')::TEXT,
                COALESCE((v_meal.value->>'type')::TEXT, 'main'),
                COALESCE((v_meal.value->'recipe'->>'instructions')::TEXT[], ARRAY[]::TEXT[]),
                COALESCE((v_meal.value->'recipe'->>'ingredients')::TEXT[], ARRAY[]::TEXT[]),
                COALESCE((v_meal.value->'nutrition'->>'calories')::INTEGER, 0),
                COALESCE((v_meal.value->'nutrition'->>'protein')::NUMERIC, 0),
                COALESCE((v_meal.value->'nutrition'->>'carbs')::NUMERIC, 0),
                COALESCE((v_meal.value->'nutrition'->>'fats')::NUMERIC, 0),
                (v_meal.value->>'image')::TEXT
            ) INTO v_recipe_id;

            -- Add meal to meal day
            PERFORM add_meal_to_meal_day(
                v_meal_day_id,
                v_recipe_id,
                COALESCE((v_meal.value->>'type')::TEXT, 'main'),
                COALESCE((v_meal.value->>'serving_size')::NUMERIC, 1)
            );
        END LOOP;
    END LOOP;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add multiple meals to a meal day
CREATE OR REPLACE FUNCTION add_meals_to_meal_day(
    p_meal_day_id UUID,
    p_meals JSONB
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_meal RECORD;
    v_recipe_id UUID;
BEGIN
    -- Check if the meal day belongs to the current user's meal plan
    SELECT mp.user_id INTO v_user_id
    FROM meal_days md
    JOIN meal_plans mp ON md.meal_plan_id = mp.id
    WHERE md.id = p_meal_day_id;

    IF v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'You do not have permission to add meals to this meal day';
    END IF;

    -- Process each meal
    FOR v_meal IN SELECT * FROM jsonb_array_elements(p_meals)
    LOOP
        -- Create or get recipe
        SELECT create_or_get_meal(
            (v_meal.value->>'name')::TEXT,
            COALESCE((v_meal.value->>'type')::TEXT, 'main'),
            COALESCE((v_meal.value->'recipe'->>'instructions')::TEXT[], ARRAY[]::TEXT[]),
            COALESCE((v_meal.value->'recipe'->>'ingredients')::TEXT[], ARRAY[]::TEXT[]),
            COALESCE((v_meal.value->'nutrition'->>'calories')::INTEGER, 0),
            COALESCE((v_meal.value->'nutrition'->>'protein')::NUMERIC, 0),
            COALESCE((v_meal.value->'nutrition'->>'carbs')::NUMERIC, 0),
            COALESCE((v_meal.value->'nutrition'->>'fats')::NUMERIC, 0),
            (v_meal.value->>'image')::TEXT
        ) INTO v_recipe_id;

        -- Add meal to meal day
        PERFORM add_meal_to_meal_day(
            p_meal_day_id,
            v_recipe_id,
            COALESCE((v_meal.value->>'type')::TEXT, 'main'),
            COALESCE((v_meal.value->>'serving_size')::NUMERIC, 1)
        );
    END LOOP;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get meal days for a meal plan
CREATE OR REPLACE FUNCTION get_meal_plan_days(
    p_meal_plan_id UUID
) RETURNS TABLE (
    id UUID,
    date DATE,
    day_of_week TEXT,
    total_calories INTEGER,
    total_protein NUMERIC,
    total_carbs NUMERIC,
    total_fats NUMERIC,
    meals JSONB
) AS $$
BEGIN
    -- Check if the meal plan belongs to the current user
    IF NOT EXISTS (
        SELECT 1 FROM meal_plans mp
        WHERE mp.id = p_meal_plan_id 
        AND mp.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'You do not have permission to view this meal plan';
    END IF;

    RETURN QUERY
    SELECT 
        md.id,
        md.date,
        md.day_of_week,
        md.total_calories,
        md.total_protein,
        md.total_carbs,
        md.total_fats,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', m.id,
                    'name', r.name,
                    'type', r.type,
                    'mealDayId', md.id,  -- Add mealDayId here
                    'nutrition', (
                        SELECT jsonb_build_object(
                            'calories', n.calories,
                            'protein', n.protein,
                            'carbs', n.carbs,
                            'fats', n.fats
                        )
                        FROM nutrition_info n
                        WHERE n.recipe_id = r.id
                    ),
                    'image', r.image,
                    'recipe', jsonb_build_object(
                        'instructions', r.instructions,
                        'ingredients', r.ingredients
                    )
                )
            )
            FROM meal_day_meals mdm
            JOIN meals m ON mdm.meal_id = m.id
            JOIN recipes r ON m.recipe_id = r.id
            WHERE mdm.meal_day_id = md.id
        ) as meals
    FROM meal_days md
    WHERE md.meal_plan_id = p_meal_plan_id
    ORDER BY md.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update meals in a meal day
CREATE OR REPLACE FUNCTION update_meal_day(
    p_meal_day_id UUID,
    p_meals JSONB
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_meal RECORD;
    v_recipe_id UUID;
    v_meal_id UUID;
BEGIN
    -- Check if the meal day belongs to the current user's meal plan
    SELECT mp.user_id INTO v_user_id
    FROM meal_days md
    JOIN meal_plans mp ON md.meal_plan_id = mp.id
    WHERE md.id = p_meal_day_id;

    IF v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'You do not have permission to modify this meal day';
    END IF;

    -- Delete existing meals for this day
    DELETE FROM meal_day_meals
    WHERE meal_day_id = p_meal_day_id;

    -- Reset nutrition totals
    UPDATE meal_days
    SET total_calories = 0,
        total_protein = 0,
        total_carbs = 0,
        total_fats = 0
    WHERE id = p_meal_day_id;

    -- Process each meal
    FOR v_meal IN SELECT * FROM jsonb_array_elements(p_meals)
    LOOP
        -- Create a new meal entry
        SELECT create_or_get_meal(
            (v_meal.value->>'name')::TEXT,
            COALESCE((v_meal.value->>'type')::TEXT, 'main'),
            ARRAY(SELECT jsonb_array_elements_text(v_meal.value->'recipe'->'instructions')),
            ARRAY(SELECT jsonb_array_elements_text(v_meal.value->'recipe'->'ingredients')),
            COALESCE((v_meal.value->'nutrition'->>'calories')::INTEGER, 0),
            COALESCE((v_meal.value->'nutrition'->>'protein')::NUMERIC, 0),
            COALESCE((v_meal.value->'nutrition'->>'carbs')::NUMERIC, 0),
            COALESCE((v_meal.value->'nutrition'->>'fats')::NUMERIC, 0),
            (v_meal.value->>'image')::TEXT
        ) INTO v_meal_id;

        -- Link the meal to the meal day
        INSERT INTO meal_day_meals (meal_day_id, meal_id)
        VALUES (p_meal_day_id, v_meal_id);
    END LOOP;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get meal plans for the current user
CREATE OR REPLACE FUNCTION get_meal_plans()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name TEXT,
    start_date DATE,
    end_date DATE,
    total_days INTEGER,
    total_meals INTEGER,
    total_calories INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.id,
        mp.user_id,
        mp.name,
        mp.start_date,
        mp.end_date,
        COUNT(DISTINCT md.id)::INTEGER as total_days,
        COUNT(mdm.id)::INTEGER as total_meals,
        COALESCE(SUM(md.total_calories), 0)::INTEGER as total_calories,
        mp.created_at
    FROM meal_plans mp
    LEFT JOIN meal_days md ON mp.id = md.meal_plan_id
    LEFT JOIN meal_day_meals mdm ON md.id = mdm.meal_day_id
    WHERE mp.user_id = auth.uid()
    GROUP BY mp.id, mp.user_id, mp.name, mp.start_date, mp.end_date, mp.created_at
    ORDER BY mp.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_meal_plan(UUID, TEXT, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION edit_meal_plan(UUID, TEXT, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_meal_plan(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION add_meal_to_meal_day(UUID, UUID, TEXT, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION add_meal_day_to_meal_plan(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_favorite_meal(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_or_get_meal(TEXT, TEXT, TEXT[], TEXT[], INTEGER, NUMERIC, NUMERIC, NUMERIC, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_meal_interaction(TEXT, TEXT, TEXT[], TEXT[], INTEGER, NUMERIC, NUMERIC, NUMERIC, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_favorite_meals(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION save_meal_plan_days(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION add_meals_to_meal_day(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_meal_plan_days(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_meal_day(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_meal_plans() TO authenticated;
