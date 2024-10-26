"use client";

import React from "react";
import { useSupabase } from "@/components/SupabaseProvider";
import { SupabaseLogin } from "@/components/SupabaseLogin";
import { MealSchedule } from "@/components/MealSchedule";

export default function Home() {
  const { user } = useSupabase();

  return (
    <div className="flex flex-col items-start justify-start min-h-screen py-2">
      {user ? (
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-4">
            Welcome,{" "}
            {user?.user_metadata.full_name?.split(" ")[0] ||
              user?.email?.split("@")[0] ||
              "Guest"}
          </h1>
          <MealSchedule />
        </div>
      ) : (
        <div className="w-full max-w-md">
          <SupabaseLogin />
        </div>
      )}
    </div>
  );
}
