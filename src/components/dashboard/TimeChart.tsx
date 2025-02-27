
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DateRange } from "react-day-picker";

interface TimeChartProps {
  dateRange?: DateRange;
}

export function TimeChart({ dateRange }: TimeChartProps) {
  // This would typically fetch from an API based on dateRange
  const data = [
    { date: "Jan 1", visitors: 4000, pageviews: 5400 },
    { date: "Jan 2", visitors: 3000, pageviews: 4200 },
    { date: "Jan 3", visitors: 2000, pageviews: 3800 },
    { date: "Jan 4", visitors: 2780, pageviews: 5200 },
    { date: "Jan 5", visitors: 1890, pageviews: 4800 },
    { date: "Jan 6", visitors: 2390, pageviews: 5100 },
    { date: "Jan 7", visitors: 3490, pageviews: 6300 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-morphism p-3 rounded-md">
          <p className="text-sm font-medium mb-1">{label}</p>
          <div className="space-y-1">
            <p className="text-xs flex items-center">
              <span className="w-2 h-2 inline-block mr-2 rounded-full" style={{ backgroundColor: "#1d4ed8" }}></span>
              Visitors: {payload[0].value.toLocaleString()}
            </p>
            <p className="text-xs flex items-center">
              <span className="w-2 h-2 inline-block mr-2 rounded-full" style={{ backgroundColor: "#10b981" }}></span>
              Page Views: {payload[1].value.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="date" 
                stroke="#888"
                fontSize={12}
              />
              <YAxis 
                stroke="#888"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#1d4ed8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="pageviews"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
