"use client";
import React, { Suspense, useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import KanbanService from "@/services/KanbanService";
import { Kanban } from "@/types/kanban";
import DataTable, { RowInfo } from "@/components/common/DataTable";
import Loading from "@/components/common/Loading";
import FilterBalance from "@/components/pages/balance/FilterBalance";
import { useFetchDataBalance } from "@/hooks/useFetchDataBalance";
import ExportBalance from "@/components/pages/balance/exportBalance";

import { Plus } from "lucide-react";

function BalanceList() {
    const [filter, setFilter] = useState({
        machine_id: null as number | null,
        machine_area_id: null as number | null,
        rack_id: null as number | null,
        keyword: "",
        status: null as string | null,
        js_balance_status: ""
    });
    const {
        data: kanbans,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataBalance(KanbanService.get, "kanbans", true, filter);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Overstock":
                return {
                    text: "text-red-700",
                    bg: "bg-red-100",
                    darkText: "dark:text-red-400",
                    darkBg: "dark:bg-red-800/20",
                };
            case "Understock":
                return {
                    text: "text-yellow-700",
                    bg: "bg-yellow-100",
                    darkText: "dark:text-yellow-400",
                    darkBg: "dark:bg-yellow-800/20",
                };
            case "Normal":
                return {
                    text: "text-green-700",
                    bg: "bg-green-100",
                    darkText: "dark:text-green-400",
                    darkBg: "dark:bg-green-800/20",
                };
            default:
                return {
                    text: "text-slate-600",
                    bg: "bg-slate-100",
                    darkText: "dark:text-slate-300",
                    darkBg: "dark:bg-slate-800/20",
                };
        }
    };

    const renderStatus = (status: string) => {
        const { text, bg, darkText, darkBg } = getStatusStyle(status);

        return (
            <div className={`${text} text-xs text-center w-full ${bg} rounded-md px-2 py-1 ${darkBg} ${darkText} capitalize font-medium`}>
                {status || "Uncompleted"}
            </div>
        );
    };

    const columns = [
        {
            header: "Code",
            accessorKey: "code",
            isNoWrap: true,
            cell: (item: Kanban, rowInfo?: RowInfo) => {
                const isExpanded = rowInfo?.isExpanded;
                return (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                rowInfo?.toggleRow();
                            }}
                            className={`inline-flex items-center justify-center w-4 h-4 rounded-full transition-all duration-200 cursor-pointer select-none shrink-0 text-white shadow-xs ${
                                isExpanded
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-[#2957A5] hover:bg-[#1B3D78]"
                            }`}
                            title={isExpanded ? "Collapse details" : "Expand details"}
                        >
                            <Plus
                                strokeWidth={3}
                                className={`w-2.5 h-2.5 transition-transform duration-300 ease-out ${
                                    isExpanded ? "rotate-45" : "rotate-0"
                                }`}
                            />
                        </button>
                        <span className="whitespace-nowrap">
                            {item.code}
                        </span>
                    </div>
                );
            }
        },
        {
            header: "Rack",
            accessorKey: "rack_code",
            isNoWrap: true,
            cell: (item: Kanban) => item.rack?.code || '-'
        },
        {
            header: "Description",
            accessorKey: "description",
            className: "max-w-[220px]"
        },
        {
            header: "Stock In Qty.",
            accessorKey: "stock_in_quantity",
            cell: (item: Kanban) => item.stock_in_quantity ?? 0
        },
        {
            header: "Total Stock Out Qty.",
            accessorKey: "total_stock_out_quantity",
            cell: (item: Kanban) => item.total_stock_out_quantity ?? 0
        },
        {
            header: "Balance",
            accessorKey: "balance",
            cell: (item: Kanban) => item.balance ?? 0
        },
        {
            header: "JS Ending Qty",
            accessorKey: "js_ending_quantity",
            cell: (item: Kanban) => {
                const balance = Number(item.balance || 0);
                const js_ending_quantity = Number(item.js_ending_quantity || 0);
                if (balance !== js_ending_quantity) {
                    return (
                        <div className="text-red-700 text-xs text-center w-full bg-red-100 rounded-md px-2 py-1 dark:bg-red-800/20 dark:text-red-400 font-medium">
                            {js_ending_quantity}
                        </div>
                    );
                } else {
                    return (
                        <div className="text-xs text-center w-full bg-green-50 text-green-700 rounded-md px-2 py-1 dark:bg-green-800/20 dark:text-green-400 font-medium">
                            {js_ending_quantity}
                        </div>
                    );
                }
            }
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (item: Kanban) => {
                const status = item.stock_status || "Uncompleted";
                return renderStatus(status);
            }
        }
    ];

    const renderExpandedDetails = (item: Kanban) => {
        return (
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all duration-300 transform">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#2957A5]" />
                    <span>Detail Informasi Item: {item.code}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                    <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-400 block text-[11px]">Specification</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200 break-words">
                            {item.specification || "-"}
                        </span>
                    </div>

                    <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-400 block text-[11px]">Area</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.machine_area?.name || "-"}
                        </span>
                    </div>

                    <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-400 block text-[11px]">Machine</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.machine?.code || "-"}
                        </span>
                    </div>

                    <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-400 block text-[11px]">Min. Quantity</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.min_quantity ?? "-"} {item.uom || ""}
                        </span>
                    </div>

                    <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-400 block text-[11px]">Max. Quantity</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.max_quantity ?? "-"} {item.uom || ""}
                        </span>
                    </div>

                    <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-400 block text-[11px]">Ordered Stock</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {item.incoming_order_stock ?? 0}
                        </span>
                    </div>

                    {item.supplier && (
                        <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                            <span className="text-gray-400 block text-[11px]">Supplier</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {item.supplier?.name || "-"}
                            </span>
                        </div>
                    )}

                    {item.maker && (
                        <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                            <span className="text-gray-400 block text-[11px]">Maker</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {item.maker?.name || "-"}
                            </span>
                        </div>
                    )}

                    {item.lead_time !== undefined && (
                        <div className="bg-gray-50/80 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                            <span className="text-gray-400 block text-[11px]">Lead Time</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {item.lead_time} hari
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <Breadcrumb items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Balance', href: '/balance' }
            ]} />
            <div className="space-y-6">
                <DataTable
                    title="Balance"
                    columns={columns}
                    data={kanbans || []}
                    expandable={{
                        hideActionColumn: true,
                        render: renderExpandedDetails
                    }}
                    headerRight={
                        <>
                            <FilterBalance filter={filter} setFilter={setFilter} />
                            <ExportBalance filter={filter} />
                        </>
                    }
                    isLoading={isLoading}
                    pagination={{
                        currentPage: pagination?.curr_page || 1,
                        totalPages: pagination?.total_page || 1,
                        totalItems: pagination?.total || 0,
                        itemsPerPage: limit,
                        onPageChange: setCurrentPage,
                        onLimitChange: setLimit,
                    }}
                    search={{
                        value: filter.keyword,
                        onChange: (value) => setFilter({ ...filter, keyword: value }),
                        placeholder: 'Search keyword...'
                    }}
                />
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <BalanceList />
        </Suspense>
    );
}
