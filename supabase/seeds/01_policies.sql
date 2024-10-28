
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
