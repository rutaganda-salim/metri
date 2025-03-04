
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCountryCodeByName } from "@/utils/countryUtils";

interface WorldMapProps {
  trackingId?: string;
  dateRange?: DateRange;
}

interface CountryData {
  name: string;
  count: number;
  percentage?: number;
}

export function WorldMap({ trackingId, dateRange }: WorldMapProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['country-metrics', trackingId, dateRange],
    queryFn: async () => {
      if (!trackingId) return [];
      
      const from = dateRange?.from ? new Date(dateRange.from) : new Date(new Date().setDate(new Date().getDate() - 7));
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      
      // Set the time to cover the full day
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from("page_views")
        .select("country, visitor_id")
        .eq("tracking_id", trackingId)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString())
        .not("country", "is", null);
      
      if (error) throw error;
      
      // Count countries but deduplicate by visitor_id
      const visitorCountries: Record<string, string> = {};
      data.forEach(item => {
        if (item.visitor_id && item.country && !visitorCountries[item.visitor_id]) {
          visitorCountries[item.visitor_id] = item.country;
        }
      });
      
      // Count occurrences of each country
      const countryCounts: Record<string, number> = {};
      Object.values(visitorCountries).forEach(country => {
        if (country) {
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        }
      });
      
      // Convert to array and sort
      const totalVisitors = Object.values(countryCounts).reduce((sum, count) => sum + count, 0);
      const countries = Object.entries(countryCounts)
        .map(([name, count]) => ({ 
          name, 
          count: count as number,
          percentage: totalVisitors > 0 ? Math.round((count / totalVisitors) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count);
      
      return countries;
    },
    enabled: !!trackingId,
  });

  const getColorForIndex = (index: number) => {
    const colors = [
      '#1d4ed8', '#10b981', '#7c3aed', '#f59e0b', '#f43f5e',
      '#0891b2', '#84cc16', '#d946ef', '#64748b', '#dc2626'
    ];
    return colors[index % colors.length];
  };
  
  const getCountryFlag = (countryName: string) => {
    // Get the country code directly from our utility
    const code = getCountryCodeByName(countryName);
    
    if (code) {
      return (
        <div className="inline-flex w-6 h-4 rounded overflow-hidden mr-2 border border-gray-200">
          <img 
            src={`https://flagcdn.com/w40/${code}.png`} 
            alt={`${countryName} flag`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to globe icon if flag fails to load
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="flex items-center justify-center w-full h-full bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>`;
              }
            }}
          />
        </div>
      );
    }
    
    return <Globe className="h-4 w-4 mr-2 text-gray-500" />;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8 font-bricolage">
      <div className="bg-white dark:bg-card border rounded-md">
        <div className="border-b p-4">
          <h3 className="font-medium">Countries</h3>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : !data || data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No country data available
            </div>
          ) : (
            <div className="space-y-4">
              {data.slice(0, 5).map((country: CountryData, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {getCountryFlag(country.name)}
                      <span className="text-sm">{country.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{country.percentage}%</span>
                      <span className="text-xs text-gray-500">{country.count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${country.percentage}%`,
                        backgroundColor: getColorForIndex(index) 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              
              {data.length > 5 && (
                <div className="pt-2 mt-2 border-t">
                  <button className="text-xs text-blue-600 hover:underline">
                    View all ({data.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-card border rounded-md">
        <div className="border-b p-4">
          <h3 className="font-medium">Device Summary</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Desktop</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">75%</span>
                      <span className="text-xs text-gray-500">15</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mobile</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">20%</span>
                      <span className="text-xs text-gray-500">4</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tablet</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">5%</span>
                      <span className="text-xs text-gray-500">1</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
