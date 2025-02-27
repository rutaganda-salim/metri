
import React from "react";
import { VisitorMetrics } from "./VisitorMetrics";
import { TrafficSources } from "./TrafficSources";
import { DeviceMetrics } from "./DeviceMetrics";
import { TimeChart } from "./TimeChart";
import { DateRangePicker } from "../ui/date-range-picker";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";

export function AnalyticsDashboard() {
  const [selectedSite, setSelectedSite] = React.useState("all");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor your web traffic and visitor insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={selectedSite}
            onValueChange={setSelectedSite}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Websites</SelectItem>
              <SelectItem value="main">Main Website</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="store">Store</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </div>
      </div>

      <VisitorMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimeChart dateRange={dateRange} />
        </div>
        <div>
          <TrafficSources />
        </div>
      </div>
      
      <DeviceMetrics />
    </div>
  );
}
