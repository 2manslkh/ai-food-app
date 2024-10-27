"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from "recharts";

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface ComponentProps {
  data: ChartData[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "12px", fontWeight: "bold" }}
    >
      {`${value}g`}
    </text>
  );
};

export function PieChartComponent({ data }: ComponentProps) {
  return (
    <Card className="w-full max-h-[300px]">
      <CardHeader className="pb-0">
        <CardTitle>Daily Nutrition Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="w-full h-[300px] flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={0}
              strokeWidth={0}
              startAngle={90}
              endAngle={450}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                paddingLeft: "20px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
