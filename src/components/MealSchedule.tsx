"use client";

import React, { useState, useEffect } from "react";
import { useSupabase } from "./SupabaseProvider";
import { AIChat } from "./AIChat";
import { fetchMeals, Meal } from "@/lib/api";

export function MealSchedule() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabase();

  useEffect(() => {
    async function loadMeals() {
      try {
        const data = await fetchMeals();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMeals();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (meals.length === 0) {
    return (
      <div>
        <AIChat />
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-4">
        {meals.map((meal) => (
          <li key={meal.id} className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold">{meal.name}</h3>
            <p>
              {new Date(meal.date).toLocaleDateString()} - {meal.type}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
