"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { PieChart, Info } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface HealthProps {
  overStock?: number;
  underStock?: number;
  unBalanced?: number;
  unProcessed?: number;
}

export default function InventoryHealthChart({
  overStock = 0,
  underStock = 0,
  unBalanced = 0,
  unProcessed = 0,
}: HealthProps) {
  const total = overStock + underStock + unBalanced + unProcessed;
  const series = total === 0 ? [1] : [overStock, underStock, unBalanced, unProcessed];
  const labels = total === 0 
    ? ["No Data"] 
    : ["Overstock", "Understock", "Unbalanced", "Unprocessed"];

  const colors = total === 0 
    ? ["#E5E7EB"] 
    : ["#F59E0B", "#EF4444", "#8B5CF6", "#2957A5"];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    colors: colors,
    labels: labels,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Items",
              fontSize: "12px",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 500,
              color: "#6B7280",
              formatter: () => `${total}`,
            },
            value: {
              fontSize: "22px",
              fontWeight: 700,
              color: "#111827",
            },
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, w }) {
        const label = w.globals.labels[seriesIndex];
        const val = series[seriesIndex];
        const color = w.globals.colors[seriesIndex];
        return `
          <div style="padding: 6px 10px; font-size: 12px; font-weight: 600; color: #1f2937; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 6px;">
            <span style="background-color: ${color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
            <span>${label}: ${val} items</span>
          </div>
        `;
      },
    },
  };

  const calculatePct = (val: number) => {
    if (total === 0) return "0%";
    return `${Math.round((val / total) * 100)}%`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2957A5] dark:text-blue-400">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Komposisi Inventaris
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Distribusi status item gudang
              </p>
            </div>
          </div>
        </div>

        <div className="my-3 flex items-center justify-center">
          <ReactApexChart options={options} series={series} type="donut" height={220} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 text-[11px] truncate">Overstock</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white ml-2 text-[11px]">
            {calculatePct(overStock)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 text-[11px] truncate">Understock</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white ml-2 text-[11px]">
            {calculatePct(underStock)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 text-[11px] truncate">Unbalanced</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white ml-2 text-[11px]">
            {calculatePct(unBalanced)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-[#2957A5] shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 text-[11px] truncate">Unprocessed</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white ml-2 text-[11px]">
            {calculatePct(unProcessed)}
          </span>
        </div>
      </div>
    </div>
  );
}
