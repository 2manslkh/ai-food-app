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

-- User favorite meals table
CREATE TABLE IF NOT EXISTS user_favorite_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    recipe_id UUID REFERENCES recipes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, recipe_id)
);