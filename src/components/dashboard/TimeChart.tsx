
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, eachDayOfInterval, isSameDay } from "date-fns";

interface TimeChartProps {
  trackingId?: string;
  dateRange?: DateRange;
}

export function TimeChart({ trackingId, dateRange }: TimeChartProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['time-chart', trackingId, dateRange],
    queryFn: async () => {
      if (!trackingId) return [];
      
      const from = dateRange?.from ? new Date(dateRange.from) : new Date(new Date().setDate(new Date().getDate() - 7));
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      
      // Set the time to cover the full day
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from("page_views")
        .select("*")
        .eq("tracking_id", trackingId)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());
      
      if (error) {
        console.error("Error fetching time chart data:", error);
        throw error;
      }
      
      // Generate all days in the date range
      const days = eachDayOfInterval({ start: from, end: to });
      
      // Create an object to hold data for each day
      const chartData = days.map(day => {
        const dayFormatted = format(day, "MMM d");
        
        // Count page views for this day
        const pageViews = data ? data.filter(item => {
          const itemDate = new Date(item.created_at as string);
          return isSameDay(itemDate, day);
        }).length : 0;
        
        // Count unique visitors for this day
        const visitors = new Set(
          data ? data.filter(item => {
            const itemDate = new Date(item.created_at as string);
            return isSameDay(itemDate, day);
          }).map(item => item.visitor_id) : []
        ).size;
        
        return {
          date: dayFormatted,
          visitors,
          pageviews: pageViews
        };
      });
      
      return chartData;
    },
    enabled: !!trackingId,
  });
  
  const chartData = data || [];

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

  if (error) {
    console.error("TimeChart error:", error);
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Traffic Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-red-500">
            Error loading chart data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available for the selected period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
