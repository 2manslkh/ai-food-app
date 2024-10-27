"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { PieChart, Pie, ResponsiveContainer, Legend } from "recharts";

const dataPie = [
  { name: "Protein", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Carbs", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Fats", value: 300, fill: "hsl(var(--chart-3))" },
];

const chartConfig = {
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-1))",
  },
  carbs: {
    label: "Carbs",
    color: "hsl(var(--chart-2))",
  },
  fats: {
    label: "Fats",
    color: "hsl(var(--chart-3))",
  },
};

const PieChartPage: React.FC = () => {
  console.log("🚀 | dataPie:", dataPie);

  return (
    <Card className="w-full max-h-[300px]">
      <CardHeader>
        <CardTitle>Nutrition Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="w-[300px] h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              label
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartPage;
