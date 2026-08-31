"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardService from "@/services/DashboardService";
import StockInService from "@/services/StockInService";
import StockOutService from "@/services/StockOutService";
import KanbanService from "@/services/KanbanService";
import PurchaseOrderService from "@/services/PurchaseOrderService";
import PurchaseRequestService from "@/services/PurchaseRequestService";

import DashboardHero from "@/components/Dashboard/DashboardHero";
import { EnhancedCardDashboard } from "@/components/Dashboard/EnhancedCardDashboard";
import StockInStockOutStatistic from "@/components/Dashboard/StockInStockOutStatistic";
import InventoryHealthChart from "@/components/Dashboard/InventoryHealthChart";
import RecentActivities from "@/components/Dashboard/RecentActivities";
import CriticalStockAlerts from "@/components/Dashboard/CriticalStockAlerts";
import FastMovingItems from "@/components/Dashboard/FastMovingItems";
import ProcurementSummary from "@/components/Dashboard/ProcurementSummary";
import QuickActions from "@/components/Dashboard/QuickActions";

export default function Dashboard() {
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await DashboardService.getDashboard();
      return response.data;
    },
    staleTime: 60000,
  });

  const { data: stockInsData } = useQuery({
    queryKey: ["recent-stock-ins"],
    queryFn: async () => {
      const response = await StockInService.get(1, 6);
      return response.data;
    },
    staleTime: 60000,
  });

  const { data: stockOutsData } = useQuery({
    queryKey: ["recent-stock-outs"],
    queryFn: async () => {
      const response = await StockOutService.get(1, 20);
      return response.data;
    },
    staleTime: 60000,
  });

  const { data: understockKanbans, isLoading: isCriticalLoading } = useQuery({
    queryKey: ["understock-kanbans"],
    queryFn: async () => {
      const response = await KanbanService.get(1, 6, "", null, null, null, "Understock");
      return response.data;
    },
    staleTime: 60000,
  });

  const { data: poData } = useQuery({
    queryKey: ["dashboard-po-total"],
    queryFn: async () => {
      const response = await PurchaseOrderService.get(1, 1);
      return response.pagination.total;
    },
    staleTime: 60000,
  });

  const { data: prData } = useQuery({
    queryKey: ["dashboard-pr-total"],
    queryFn: async () => {
      const response = await PurchaseRequestService.get(1, 1);
      return response.pagination.total;
    },
    staleTime: 60000,
  });

  return (
    <div className="space-y-6">
      {/* Welcome & Live Sync Hero */}
      <DashboardHero />

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnhancedCardDashboard
          title="Overstock Items"
          value={dashboard?.overStock || 0}
          type="overstock"
        />
        <EnhancedCardDashboard
          title="Understock Items"
          value={dashboard?.underStock || 0}
          type="understock"
        />
        <EnhancedCardDashboard
          title="Unbalanced Stock"
          value={dashboard?.unBalanced || 0}
          type="unbalanced"
        />
        <EnhancedCardDashboard
          title="Unprocessed Items"
          value={dashboard?.unProcessed || 0}
          type="unprocessed"
        />
      </div>

      {/* Analytics Charts (Stock Flow + Inventory Health Donut) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <StockInStockOutStatistic data={dashboard} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <InventoryHealthChart
            overStock={dashboard?.overStock}
            underStock={dashboard?.underStock}
            unBalanced={dashboard?.unBalanced}
            unProcessed={dashboard?.unProcessed}
          />
        </div>
      </div>

      {/* Top Consumed Spareparts & Procurement Status */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <FastMovingItems stockOuts={stockOutsData || []} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <ProcurementSummary
            poTotal={poData ?? 0}
            prTotal={prData ?? 0}
          />
        </div>
      </div>

      {/* Operations Activity & Critical Stock Alerts */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <RecentActivities
            stockIns={stockInsData || []}
            stockOuts={stockOutsData || []}
          />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <CriticalStockAlerts
            criticalItems={understockKanbans || []}
            isLoading={isCriticalLoading}
          />
        </div>
      </div>

      {/* Quick Navigation & Operational Modules */}
      <QuickActions />
    </div>
  );
}
