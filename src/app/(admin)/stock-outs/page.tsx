"use client"
import React, { Suspense, useState } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { dateFormat } from "@/utils/dateFormat";
import DataTable, { RowInfo } from "@/components/common/DataTable";
import StockOutService from "@/services/StockOutService";
import Breadcrumb from "@/components/common/Breadcrumb";
import { StockOut } from "@/types/stockOut";
import FilterStockOut from "@/components/pages/stock-out/FilterStockOut";
import { useFetchDataStockOut } from "@/hooks/useFetchDataStockOut";
import Loading from "@/components/common/Loading";
import ExportStockOut from "@/components/pages/stock-out/ExportStockOut";
import { Plus } from "lucide-react";

function StockOutList() {
    const [filter, setFilter] = useState({
        start_date: '',
        end_date: '',
        code: '',
        machine_id: null as number | null,
        machine_area_id: null as number | null,
        keyword: '',
        sub_machine_id: null as number | null
    });
    const {
        data: stockOut,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataStockOut(StockOutService.get, "stockOut", true, filter);

    const columns = [
        {
            header: 'Date',
            accessorKey: 'created_at',
            isNoWrap: true,
            cell: (item: StockOut, rowInfo?: RowInfo) => {
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
                            {dateFormat(item.created_at, 'DD MMM YYYY HH:mm')}
                        </span>
                    </div>
                );
            }
        },
        {
            header: "Code",
            accessorKey: "kanban_code",
            isNoWrap: true,
            cell: (item: StockOut) => item.kanban_code || item.kanban?.code || '-'
        },
        {
            header: "Rack",
            accessorKey: "rack",
            isNoWrap: true,
            cell: (item: StockOut) => item.kanban?.rack?.code || '-'
        },
        {
            header: "Description",
            accessorKey: "description",
            className: "max-w-[220px]",
            cell: (item: StockOut) => item.kanban?.description || '-'
        },
        {
            header: "Quantity",
            accessorKey: "quantity",
            cell: (item: StockOut) => item.quantity
        },
        {
            header: "Requester",
            accessorKey: "requester",
            isNoWrap: true,
            cell: (item: StockOut) => item.requester?.name || '-'
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (item: StockOut) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/stock-outs/${item.id}/edit`}
                        variant='info'
                        size='xs'
                    >
                        Edit
                    </ButtonLink>
                    <ButtonLink
                        href={`/stock-outs/${item.id}`}
                        variant='secondary'
                        size='xs'
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Show
                    </ButtonLink>
                </div>
            )
        }
    ];

    const renderExpandedDetails = (item: StockOut) => {
        return (
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all duration-300 transform">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#2957A5]" />
                    <span>Detail Informasi Stock Out: {item.kanban_code || item.kanban?.code}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Specification</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.kanban?.specification || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Area</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.machine_area?.name || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Machine</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">
                            {item.sub_machine ? item.sub_machine.code : (item.machine?.code || '-')}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Sub Machine</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.sub_machine?.name || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Maker</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.kanban?.maker?.name || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Operator</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.operator?.name || '-'}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Stock Out' }
                ]}
            />
            <div className="space-y-6">
                <DataTable
                    title="Stock Out History"
                    headerRight={
                        <>
                            <FilterStockOut filter={filter} setFilter={setFilter} />
                            <ExportStockOut filter={filter} />
                        </>
                    }
                    columns={columns}
                    expandable={{
                        hideActionColumn: true,
                        render: renderExpandedDetails,
                    }}
                    data={stockOut || []}
                    isLoading={isLoading}
                    pagination={pagination ? {
                        currentPage: pagination.curr_page,
                        totalPages: pagination.total_page,
                        totalItems: pagination.total,
                        itemsPerPage: limit,
                        onPageChange: setCurrentPage,
                        onLimitChange: setLimit
                    } : undefined}
                />
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <StockOutList />
        </Suspense>
    );
}
