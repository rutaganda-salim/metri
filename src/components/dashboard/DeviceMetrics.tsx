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
  Firefox, 
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
          <path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2C4.5,5.65,4.41,6.01,4.56,6.3L6.4,9.48 C3.3,11.25,1.28,14.44,1,18h22C22.72,14.44,20.7,11.25,17.6,9.48z M7,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25S8.25,13.31,8.25,14C8.25,14.69,7.69,15.25,7,15.25z M17,15.25c-0.69,0-1.25-0.56-1.25-1.25 c0-0.69,0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25C18.25,14.69,17.69,15.25,17,15.25z" />
        </svg>
      </div>;
    } else if (os.toLowerCase().includes('linux')) {
      return <div className="flex items-center justify-center w-5 h-5 text-yellow-500">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M12.5,1.5c-0.8,0-1.5,0.3-2.1,0.9S9.5,3.7,9.5,4.5c0,0.3,0,0.7,0.1,1.1c0.1,0.4,0.3,0.8,0.6,1.1s0.6,0.5,1,0.7 c0.4,0.1,0.8,0.2,1.2,0.1s0.8-0.2,1.2-0.5c0.4-0.3,0.6-0.6,0.8-1c0.2-0.4,0.3-0.9,0.2-1.4c-0.1-0.5-0.2-0.9-0.5-1.2 c-0.3-0.4-0.6-0.6-1-0.8C13.1,1.6,12.8,1.5,12.5,1.5z M13.9,9.5c-0.4-0.1-0.8-0.1-1.2-0.1s-0.8,0.1-1.2,0.2S10.8,10,10.5,10.2 s-0.7,0.4-1.1,0.7c-0.4,0.3-0.6,0.5-0.8,0.7c-0.2,0.2-0.4,0.5-0.5,0.8c-0.1,0.3-0.2,0.6-0.3,0.9c-0.1,0.3-0.1,0.7-0.1,1.2 c0,0.5,0,0.8,0,0.9s0,0.4,0.1,0.7c0,0.3,0,0.5,0,0.6c0,0.1-0.1,0.3-0.2,0.5c-0.1,0.2-0.3,0.4-0.5,0.6c-0.2,0.2-0.3,0.5-0.3,0.8 c0,0.3,0.1,0.6,0.3,0.8s0.4,0.4,0.7,0.5C8,19,8.2,19,8.5,19s0.5,0,0.8-0.1c0.2-0.1,0.5-0.1,0.8-0.1c0.3,0,0.5,0,0.6,0.1 c0.1,0.1,0.3,0.2,0.5,0.5s0.5,0.5,0.8,0.8c0.3,0.3,0.7,0.5,1.2,0.7c0.5,0.2,1.1,0.3,1.8,0.3c0.7,0,1.3-0.1,1.8-0.4 c0.5-0.2,0.9-0.5,1.2-0.8c0.3-0.3,0.5-0.7,0.7-1s0.3-0.6,0.4-0.8c0.1-0.2,0.2-0.3,0.3-0.3c0.1,0,0.2,0,0.4,0.1 c0.2,0.1,0.5,0.1,0.8,0.1c0.4,0,0.7-0.1,1-0.3c0.3-0.2,0.5-0.5,0.6-0.8c0.1-0.3,0.1-0.7,0-1c-0.1-0.3-0.3-0.6-0.5-0.8 c-0.2-0.2-0.5-0.3-0.7-0.3c-0.2,0-0.3,0-0.3-0.1c0-0.1,0-0.1,0.1-0.3c0.1-0.1,0.2-0.3,0.2-0.5c0.1-0.2,0.1-0.4,0.1-0.7 c0-0.3,0.1-0.6,0.1-1c0-0.4,0-0.7-0.1-1.1c-0.1-0.4-0.2-0.8-0.3-1.1c-0.1-0.4-0.3-0.7-0.5-1S19,9.8,18.8,9.7 c-0.2-0.1-0.4-0.2-0.6-0.2c-0.2,0-0.4-0.1-0.5-0.1c-0.1,0-0.3,0-0.4,0C17.1,9.3,16.9,9.3,16.7,9.3c-0.2,0-0.3,0-0.4,0 c-0.1,0-0.3,0-0.4,0.1c-0.1,0.1-0.3,0.1-0.4,0.1c-0.1,0-0.3,0-0.5,0C14.6,9.5,14.3,9.5,13.9,9.5z" />
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
          <path d="M12,0C8.95,0,6.19,1.23,4.2,3.22L7.24,8.3C7.5,8.03,7.81,7.8,8.14,7.63L8.5,7.5L9,7.33V7.28L9.13,7.22C9.4,7.15,9.65,7.11,9.92,7.08c0.27-0.03,0.55-0.03,0.83,0c0.28,0.03,0.55,0.08,0.81,0.15c0.13,0.04,0.25,0.08,0.38,0.13c0.18,0.07,0.36,0.15,0.33,0.13l0.23,0.1L12.1,7.5h0.1c0.17,0.1,0.33,0.2,0.48,0.3C13.1,8.08,13.48,8.49,13.76,9l0.19,0.41l0.1,0.21L14.11,10H14h-0.1h-0.1l-0.06,0.15L9.25,9.9C9.142,9.89,9.03,9.9,8.93,9.95c-0.1,0.05-0.19,0.12-0.25,0.2c-0.07,0.09-0.11,0.19-0.12,0.3c-0.01,0.11,0,0.21,0.05,0.31l0,0L8.6,10.85l0,0l2.32,5.17c0.05,0.13,0.12,0.25,0.2,0.36L14.19,14c-0.4,2.38-2.47,4.1-4.88,4.1c-1.05,0-2.01-0.33-2.81-0.88C5.8,19.72,8.6,22,12,22c6.08,0,11-4.92,11-11c0-6.08-4.92-11-11-11L12,0z M8.38,11c0.38,0,0.7,0.32,0.7,0.7c0,0.38-0.32,0.7-0.7,0.7c-0.38,0-0.7-0.32-0.7-0.7C7.68,11.32,8,11,8.38,11z M2.93,9.8C1.5,11.75,0.7,14.12,0.7,16.75c0,1.26,0.22,2.47,0.61,3.6C2.5,16.1,5.2,13.05,8.6,12.05L7.6,9.8H2.93z" />
        </svg>
      </div>;
    } else if (browser.toLowerCase().includes('firefox')) {
      return <div className="flex items-center justify-center w-5 h-5 text-orange-500">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M19.79,10.25C19.78,10.32,18.47,10.21,18.34,10.18c-0.36-0.08-1.24-0.08-1.24-0.08s-1.87-1.24-2.28-1.66c-0.01-0.12-0.04-0.24-0.1-0.35c0.77-0.55,0.9-1.59,0.53-2.35c-0.83,0.22-1.37,1.01-1.42,1.83c-0.45,0.08-0.92,0.35-1.42,0.75c-0.79-0.62-1.72-1.04-2.7-1.21c0,0,0,0-0.01,0c-0.02-0.04-0.06-0.08-0.1-0.1C6.17,6.66,6.16,6.64,6.14,6.63C5.73,6.44,5.23,6.59,5.04,7c-0.1,0.21-0.1,0.46-0.01,0.68c0.09,0.21,0.26,0.38,0.48,0.46c0.13,0.05,0.27,0.05,0.4,0.01c0.24,0.22,0.51,0.42,0.8,0.59c0,0.01,0,0.02,0,0.03C6.42,9.06,6.3,9.38,6.28,9.7C5.64,9.83,5.04,10.1,4.53,10.49c0,0-0.01,0-0.01,0C3.37,11.35,3.55,12.15,3.55,12.15s-0.58,0.93-0.5,1.73c0,0-1.18,0.78-1.01,2.33c0,0,0.03,0.35,0.17,0.76c0,0.03,0.01,0.05,0.01,0.08c0,0.01,0,0.03,0.01,0.04c0.01,0.04,0.03,0.09,0.04,0.13c0.22,0.6,0.68,1.11,1.27,1.4c0,0,0.44,0.21,1.25,0.26c0.06,0.1,0.12,0.2,0.2,0.29C5.35,19.72,5.94,20,6.57,20c0.56,0,1.1-0.21,1.5-0.6c0.01-0.01,0.01-0.02,0.02-0.03c0.01,0,0.01,0,0.02,0c0.51,0.09,1.02,0.14,1.54,0.14c0.59,0,1.18-0.08,1.76-0.23c0.99,0.47,2.19,0.45,3.15-0.13c0.38,0.3,0.85,0.47,1.33,0.47c0.53,0,1.04-0.19,1.44-0.53c0.11-0.1,0.21-0.21,0.3-0.33C18.36,18.59,19,18.08,19,18.08l0.77-3.04C19.77,15.04,21.92,11.67,19.79,10.25z" />
        </svg>
      </div>;
    } else if (browser.toLowerCase().includes('safari')) {
      return <div className="flex items-center justify-center w-5 h-5 text-blue-500">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M12,2C6.49,2,2,6.49,2,12s4.49,10,10,10s10-4.49,10-10S17.51,2,12,2z M11.7,20c-4.41,0-8-3.59-8-8c0-4.41,3.59-8,8-8c4.41,0,8,3.59,8,8C19.7,16.41,16.11,20,11.7,20z M16.9,6.3l-9.6,9.6l0.9,0.9l9.6-9.6L16.9,6.3z M11.6,7.1c-0.39,0.39-0.39,1.02,0,1.41c0.39,0.39,1.02,0.39,1.41,0s0.39-1.02,0-1.41C12.62,6.71,11.99,6.71,11.6,7.1z M9.4,16.9c0.39-0.39,0.39-1.02,0-1.41c-0.39-0.39-1.02-0.39-1.41,0c-0.39,0.39-0.39,1.02,0,1.41C8.38,17.29,9.01,17.29,9.4,16.9z" />
        </svg>
      </div>;
    } else if (browser.toLowerCase().includes('edge')) {
      return <div className="flex items-center justify-center w-5 h-5 text-blue-600">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
          <path d="M20.91,11.12C20.88,6.15,16.63,2,11.37,2C6.27,2,2,6.3,2,11.42c0,1.5,0.36,2.91,0.99,4.16c0,0.02,0.01,0.03,0.01,0.05c0.34,0.66,0.8,1.28,1.35,1.84c0.16,0.16,0.33,0.32,0.51,0.47c0.25,0.21,0.52,0.42,0.79,0.6C6.78,19.12,8.08,19.5,9.47,19.5c2.43,0,4.64-1.1,6.12-2.85c-0.96,0.38-2.08,0.55-3.28,0.35c-1.18-0.21-2.38-0.97-2.96-1.35c-1.53-0.98-2.64-2.81-2.73-4.63l-0.01-0.04c0-0.64,0.23-1.27,0.64-1.77c0.41-0.5,0.99-0.86,1.63-1.01c0.57-0.13,1.16-0.08,1.71,0.11c0.54,0.19,1.03,0.54,1.38,1.01c0.39,0.53,0.58,1.1,0.67,1.8c0.07,0.56,0.04,1.2-0.06,1.74c0.36-0.23,0.74-0.56,1.22-1.15c0.59-0.73,1.21-1.75,1.87-3.3c0.02-0.12,0.03-0.25,0.03-0.39c0-0.22-0.03-0.42-0.08-0.63C14.88,6.55,14.31,6.1,13.64,5.9c-0.44-0.13-0.9-0.13-1.35-0.01c-0.48,0.12-0.93,0.4-1.29,0.79c-0.35,0.39-0.6,0.87-0.69,1.39c-0.12,0.53-0.05,1.07,0.15,1.56c-0.14-0.06-0.32-0.1-0.53-0.15c-0.15-0.03-0.32-0.06-0.46-0.08c-0.32-0.04-0.65-0.05-0.96-0.04c-0.58,0.02-1.29,0.12-1.86,0.4C6.1,10.01,5.64,10.33,5.3,10.72c-0.34,0.39-0.56,0.85-0.61,1.33c-0.08,0.59,0.13,1.17,0.5,1.65c0.47,0.6,1.21,1.03,2.05,1.26c0.31,0.09,0.63,0.14,0.95,0.17c0.41,0.04,0.84,0.02,1.25-0.04c-0.14,0.56-0.3,1.22-0.36,1.87c-0.06,0.54-0.04,1.04,0.14,1.5c0.22,0.58,0.76,1.05,1.45,1.25c1.11,0.31,2.46-0.15,3.38-0.65c-0.03-0.13-0.1-0.26-0.18-0.38c-0.15-0.22-0.39-0.39-0.66-0.46c-0.31-0.09-0.63-0.03-0.93,0.09c-0.34,0.13-0.68,0.3-1.01,0.41c-0.27,0.09-0.52,0.14-0.77,0.13c-0.36-0.01-0.61-0.16-0.8-0.39c-0.3-0.35-0.41-0.89-0.41-1.41c0-0.51,0.1-1.01,0.21-1.48c0.11-0.47,0.25-0.91,0.38-1.27c0.52,0.18,1.04,0.28,1.55,0.34c0.66,0.07,1.31,0.05,1.94-0.04c0.63-0.09,1.26-0.26,1.86-0.49c0.6-0.23,1.19-0.51,1.75-0.82c0.85-0.48,1.64-1.04,2.37-1.66c0.21-0.18,0.42-0.37,0.63-0.55c0.53-0.49,1.04-0.99,1.59-1.46c0.14-0.12,0.22-0.33,0.21-0.53C21.03,11.44,20.91,11.12,20.91,11.12z" />
        </svg>
      </div>;
    } else {
      return <Globe {...iconProps} />;
    }
  };

  const getDeviceIcon = (device: string) => {
    const iconProps = { className: "h-5 w-5" };
    
    if (device.toLowerCase().includes('mobile')) {
      return <Smartphone {...iconProps} />;
    } else if (device.toLowerCase().includes('tablet')) {
      return <Tablet {...iconProps} />;
    } else if (device.toLowerCase().includes('desktop')) {
      return <Monitor {...iconProps} />;
    } else {
      return <Laptop {...iconProps} />;
    }
  };

  interface MetricItem {
    name: string;
    count: number;
    value: number;
  }

  const renderDataTable = (items: MetricItem[] | undefined, getIcon: (name: string) => React.ReactNode) => (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {items?.map((item, index) => (
        <div key={index} className="border rounded-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              {getIcon(item.name)}
              <span className="font-medium ml-2">{item.name}</span>
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
              renderDataTable(data.devices, getDeviceIcon)
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
              renderDataTable(data.browsers, getBrowserIcon)
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
              renderDataTable(data.os, getOsIcon)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
