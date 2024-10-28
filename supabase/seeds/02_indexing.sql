
-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_meal_days_meal_plan_id ON meal_days(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_day_meals_meal_day_id ON meal_day_meals(meal_day_id);
CREATE INDEX IF NOT EXISTS idx_meal_day_meals_meal_id ON meal_day_meals(meal_id);
CREATE INDEX IF NOT EXISTS idx_user_favorite_meals_user_id ON user_favorite_meals(user_id);
