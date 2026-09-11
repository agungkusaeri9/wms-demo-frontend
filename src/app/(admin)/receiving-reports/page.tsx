"use client";
import React, { Suspense, useState } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { dateFormat } from "@/utils/dateFormat";
import DataTable from "@/components/common/DataTable";
import Breadcrumb from "@/components/common/Breadcrumb";
import Loading from "@/components/common/Loading";
import ReceivingReportService from "@/services/ReceivingReportService";
import { ReceivingReport } from "@/types/receivingReport";
import { useFetchDataReceivingReport } from "@/hooks/useFetchDataReceivingReport";
import FilterReceivingReport, { ReceivingReportFilterForm } from "@/components/pages/receiving-reports/Filter";
import ImportReceivingReportModal from "@/components/pages/receiving-reports/ImportModal";
import { ClipboardCheck, PackageCheck, Eye } from "lucide-react";

function ReceivingReportList() {
  const [filter, setFilter] = useState<ReceivingReportFilterForm>({
    start_date: "",
    end_date: "",
    kanban: "",
  });

  const {
    data: reports,
    isLoading,
    setCurrentPage,
    setLimit,
    limit,
    pagination,
  } = useFetchDataReceivingReport(
    ReceivingReportService.get,
    "receivingReports",
    true,
    filter
  );

  const columns = [
    {
      header: "Date & Time",
      accessorKey: "created_at",
      isNoWrap: true,
      cell: (item: ReceivingReport) => (
        <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
          {dateFormat(item.created_at, "DD MMM YYYY HH:mm")}
        </span>
      ),
    },
    {
      header: "Product Code",
      accessorKey: "kanban_code",
      isNoWrap: true,
      cell: (item: ReceivingReport) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-xs font-semibold bg-emerald-50 text-[#107C41] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
          {item.kanban_code || "-"}
        </span>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (item: ReceivingReport) => (
        <span className="font-medium text-gray-900 dark:text-white line-clamp-2">
          {item.Kanban?.description || "-"}
        </span>
      ),
    },
    {
      header: "Specification",
      accessorKey: "specification",
      cell: (item: ReceivingReport) => (
        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
          {item.Kanban?.specification || "-"}
        </span>
      ),
    },
    {
      header: "Rack",
      accessorKey: "rack",
      isNoWrap: true,
      cell: (item: ReceivingReport) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 font-mono text-gray-700 dark:text-gray-300">
          {item.Kanban?.rack?.code || "-"}
        </span>
      ),
    },
    {
      header: "Received Qty",
      accessorKey: "received_quantity",
      isNoWrap: true,
      cell: (item: ReceivingReport) => (
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 text-sm">
          +{item.received_quantity.toLocaleString()}
        </span>
      ),
    },
    {
      header: "UOM",
      accessorKey: "uom",
      isNoWrap: true,
      cell: (item: ReceivingReport) => (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {item.Kanban?.uom || "Pcs"}
        </span>
      ),
    },
    {
      header: "Action",
      accessorKey: "id",
      isNoWrap: true,
      cell: (item: ReceivingReport) => (
        <ButtonLink
          href={`/receiving-reports/${item.id}`}
          variant="secondary"
          size="xs"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Detail</span>
        </ButtonLink>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Receiving Reports" },
        ]}
      />

      <DataTable
        title="Receiving Reports History"
        headerRight={
          <div className="flex items-center gap-2">
            <FilterReceivingReport filter={filter} setFilter={setFilter} />
            <ImportReceivingReportModal />
          </div>
        }
        columns={columns}
        data={reports || []}
        isLoading={isLoading}
        pagination={
          pagination
            ? {
                currentPage: pagination.curr_page,
                totalPages: pagination.total_page,
                totalItems: pagination.total,
                itemsPerPage: limit,
                onPageChange: setCurrentPage,
                onLimitChange: setLimit,
              }
            : undefined
        }
      />
    </div>
  );
}

export default function ReceivingReportsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ReceivingReportList />
    </Suspense>
  );
}
