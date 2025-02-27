
import React from "react";
import { MetricsCard } from "../ui/metrics-card";
import { Users, Eye, Clock, ArrowUpRight } from "lucide-react";

export function VisitorMetrics() {
  // This would typically fetch from an API
  const metrics = [
    {
      title: "Total Visitors",
      value: "24,532",
      icon: <Users className="h-4 w-4" />,
      description: "Unique visitors",
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: "Page Views",
      value: "94,132",
      icon: <Eye className="h-4 w-4" />,
      description: "Total page views",
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: "Avg. Session",
      value: "3m 42s",
      icon: <Clock className="h-4 w-4" />,
      description: "Time on site",
      trend: { value: 1.8, isPositive: true }
    },
    {
      title: "Bounce Rate",
      value: "42.3%",
      icon: <ArrowUpRight className="h-4 w-4" />,
      description: "Visitors who leave",
      trend: { value: 3.1, isPositive: false }
    }
  ];
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
          <MetricsCard
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            trend={metric.trend}
          />
        </div>
      ))}
    </div>
  );
}
