
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { Globe } from "lucide-react";

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

  const getSourceIcon = (source: string) => {
    if (source === 'Google') {
      return (
        <div className="flex items-center justify-center w-5 h-5">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
            <path d="M12.48,10.92v3.28h7.84c-0.24,1.84-0.97,3.24-2.04,4.2c-0.95,0.97-2.42,2.03-5.01,2.03 c-4.03,0-7.29-3.23-7.29-7.29s3.26-7.29,7.29-7.29c2.14,0,3.94,0.82,5.27,2.37l2.55-2.55C19.44,3.47,16.27,2,12.48,2 C6.32,2,1.62,6.69,1.62,12.85s4.7,10.85,10.85,10.85c3.19,0,5.59-1.03,7.44-2.83c1.89-1.86,3.03-4.87,3.03-8.4 c0-0.77-0.08-1.45-0.2-2.01v-0.03h-10.26C12.48,10.42,12.48,10.92,12.48,10.92z" fill="#4285F4"/>
            <path d="M6.66,14.25l-0.92,3.44l-3.38,0.07c-0.69-1.27-1.08-2.71-1.08-4.23c0-1.48,0.37-2.87,1.02-4.1l3,2.31l1.32,2.98 C6.4,13.21,6.48,13.72,6.66,14.25z" fill="#FBBC05"/>
            <path d="M12.48,5.36c2.14,0,3.94,0.82,5.27,2.37l2.55-2.55C19.44,3.47,16.27,2,12.48,2c-4.12,0-7.72,2.38-9.44,5.85l3,2.31 l1.32,2.98C8.11,7.44,10.1,5.36,12.48,5.36z" fill="#EA4335"/>
            <path d="M12.48,18.41c-2.37,0-4.36-2.08-5.12-6.03l-4.3-0.07c0.79,3.86,4.08,6.75,9.42,6.75c3.79,0,6.96-1.47,8.63-3.93 l-4.36-3.36C15.55,17.51,14.08,18.41,12.48,18.41z" fill="#34A853"/>
          </svg>
        </div>
      );
    } else if (source === 'Facebook') {
      return (
        <div className="flex items-center justify-center w-5 h-5 text-[#3b5998]">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
            <path d="M20.9,2H3.1C2.5,2,2,2.5,2,3.1v17.8c0,0.6,0.5,1.1,1.1,1.1h9.6v-7.8h-2.6v-3h2.6V9.1c0-2.6,1.6-4,3.9-4c1.1,0,2.1,0.1,2.3,0.1V8h-1.6c-1.3,0-1.5,0.6-1.5,1.5v1.9h3l-0.4,3h-2.6V22h5.1c0.6,0,1.1-0.5,1.1-1.1V3.1C22,2.5,21.5,2,20.9,2z" />
          </svg>
        </div>
      );
    } else if (source === 'Twitter') {
      return (
        <div className="flex items-center justify-center w-5 h-5 text-[#1da1f2]">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
            <path d="M22.46,6c-0.77,0.35-1.6,0.58-2.46,0.69c0.88-0.53,1.56-1.37,1.88-2.38c-0.83,0.5-1.75,0.85-2.72,1.05C18.37,4.5,17.26,4,16,4c-2.35,0-4.27,1.92-4.27,4.29c0,0.34,0.04,0.67,0.11,0.98C8.28,9.09,5.11,7.38,3,4.79c-0.37,0.63-0.58,1.37-0.58,2.15c0,1.49,0.75,2.81,1.91,3.56c-0.71,0-1.37-0.2-1.95-0.5c0,0.02,0,0.03,0,0.05c0,2.08,1.48,3.82,3.44,4.21c-0.36,0.1-0.74,0.15-1.13,0.15c-0.27,0-0.54-0.03-0.8-0.08c0.54,1.69,2.11,2.95,3.98,2.98c-1.46,1.16-3.31,1.84-5.33,1.84c-0.35,0-0.69-0.02-1.03-0.06C3.44,20.29,5.7,21,8.12,21C16,21,20.33,14.46,20.33,8.79c0-0.19,0-0.37-0.01-0.56C21.22,7.78,21.91,6.96,22.46,6z" />
          </svg>
        </div>
      );
    } else if (source === 'Instagram') {
      return (
        <div className="flex items-center justify-center w-5 h-5 text-[#e1306c]">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
            <path d="M12,2.162c3.204,0,3.584,0.012,4.849,0.07c1.308,0.06,2.655,0.358,3.608,1.311 c0.962,0.962,1.251,2.296,1.311,3.608c0.058,1.265,0.07,1.645,0.07,4.849c0,3.204-0.012,3.584-0.07,4.849 c-0.059,1.301-0.364,2.661-1.311,3.608c-0.962,0.962-2.295,1.251-3.608,1.311c-1.265,0.058-1.645,0.07-4.849,0.07 s-3.584-0.012-4.849-0.07c-1.291-0.059-2.669-0.371-3.608-1.311c-0.957-0.957-1.251-2.304-1.311-3.608 c-0.058-1.265-0.07-1.645-0.07-4.849c0-3.204,0.012-3.584,0.07-4.849c0.059-1.296,0.367-2.664,1.311-3.608 c0.96-0.96,2.299-1.251,3.608-1.311C8.416,2.174,8.796,2.162,12,2.162 M12,0C8.741,0,8.332,0.014,7.052,0.072 C5.197,0.157,3.355,0.673,2.014,2.014C0.668,3.36,0.157,5.198,0.072,7.052C0.014,8.332,0,8.741,0,12 c0,3.259,0.014,3.668,0.072,4.948c0.085,1.853,0.603,3.7,1.942,5.038c1.345,1.345,3.186,1.857,5.038,1.942 C8.332,23.986,8.741,24,12,24c3.259,0,3.668-0.014,4.948-0.072c1.854-0.085,3.698-0.602,5.038-1.942 c1.347-1.347,1.857-3.184,1.942-5.038C23.986,15.668,24,15.259,24,12c0-3.259-0.014-3.668-0.072-4.948 c-0.085-1.855-0.602-3.698-1.942-5.038c-1.343-1.343-3.189-1.858-5.038-1.942C15.668,0.014,15.259,0,12,0z" />
            <path d="M12,5.838c-3.403,0-6.162,2.759-6.162,6.162c0,3.403,2.759,6.162,6.162,6.162s6.162-2.759,6.162-6.162 C18.162,8.597,15.403,5.838,12,5.838z M12,16c-2.209,0-4-1.791-4-4s1.791-4,4-4s4,1.791,4,4S14.209,16,12,16z" />
            <circle cx="18.406" cy="5.594" r="1.44" />
          </svg>
        </div>
      );
    } else if (source === 'LinkedIn') {
      return (
        <div className="flex items-center justify-center w-5 h-5 text-[#0077b5]">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
            <path d="M20.5,2h-17C2.7,2,2,2.7,2,3.5v17C2,21.3,2.7,22,3.5,22h17c0.8,0,1.5-0.7,1.5-1.5v-17C22,2.7,21.3,2,20.5,2z M8,19H5v-9h3V19z M6.5,8.5c-1,0-1.8-0.8-1.8-1.8s0.8-1.8,1.8-1.8S8.3,5.8,8.3,6.8S7.5,8.5,6.5,8.5z M19,19h-3v-5.3c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5V19h-3v-9h3v1.2c0.5-0.8,1.6-1.4,2.5-1.4c1.9,0,3.5,1.6,3.5,3.5V19z" />
          </svg>
        </div>
      );
    } else if (source === 'YouTube') {
      return (
        <div className="flex items-center justify-center w-5 h-5 text-[#ff0000]">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
            <path d="M23.495,6.205c-0.3-1.1-1.3-1.9-2.4-2.1C18.995,3.805,12,3.805,12,3.805s-6.995,0-9.095,0.3c-1.1,0.2-2.1,1-2.4,2.1 C0.305,8.305,0.305,12,0.305,12s0,3.695,0.3,5.795c0.3,1.1,1.3,1.9,2.4,2.1c2.1,0.3,9.095,0.3,9.095,0.3s6.995,0,9.095-0.3 c1.1-0.2,2.1-1,2.4-2.1c0.3-2.1,0.3-5.795,0.3-5.795S23.795,8.305,23.495,6.205z M9.705,15.305v-6.6l6,3.3L9.705,15.305z" />
          </svg>
        </div>
      );
    } else if (source === 'Direct') {
      return (
        <div className="flex items-center justify-center w-5 h-5 text-[#1d4ed8]">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
            <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M19.931,11h-3.96 c-0.144-2.596-0.62-5.006-1.391-6.921C17.575,5.218,19.504,7.88,19.931,11z M12,20c-0.938,0-2.363-2.979-2.748-8h5.496 C14.363,17.021,12.938,20,12,20z M9.252,10C9.637,4.979,11.062,2,12,2s2.363,2.979,2.748,8H9.252z M9.42,4.079 C8.649,5.994,8.173,8.404,8.029,11H4.069C4.496,7.88,6.425,5.218,9.42,4.079z M4.069,13h3.96c0.144,2.596,0.62,5.006,1.391,6.921 C6.425,18.782,4.496,16.12,4.069,13z M14.58,19.921c0.771-1.915,1.247-4.325,1.391-6.921h3.96 C19.504,16.12,17.575,18.782,14.58,19.921z" />
          </svg>
        </div>
      );
    } else {
      return <Globe className="h-5 w-5" />;
    }
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
                    {getSourceIcon(source.name)}
                    <span className="text-sm font-medium ml-2">{source.name}</span>
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

