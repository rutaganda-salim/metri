
import React, { useState, useEffect } from "react";
import { VisitorMetrics } from "./VisitorMetrics";
import { TrafficSources } from "./TrafficSources";
import { DeviceMetrics } from "./DeviceMetrics";
import { TimeChart } from "./TimeChart";
import { WorldMap } from "./WorldMap";
import { DateRangePicker } from "../ui/date-range-picker";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import { ActivitySquare, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Website {
  id: string;
  tracking_id: string;
  site_name: string;
  site_url: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export function AnalyticsDashboard() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [activeVisitors, setActiveVisitors] = useState<number>(0);
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  // Fetch user's websites
  const { data: websitesData, isLoading: websitesLoading, error: websitesError } = useQuery<Website[]>({
    queryKey: ['websites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users_tracking")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching websites:", error);
        throw error;
      }
      
      return data || [];
    },
    meta: {
      onSuccess: (data) => {
        if (data && data.length > 0 && selectedSite === "all") {
          setSelectedSite(data[0].tracking_id);
        }
      },
      onError: (error) => {
        console.error("Error in websites query:", error);
        toast({
          title: "Error loading websites",
          description: "Failed to load your websites. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });
  
  // Update selected site when websites data is loaded
  useEffect(() => {
    if (websitesData && websitesData.length > 0 && selectedSite === "all") {
      setSelectedSite(websitesData[0].tracking_id);
    }
  }, [websitesData, selectedSite]);
  
  const websites = websitesData || [];

  // Fetch active visitors count
  useEffect(() => {
    if (!selectedSite || selectedSite === "all") return;

    const fetchActiveVisitors = async () => {
      try {
        // Get active visitors from the last 5 minutes
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
        
        const { data, error } = await supabase
          .from("active_visitors")
          .select("*")
          .eq("tracking_id", selectedSite)
          .gte("last_active", fiveMinutesAgo.toISOString());
          
        if (error) {
          console.error("Error fetching active visitors:", error);
          throw error;
        }
        setActiveVisitors(data ? data.length : 0);
      } catch (error) {
        console.error("Error fetching active visitors:", error);
        toast({
          title: "Error loading active visitors",
          description: "Failed to load active visitors data. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchActiveVisitors();
    
    // Subscribe to active_visitors table changes
    const channel = supabase
      .channel('active_visitors_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_visitors',
          filter: `tracking_id=eq.${selectedSite}`
        },
        () => {
          fetchActiveVisitors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSite, toast]);

  // Check if the user has any websites
  const noWebsites = !websitesLoading && (!websites || websites.length === 0);

  if (websitesError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-sm">Monitor your web traffic and visitor insights</p>
        </div>
        <div className="border border-red-500/20 bg-red-500/5 p-4 rounded-md">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="font-medium">Error loading dashboard</h3>
              <p className="text-sm text-muted-foreground">There was a problem loading your dashboard data. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (noWebsites) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-sm">Add a website to start tracking analytics</p>
        </div>
        <div className="bg-white rounded-md border p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-center mb-4">
              You haven't added any websites yet. Go to the Websites page to add your first website.
            </p>
            <a href="/websites" className="text-blue-600 hover:underline">
              Add your first website →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-sm">Monitor your web traffic and visitor insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={selectedSite}
            onValueChange={setSelectedSite}
            disabled={websitesLoading}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              {websites && websites.map((site) => (
                <SelectItem key={site.id} value={site.tracking_id}>
                  {site.site_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </div>
      </div>

      <div className="bg-white p-3 rounded-md border flex items-center gap-2 mb-2">
        <ActivitySquare className="h-4 w-4 text-green-500" />
        <div className="flex items-baseline">
          <span className="font-medium mr-2">{activeVisitors}</span>
          <span className="text-xs text-gray-500">current visitors</span>
        </div>
        <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-500 border-green-500/20 text-xs">
          Live
        </Badge>
      </div>

      {selectedSite && selectedSite !== "all" && (
        <>
          <VisitorMetrics trackingId={selectedSite} dateRange={dateRange} />
          
          <TimeChart trackingId={selectedSite} dateRange={dateRange} />
          
          <WorldMap trackingId={selectedSite} dateRange={dateRange} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-3">
              <TrafficSources trackingId={selectedSite} dateRange={dateRange} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
