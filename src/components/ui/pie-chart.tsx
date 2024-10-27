"use client";

import * as React from "react";
import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface ComponentProps {
  data: ChartData[];
}

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

export function Component({ data }: ComponentProps) {
  const total = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-[300px] h-[300px]">
          <PieChart>
            <ChartTooltip
              content={({ payload }) => {
                if (payload && payload[0]) {
                  return (
                    <ChartTooltipContent
                      label={`${payload[0].name}: ${payload[0].value}g`}
                    />
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              width={300}
              height={300}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
