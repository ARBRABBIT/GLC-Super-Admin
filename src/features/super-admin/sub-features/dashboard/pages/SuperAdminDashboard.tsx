import React from "react";
import SuperAdminHeader from "@/features/super-admin/components/SuperAdminHeader";
import VisitorSalesCard from "@/features/super-admin/sub-features/dashboard/components/VisitorSalesCard";
import FarmlandStatsCard from "@/features/super-admin/sub-features/dashboard/components/FarmlandStatsCard";
import StatusCards from "@/features/super-admin/sub-features/dashboard/components/StatusCards";
import SalesReportChart from "@/features/super-admin/sub-features/dashboard/components/SalesReportChart";
import TopPerformersList from "@/features/super-admin/sub-features/dashboard/components/TopPerformersList";
import SubscriberGrowthChart from "@/features/super-admin/sub-features/dashboard/components/SubscriberGrowthChart";
import { mockDashboardData } from "@/features/super-admin/data/mockDashboardData";

import { SIMPLE_MODE } from "@/core/config/featureFlags";

// ─── Super Admin Dashboard Page ─────────────────────────────────────────────
const SuperAdminDashboard: React.FC=() => {
  const data=mockDashboardData;

  return (
    <div className="box-border flex min-h-full flex-col gap-[clamp(12px,0.5vw,16px)] p-[clamp(6px,0.83vw,12px)] py-[clamp(16px,1.5vw,32px)]">
      {/* ── Header Section (hidden in SIMPLE_MODE) ── */}
      {!SIMPLE_MODE && (
        <div className="shrink-0">
          <SuperAdminHeader
            title="SUPER ADMIN"
            breadcrumb="Dashboard"
          >
            {/* Visitor + Sales cards overlaid inside the header area */}
            <div className="flex items-start justify-between gap-4 mt-4 w-full h-full relative z-10">
              <div className="mt-4">
                <VisitorSalesCard
                  visitors={data.visitors}
                  totalSales={data.totalSales}
                />
              </div>
              <div className="mt-auto mb-6">
                <FarmlandStatsCard stats={data.farmlandStats} />
              </div>
            </div>
          </SuperAdminHeader>
        </div>
      )}


      {/* ── Main Layout: Left and Right Columns ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4 mt-2">
        {/* ── Left Column ── */}
        <div className="flex flex-col gap-4">
          <StatusCards cards={data.statusCards} />
          <SalesReportChart data={data.salesReport} />
        </div>

        {/* ── Right Column ── */}
        <div className="flex flex-col gap-4">
          <TopPerformersList performers={data.topPerformers} />
          <SubscriberGrowthChart data={data.subscriberGrowth} />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
