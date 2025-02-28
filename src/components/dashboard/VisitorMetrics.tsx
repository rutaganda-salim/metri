
import React from "react";
import { MetricsCard } from "../ui/metrics-card";
import { Users, Eye, Clock, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

interface VisitorMetricsProps {
  trackingId: string;
  dateRange: DateRange | undefined;
}

interface MetricsData {
  totalVisitors: number;
  pageViews: number;
  avgSession: string;
  bounceRate: string;
  trends: {
    visitors: {
      value: number;
      isPositive: boolean;
    };
    pageViews: {
      value: number;
      isPositive: boolean;
    };
    avgSession: {
      value: number;
      isPositive: boolean;
    };
    bounceRate: {
      value: number;
      isPositive: boolean;
    };
  };
}

interface MetricItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function VisitorMetrics({ trackingId, dateRange }: VisitorMetricsProps) {
  const { data: metricsData, isLoading, error } = useQuery<MetricsData | null>({
    queryKey: ['visitor-metrics', trackingId, dateRange],
    queryFn: async () => {
      if (!trackingId) return null;
      
      const from = dateRange?.from ? new Date(dateRange.from) : new Date(new Date().setDate(new Date().getDate() - 7));
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      
      // Set the time to cover the full day
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      
      // Current period
      const { data: currentPeriodData, error: currentError } = await supabase
        .from("page_views")
        .select("*")
        .eq("tracking_id", trackingId)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());
      
      if (currentError) {
        console.error("Error fetching current period data:", currentError);
        throw currentError;
      }
      
      // Previous period (same duration)
      const durationMs = to.getTime() - from.getTime();
      const prevFrom = new Date(from.getTime() - durationMs);
      const prevTo = new Date(to.getTime() - durationMs);
      
      const { data: prevPeriodData, error: prevError } = await supabase
        .from("page_views")
        .select("*")
        .eq("tracking_id", trackingId)
        .gte("created_at", prevFrom.toISOString())
        .lte("created_at", prevTo.toISOString());
      
      if (prevError) {
        console.error("Error fetching previous period data:", prevError);
        throw prevError;
      }
      
      // Calculate metrics
      const currentPageViews = currentPeriodData?.length || 0;
      const prevPageViews = prevPeriodData?.length || 0;
      
      const currentUniqueVisitors = new Set(currentPeriodData?.map(pv => pv.visitor_id) || []).size;
      const prevUniqueVisitors = new Set(prevPeriodData?.map(pv => pv.visitor_id) || []).size;
      
      // Calculate bounce rate (visitors who only viewed one page)
      const visitorPageCounts: Record<string, number> = {};
      currentPeriodData?.forEach(pv => {
        if (pv.visitor_id) {
          visitorPageCounts[pv.visitor_id] = (visitorPageCounts[pv.visitor_id] || 0) + 1;
        }
      });
      
      const singlePageVisitors = Object.values(visitorPageCounts).filter(count => count === 1).length;
      const totalVisitors = Object.keys(visitorPageCounts).length;
      const bounceRate = totalVisitors ? (singlePageVisitors / totalVisitors) * 100 : 0;
      
      const prevVisitorPageCounts: Record<string, number> = {};
      prevPeriodData?.forEach(pv => {
        if (pv.visitor_id) {
          prevVisitorPageCounts[pv.visitor_id] = (prevVisitorPageCounts[pv.visitor_id] || 0) + 1;
        }
      });
      
      const prevSinglePageVisitors = Object.values(prevVisitorPageCounts).filter(count => count === 1).length;
      const prevTotalVisitors = Object.keys(prevVisitorPageCounts).length;
      const prevBounceRate = prevTotalVisitors ? (prevSinglePageVisitors / prevTotalVisitors) * 100 : 0;
      
      // Calculate avg session time (simplified)
      const avgSessionTime = totalVisitors ? (currentPageViews / totalVisitors) * 60 : 0; // Rough estimate: 60 seconds per page
      const prevAvgSessionTime = prevTotalVisitors ? (prevPageViews / prevTotalVisitors) * 60 : 0;
      
      // Calculate trends
      const visitorsTrend = prevUniqueVisitors ? ((currentUniqueVisitors - prevUniqueVisitors) / prevUniqueVisitors) * 100 : 0;
      const pageViewsTrend = prevPageViews ? ((currentPageViews - prevPageViews) / prevPageViews) * 100 : 0;
      const avgSessionTrend = prevAvgSessionTime ? ((avgSessionTime - prevAvgSessionTime) / prevAvgSessionTime) * 100 : 0;
      const bounceRateTrend = prevBounceRate ? ((bounceRate - prevBounceRate) / prevBounceRate) * 100 : 0;
      
      // Format session time
      const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
      };
      
      return {
        totalVisitors: currentUniqueVisitors,
        pageViews: currentPageViews,
        avgSession: formatTime(avgSessionTime),
        bounceRate: bounceRate.toFixed(1),
        trends: {
          visitors: {
            value: parseFloat(visitorsTrend.toFixed(1)),
            isPositive: visitorsTrend >= 0
          },
          pageViews: {
            value: parseFloat(pageViewsTrend.toFixed(1)),
            isPositive: pageViewsTrend >= 0
          },
          avgSession: {
            value: parseFloat(avgSessionTrend.toFixed(1)),
            isPositive: avgSessionTrend >= 0
          },
          bounceRate: {
            value: parseFloat(bounceRateTrend.toFixed(1)),
            isPositive: bounceRateTrend <= 0 // For bounce rate, lower is better
          }
        }
      };
    },
    enabled: !!trackingId,
  });
  
  if (error) {
    console.error("VisitorMetrics error:", error);
  }
  
  const metrics: MetricItem[] = [
    {
      title: "Total Visitors",
      value: isLoading ? "-" : metricsData?.totalVisitors || 0,
      icon: <Users className="h-4 w-4" />,
      description: "Unique visitors",
      trend: isLoading ? undefined : metricsData?.trends.visitors
    },
    {
      title: "Page Views",
      value: isLoading ? "-" : metricsData?.pageViews || 0,
      icon: <Eye className="h-4 w-4" />,
      description: "Total page views",
      trend: isLoading ? undefined : metricsData?.trends.pageViews
    },
    {
      title: "Avg. Session",
      value: isLoading ? "-" : metricsData?.avgSession || "0m 0s",
      icon: <Clock className="h-4 w-4" />,
      description: "Time on site",
      trend: isLoading ? undefined : metricsData?.trends.avgSession
    },
    {
      title: "Bounce Rate",
      value: isLoading ? "-" : `${metricsData?.bounceRate || 0}%`,
      icon: <ArrowUpRight className="h-4 w-4" />,
      description: "Visitors who leave",
      trend: isLoading ? undefined : metricsData?.trends.bounceRate
    }
  ];
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
          <MetricsCard
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            trend={metric.trend}
          />
        </div>
      ))}
    </div>
  );
}
