"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Label } from "recharts";
import { Flame } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface ComponentProps {
  data: ChartData[];
  calories: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
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

const renderCenterLabel = ({ viewBox: { cx, cy }, calories }: any) => {
  return (
    <g>
      <foreignObject x={cx - 12} y={cy - 32} width={24} height={24}>
        <Flame className="text-primary" size={24} />
      </foreignObject>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-lg font-bold"
      >
        {calories}
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-muted-foreground text-xs"
      >
        kcal/day
      </text>
    </g>
  );
};

export function PieChartComponent({ data, calories }: ComponentProps) {
  return (
    <Card className="max-h-[300px] w-full">
      <CardHeader className="pb-0">
        <CardTitle>Daily Nutrition Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[300px] w-full items-center justify-center">
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
              <Label
                content={({ viewBox }) => {
                  // Cast viewBox to any to access cx/cy properties
                  const view = viewBox as any;
                  if (view && typeof view.cx !== "undefined" && typeof view.cy !== "undefined") {
                    return (
                      <>
                        <text x={view.cx} y={view.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={view.cx}
                            y={view.cy - 4}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {calories}
                          </tspan>
                          <tspan
                            x={view.cx}
                            y={view.cy + 16}
                            className="fill-muted-foreground text-sm"
                          >
                            kcal/day
                          </tspan>
                        </text>
                      </>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
            {/* {renderCenterLabel({ viewBox: { cx: "50%", cy: "50%" }, calories })} */}
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
