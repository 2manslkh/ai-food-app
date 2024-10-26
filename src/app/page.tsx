import React from "react";
import { SupabaseLogin } from "@/components/SupabaseLogin";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to AI Meal Planner</h1>
      <div className="w-full max-w-md mb-8">
        <SupabaseLogin />
      </div>
    </div>
  );
}
