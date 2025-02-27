
import React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";

const Index = () => {
  return (
    <DashboardLayout>
      <AnalyticsDashboard />
    </DashboardLayout>
  );
};

export default Index;
