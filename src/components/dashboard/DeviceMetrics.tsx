import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Apple, 
  Circle, 
  Chrome, 
  Globe,
  Laptop
} from "lucide-react";

interface DeviceMetricsProps {
  trackingId?: string;
  dateRange?: DateRange;
}

interface VisitorData {
  browser: string | null;
  os: string | null;
  device: string | null;
}

export function DeviceMetrics({ trackingId, dateRange }: DeviceMetricsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['device-metrics', trackingId, dateRange],
    queryFn: async () => {
      if (!trackingId) return { devices: [], browsers: [], os: [] };
      
      const from = dateRange?.from ? new Date(dateRange.from) : new Date(new Date().setDate(new Date().getDate() - 7));
      const to = dateRange?.to ? new Date(dateRange.to) : new Date();
      
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from("page_views")
        .select("browser, operating_system, device_type, visitor_id")
        .eq("tracking_id", trackingId)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());
      
      if (error) throw error;
      
      const uniqueVisitors: Record<string, VisitorData> = {};
      
      data.forEach(item => {
        if (!uniqueVisitors[item.visitor_id as string]) {
          uniqueVisitors[item.visitor_id as string] = {
            browser: item.browser,
            os: item.operating_system,
            device: item.device_type
          };
        }
      });
      
      const visitors = Object.values(uniqueVisitors);
      
      const deviceCounts: Record<string, number> = {};
      visitors.forEach(visitor => {
        const device = visitor.device || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      
      const browserCounts: Record<string, number> = {};
      visitors.forEach(visitor => {
        const browser = visitor.browser || 'Unknown';
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });
      
      const osCounts: Record<string, number> = {};
      visitors.forEach(visitor => {
        const os = visitor.os || 'Unknown';
        osCounts[os] = (osCounts[os] || 0) + 1;
      });
      
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

  const getColorForIndex = (index: number) => {
    const colors = [
      '#1d4ed8', '#10b981', '#7c3aed', '#f59e0b', '#f43f5e',
      '#0891b2', '#84cc16', '#d946ef', '#64748b', '#dc2626'
    ];
    return colors[index % colors.length];
  };

  const getOsIcon = (os: string) => {
    const iconProps = { className: "h-5 w-5" };
    
    if (os.toLowerCase().includes('windows')) {
      return <div className="flex items-center justify-center w-5 h-5 text-blue-500">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M0,0L9.85,1.26V11.5H0ZM10.98,1.44L24,3V11.5H10.98ZM0,12.5H9.85v10.24L0,24ZM10.98,12.5H24V21l-13.02,1.56Z" />
        </svg>
      </div>;
    } else if (os.toLowerCase().includes('mac') || os.toLowerCase().includes('ios')) {
      return <Apple {...iconProps} />;
    } else if (os.toLowerCase().includes('android')) {
      return <div className="flex items-center justify-center w-5 h-5 text-green-500">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,[...]
        </svg>
      </div>;
    } else if (os.toLowerCase().includes('linux')) {
      return <div className="flex items-center justify-center w-5 h-5 text-yellow-500">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M12.5,1.5c-0.8,0-1.5,0.3-2.1,0.9S9.5,3.7,9.5,4.5c0,0.3,0,0.7,0.1,1.1c0.1,0.4,0.3,0.8,0.6,1.1s0.6,0.5,1,0.7 c0.4,0.1,0.8,0.2,1.2,0.1s0.8-0.2,1.2-0.5c0.4-0.3,0.6-0.6,0.8-1c0.2-0.4,0.3[...]
        </svg>
      </div>;
    } else {
      return <Globe {...iconProps} />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    const iconProps = { className: "h-5 w-5" };
    
    if (browser.toLowerCase().includes('chrome')) {
      return <div className="flex items-center justify-center w-5 h-5 text-green-600">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M12,0C8.95,0,6.19,1.23,4.2,3.22L7.24,8.3C7.5,8.03,7.81,7.8,8.14,7.63L8.5,7.5L9,7.33V7.28L9.13,7.22C9.4,7.15,9.65,7.11,9.92,7.08c0.27-0.03,0.55-0.03,0.83,0c0.28,0.03,0.55,0.08,0.81,0[...]
        </svg>
      </div>;
    } else if (browser.toLowerCase().includes('firefox')) {
      return <div className="flex items-center justify-center w-5 h-5 text-orange-500">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M19.79,10.25C19.78,10.32,18.47,10.21,18.34,10.18c-0.36-0.08-1.24-0.08-1.24-0.08s-1.87-1.24-2.28-1.66c-0.01-0.12-0.[...]
        </svg>
      </div>;
    } else if (browser.toLowerCase().includes('safari')) {
      return <div className="flex items-center justify-center w-5 h-5 text-blue-500">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10s10-4.49,10-10S17.51,2,12,2z M11.7,20c-4.41,0-8-3.59-8-8c0-4.41,3.59-8,8-8c4.41,0,8,3.59,8,8C19.7,16.41,16.11,20,11.7,20z M16.9,6.3l-9.6,9.6l0.[...]
        </svg>
      </div>;
    } else if (browser.toLowerCase().includes('edge')) {
      return <div className="flex items-center justify-center w-5 h-5 text-blue-600">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M20.91,11.12C20.88,6.15,16.63,2,11.37,2C6.27,2,2,6.3,2,11.42c0,1.5,0.36,2.91,0.99,4.16c0,0.02,0.01,0.03,0.01,0.05c0.34,0.66,0.8,1.28,1.35,1.84c0.16,0.16,0.33,0.32,0.51,0.47c0.25,0.2[...]
        </svg>
      </div>;
    } else {
      return <Globe {...iconProps} />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="devices">
          <TabsList>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="browsers">Browsers</TabsTrigger>
            <TabsTrigger value="os">Operating Systems</TabsTrigger>
          </TabsList>
          <TabsContent value="devices">
            {data.devices.map((device, index) => (
              <div key={device.name} style={{ color: getColorForIndex(index) }}>
                <Smartphone className="inline-block mr-2" />
                {device.name}: {device.count} ({device.value}%)
              </div>
            ))}
          </TabsContent>
          <TabsContent value="browsers">
            {data.browsers.map((browser, index) => (
              <div key={browser.name} style={{ color: getColorForIndex(index) }}>
                {getBrowserIcon(browser.name)}
                {browser.name}: {browser.count} ({browser.value}%)
              </div>
            ))}
          </TabsContent>
          <TabsContent value="os">
            {data.os.map((os, index) => (
              <div key={os.name} style={{ color: getColorForIndex(index) }}>
                {getOsIcon(os.name)}
                {os.name}: {os.count} ({os.value}%)
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
