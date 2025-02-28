
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

interface TrafficSourcesProps {
  trackingId?: string;
  dateRange?: DateRange;
}

interface SourceData {
  name: string;
  value: number;
  count: number;
  color: string;
}

export function TrafficSources({ trackingId, dateRange }: TrafficSourcesProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['traffic-sources', trackingId, dateRange],
    queryFn: async () => {
      if (!trackingId) return [];
      
      const from = dateRange?.from ? new Date(dateRange.from) : new Date(new Date().setDate(new Date().getDate() - 7));
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      
      // Set the time to cover the full day
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from("page_views")
        .select("referrer")
        .eq("tracking_id", trackingId)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());
      
      if (error) {
        console.error("Error fetching traffic sources:", error);
        throw error;
      }
      
      // Process referrer data
      const referrers: Record<string, number> = {};
      let total = 0;
      
      if (data) {
        data.forEach(item => {
          const referrer = item.referrer || 'direct';
          
          // Normalize referrer
          let source = 'Direct';
          
          if (referrer === 'direct') {
            source = 'Direct';
          } else if (referrer.includes('google')) {
            source = 'Google';
          } else if (referrer.includes('facebook') || referrer.includes('fb.com')) {
            source = 'Facebook';
          } else if (referrer.includes('twitter') || referrer.includes('t.co')) {
            source = 'Twitter';
          } else if (referrer.includes('instagram')) {
            source = 'Instagram';
          } else if (referrer.includes('youtube')) {
            source = 'YouTube';
          } else if (referrer.includes('linkedin')) {
            source = 'LinkedIn';
          } else if (referrer.includes('bing')) {
            source = 'Bing';
          } else if (referrer.includes('yahoo')) {
            source = 'Yahoo';
          } else if (referrer !== 'direct') {
            source = 'Other';
          }
          
          referrers[source] = (referrers[source] || 0) + 1;
          total++;
        });
      }
      
      // Convert to array and calculate percentages
      const sources: SourceData[] = Object.keys(referrers).map(name => {
        const count = referrers[name];
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        
        return {
          name,
          value: percentage,
          count,
          color: getColorForSource(name)
        };
      });
      
      // Sort by count
      sources.sort((a, b) => b.count - a.count);
      
      return sources;
    },
    enabled: !!trackingId,
  });
  
  const getColorForSource = (source: string): string => {
    const colors: Record<string, string> = {
      'Direct': '#1d4ed8',
      'Google': '#10b981',
      'Facebook': '#3b5998',
      'Twitter': '#1da1f2',
      'Instagram': '#e1306c',
      'YouTube': '#ff0000',
      'LinkedIn': '#0077b5',
      'Bing': '#ffb900',
      'Yahoo': '#7B0099',
      'Other': '#6b7280'
    };
    
    return colors[source] || '#6b7280';
  };

  if (error) {
    console.error("TrafficSources error:", error);
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-red-500">
            Error loading traffic source data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
                <div className="h-4 w-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No traffic source data available
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm font-medium">{source.name}</span>
                  </div>
                  <div className="text-sm font-medium flex items-center">
                    <span className="mr-2">{source.count}</span>
                    <span className="text-muted-foreground">{source.value}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${source.value}%`,
                      backgroundColor: source.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
