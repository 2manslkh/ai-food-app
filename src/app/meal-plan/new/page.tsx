"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { WeeklyMealPlanner } from "@/components/WeeklyMealPlanner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MealPlanEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  return (
    <div className="container mx-auto px-4 pb-8 pt-2">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Meal Plans
      </Button>
      <WeeklyMealPlanner existingPlanId={planId} />
    </div>
  );
};

export default MealPlanEditPage;
