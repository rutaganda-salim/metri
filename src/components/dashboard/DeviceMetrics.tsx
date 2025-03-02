
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";
import { Smartphone, Tablet, Laptop, Monitor, Apple, Globe } from "lucide-react";
import { 
  FaWindows, 
  FaApple, 
  FaAndroid, 
  FaLinux, 
  FaGlobe, 
  FaChrome, 
  FaFirefox, 
  FaSafari, 
  FaEdge 
} from "react-icons/fa";

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
      return <FaWindows className="h-5 w-5 text-blue-500" />;
    } else if (os.toLowerCase().includes('mac') || os.toLowerCase().includes('ios')) {
      return <FaApple {...iconProps} className="h-5 w-5 text-gray-800" />;
    } else if (os.toLowerCase().includes('android')) {
      return <FaAndroid className="h-5 w-5 text-green-500" />;
    } else if (os.toLowerCase().includes('linux')) {
      return <FaLinux className="h-5 w-5 text-yellow-500" />;
    } else {
      return <FaGlobe {...iconProps} />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    const iconProps = { className: "h-5 w-5" };
    
    if (browser.toLowerCase().includes('chrome')) {
      return <FaChrome className="h-5 w-5 text-green-600" />;
    } else if (browser.toLowerCase().includes('firefox')) {
      return <FaFirefox className="h-5 w-5 text-orange-500" />;
    } else if (browser.toLowerCase().includes('safari')) {
      return <FaSafari className="h-5 w-5 text-blue-500" />;
    } else if (browser.toLowerCase().includes('edge')) {
      return <FaEdge className="h-5 w-5 text-blue-600" />;
    } else {
      return <FaGlobe {...iconProps} />;
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-muted-foreground">Loading device metrics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.devices?.length && !data?.browsers?.length && !data?.os?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Device Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-muted-foreground">No device data available for the selected period.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="devices">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="browsers">Browsers</TabsTrigger>
            <TabsTrigger value="os">OS</TabsTrigger>
          </TabsList>
          <TabsContent value="devices" className="space-y-4 mt-4">
            {data?.devices?.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div className="w-8 mr-2">
                  {getDeviceIcon(item.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground ml-2">{item.value}%</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: getColorForIndex(index)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="browsers" className="space-y-4 mt-4">
            {data?.browsers?.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div className="w-8 mr-2">
                  {getBrowserIcon(item.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground ml-2">{item.value}%</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: getColorForIndex(index)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="os" className="space-y-4 mt-4">
            {data?.os?.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div className="w-8 mr-2">
                  {getOsIcon(item.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground ml-2">{item.value}%</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: getColorForIndex(index)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
