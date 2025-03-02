
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { Globe } from "lucide-react";

interface WorldMapProps {
  trackingId?: string;
  dateRange?: DateRange;
}

interface CountryData {
  name: string;
  count: number;
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
      const countries = Object.entries(countryCounts)
        .map(([name, count]) => ({ name, count: count as number }))
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
    // ISO country codes for common countries
    const countryCodes: Record<string, string> = {
      'United States': 'us',
      'USA': 'us',
      'United Kingdom': 'gb',
      'UK': 'gb',
      'Canada': 'ca',
      'Australia': 'au',
      'Germany': 'de',
      'France': 'fr',
      'Japan': 'jp',
      'China': 'cn',
      'India': 'in',
      'Brazil': 'br',
      'Russia': 'ru',
      'Mexico': 'mx',
      'Spain': 'es',
      'Italy': 'it',
      'South Korea': 'kr',
      'Netherlands': 'nl',
      'Sweden': 'se',
      'Switzerland': 'ch',
      'Singapore': 'sg',
      'Nigeria': 'ng',
      'South Africa': 'za',
      'New Zealand': 'nz',
    };
    
    const code = countryCodes[countryName] || '';
    
    if (code) {
      return (
        <div className="w-6 h-4 rounded-sm border border-gray-200 overflow-hidden mr-2">
          <img 
            src={`https://flagcdn.com/w40/${code}.png`} 
            alt={`${countryName} flag`}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    return <Globe className="h-5 w-5 mr-2" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors by Country</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-4 w-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No country data available
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.slice(0, 6).map((country: CountryData, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center font-medium truncate">
                      {getCountryFlag(country.name)}
                      <span>{country.name}</span>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getColorForIndex(index) }}
                    />
                  </div>
                  <div className="text-2xl font-bold">{country.count}</div>
                  <div className="text-xs text-muted-foreground">visitors</div>
                </div>
              ))}
            </div>
            
            {data.length > 6 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Other Countries</h4>
                <div className="space-y-2">
                  {data.slice(6, 15).map((country: CountryData, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getCountryFlag(country.name)}
                        <span className="text-sm">{country.name}</span>
                      </div>
                      <span className="text-sm font-medium">{country.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

