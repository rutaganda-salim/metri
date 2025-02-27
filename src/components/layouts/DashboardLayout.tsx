
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <SidebarTrigger />
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
