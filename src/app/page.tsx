"use client";

import React from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { SupabaseLogin } from "@/components/SupabaseLogin";
import { MealSchedule } from "@/components/MealSchedule";

export default function Home() {
  const { user } = useSupabase();

  return (
    <div className="flex flex-col items-center justify-center py-2">
      {user ? (
        <MealSchedule />
      ) : (
        <div className="w-full max-w-md">
          <SupabaseLogin />
        </div>
      )}
    </div>
  );
}
