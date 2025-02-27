
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  className?: string;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const [selectedPreset, setSelectedPreset] = React.useState<string>("last7Days");

  const presets = [
    {
      id: "today",
      label: "Today",
      getRange: () => ({
        from: new Date(),
        to: new Date(),
      }),
    },
    {
      id: "yesterday",
      label: "Yesterday",
      getRange: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          from: yesterday,
          to: yesterday,
        };
      },
    },
    {
      id: "last7Days",
      label: "Last 7 days",
      getRange: () => ({
        from: addDays(new Date(), -7),
        to: new Date(),
      }),
    },
    {
      id: "last30Days",
      label: "Last 30 days",
      getRange: () => ({
        from: addDays(new Date(), -30),
        to: new Date(),
      }),
    },
  ];

  React.useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange(date);
    }
  }, [date, onDateRangeChange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b border-border flex justify-between items-center">
            <h3 className="text-sm font-medium">Date Range</h3>
            <Select
              value={selectedPreset}
              onValueChange={(value) => {
                setSelectedPreset(value);
                const preset = presets.find((p) => p.id === value);
                if (preset) {
                  const range = preset.getRange();
                  setDate(range);
                }
              }}
            >
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
