
import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
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
      const avgSessionTime = totalVisitors ? (currentPageViews / totalVisitors) * 60 : 0;
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

  const renderTrendBadge = (value: number, isPositive: boolean, inverted: boolean = false) => {
    // For inverted metrics like bounce rate, lower is better
    const displayIsPositive = inverted ? !isPositive : isPositive;
    const formattedValue = Math.abs(value).toFixed(1);
    
    return (
      <div 
        className={`inline-flex items-center text-xs font-medium rounded px-1.5 py-0.5 ${
          displayIsPositive 
            ? 'text-green-700 dark:text-green-500' 
            : 'text-red-700 dark:text-red-500'
        }`}
      >
        {displayIsPositive ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {formattedValue}%
      </div>
    );
  };
  
  return (
    <div className="grid grid-cols-3 gap-1 border-b mb-8">
      <div className="p-4 border-r">
        <div className="text-sm font-medium text-gray-500 mb-1">Visitors</div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold mr-2">
            {isLoading ? "-" : metricsData?.totalVisitors || 0}
          </span>
          {!isLoading && metricsData?.trends.visitors && (
            renderTrendBadge(
              metricsData.trends.visitors.value, 
              metricsData.trends.visitors.isPositive
            )
          )}
        </div>
      </div>

      <div className="p-4 border-r">
        <div className="text-sm font-medium text-gray-500 mb-1">Page Views</div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold mr-2">
            {isLoading ? "-" : metricsData?.pageViews || 0}
          </span>
          {!isLoading && metricsData?.trends.pageViews && (
            renderTrendBadge(
              metricsData.trends.pageViews.value, 
              metricsData.trends.pageViews.isPositive
            )
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="text-sm font-medium text-gray-500 mb-1">Bounce Rate</div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold mr-2">
            {isLoading ? "-" : `${metricsData?.bounceRate || 0}%`}
          </span>
          {!isLoading && metricsData?.trends.bounceRate && (
            renderTrendBadge(
              metricsData.trends.bounceRate.value, 
              metricsData.trends.bounceRate.isPositive,
              true
            )
          )}
        </div>
      </div>
    </div>
  );
}
