
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

interface DeviceMetricsProps {
  trackingId?: string;
  dateRange?: DateRange;
}

export function DeviceMetrics({ trackingId, dateRange }: DeviceMetricsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['device-metrics', trackingId, dateRange],
    queryFn: async () => {
      if (!trackingId) return { devices: [], browsers: [], os: [] };
      
      const from = dateRange?.from ? new Date(dateRange.from) : new Date(new Date().setDate(new Date().getDate() - 7));
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      
      // Set the time to cover the full day
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from("page_views")
        .select("browser, operating_system, device_type, visitor_id")
        .eq("tracking_id", trackingId)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());
      
      if (error) throw error;
      
      // Process by visitor_id to avoid counting the same visitor multiple times
      const uniqueVisitors = {};
      
      data.forEach(item => {
        if (!uniqueVisitors[item.visitor_id]) {
          uniqueVisitors[item.visitor_id] = {
            browser: item.browser,
            os: item.operating_system,
            device: item.device_type
          };
        }
      });
      
      const visitors = Object.values(uniqueVisitors);
      
      // Count devices
      const deviceCounts = {};
      visitors.forEach(visitor => {
        const device = visitor.device || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      
      // Count browsers
      const browserCounts = {};
      visitors.forEach(visitor => {
        const browser = visitor.browser || 'Unknown';
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });
      
      // Count operating systems
      const osCounts = {};
      visitors.forEach(visitor => {
        const os = visitor.os || 'Unknown';
        osCounts[os] = (osCounts[os] || 0) + 1;
      });
      
      // Convert to arrays and sort
      const totalVisitors = visitors.length;
      
      const devices = Object.entries(deviceCounts).map(([name, count]) => ({
        name,
        count: count as number,
        value: totalVisitors > 0 ? Math.round(((count as number) / totalVisitors) * 100) : 0
      })).sort((a, b) => b.count - a.count);
      
      const browsers = Object.entries(browserCounts).map(([name, count]) => ({
        name,
        count: count as number,
        value: totalVisitors > 0 ? Math.round(((count as number) / totalVisitors) * 100) : 0
      })).sort((a, b) => b.count - a.count);
      
      const os = Object.entries(osCounts).map(([name, count]) => ({
        name,
        count: count as number,
        value: totalVisitors > 0 ? Math.round(((count as number) / totalVisitors) * 100) : 0
      })).sort((a, b) => b.count - a.count);
      
      return { devices, browsers, os };
    },
    enabled: !!trackingId,
  });

  const getColorForIndex = (index) => {
    const colors = [
      '#1d4ed8', '#10b981', '#7c3aed', '#f59e0b', '#f43f5e',
      '#0891b2', '#84cc16', '#d946ef', '#64748b', '#dc2626'
    ];
    return colors[index % colors.length];
  };

  const renderDataTable = (items) => (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {items?.map((item, index) => (
        <div key={index} className="border rounded-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getColorForIndex(index) }}
              />
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="font-medium">{item.value}%</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold mb-1">{item.count}</div>
            <div className="text-xs text-muted-foreground">Unique visitors</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="browsers">Browsers</TabsTrigger>
            <TabsTrigger value="os">Operating Systems</TabsTrigger>
          </TabsList>
          <TabsContent value="devices" className="pt-4">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border rounded-md overflow-hidden">
                    <div className="h-14 bg-muted"></div>
                    <div className="h-20 p-4">
                      <div className="h-6 w-1/3 bg-muted rounded mb-2"></div>
                      <div className="h-4 w-1/4 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !data?.devices || data.devices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No device data available
              </div>
            ) : (
              renderDataTable(data.devices)
            )}
          </TabsContent>
          <TabsContent value="browsers" className="pt-4">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border rounded-md overflow-hidden">
                    <div className="h-14 bg-muted"></div>
                    <div className="h-20 p-4">
                      <div className="h-6 w-1/3 bg-muted rounded mb-2"></div>
                      <div className="h-4 w-1/4 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !data?.browsers || data.browsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No browser data available
              </div>
            ) : (
              renderDataTable(data.browsers)
            )}
          </TabsContent>
          <TabsContent value="os" className="pt-4">
            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border rounded-md overflow-hidden">
                    <div className="h-14 bg-muted"></div>
                    <div className="h-20 p-4">
                      <div className="h-6 w-1/3 bg-muted rounded mb-2"></div>
                      <div className="h-4 w-1/4 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !data?.os || data.os.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No operating system data available
              </div>
            ) : (
              renderDataTable(data.os)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
