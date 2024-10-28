-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT,
    instructions TEXT[],
    ingredients TEXT[],  -- Added this line
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    image TEXT,
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
