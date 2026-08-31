"use client"
import React, { Suspense, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { dateFormat } from "@/utils/dateFormat";
import DataTable, { RowInfo } from "@/components/common/DataTable";
import Loading from "@/components/common/Loading";
import FilterPurchaseOrderManual from "@/components/pages/purchase-orders-manual/FilterPoNumberManual";
import ManualPurchaseOrderService from "@/services/ManualPurchaseOrderService";
import { ManualPurchaseOrder } from "@/types/manualPurchaseOrder";
import { useFetchDataManualPurchaseOrder } from "@/hooks/useFetchDataManualPO";
import { Plus } from "lucide-react";

function PoList() {
    const [filter, setFilter] = useState({
        pr_number: '',
        po_number: '',
        start_date: '',
        end_date: '',
        kanban: ''
    });

    const {
        data: manualPurchaseOrders,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataManualPurchaseOrder(ManualPurchaseOrderService.get, "manualPurchaseOrders", true, filter);

    const columns = [
        {
            header: 'Date',
            accessorKey: 'date',
            isNoWrap: true,
            cell: (item: ManualPurchaseOrder, rowInfo?: RowInfo) => {
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
                            {dateFormat(item.date, "DD MMM YYYY")}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'PO. Number',
            accessorKey: 'po_number',
            isNoWrap: true
        },
        {
            header: 'PR. Number',
            accessorKey: 'pr_number',
            isNoWrap: true,
            cell: (item: ManualPurchaseOrder) => item.pr_number || '-'
        },
        {
            header: 'Kanban Code',
            accessorKey: 'kanban_code',
            isNoWrap: true
        },
        {
            header: 'Kanban Desc',
            accessorKey: 'kanban_description',
            className: 'max-w-[220px]',
            cell: (item: ManualPurchaseOrder) => item.kanban_description || '-'
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
            cell: (item: ManualPurchaseOrder) => item.quantity
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (item: ManualPurchaseOrder) => (
                <ButtonLink
                    href={`/manual-purchase-orders/${item.id}`}
                    variant='secondary'
                    size='xs'
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Show
                </ButtonLink>
            )
        }
    ];

    const renderExpandedDetails = (item: ManualPurchaseOrder) => {
        return (
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all duration-300 transform">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#2957A5]" />
                    <span>Detail Manual PO: {item.po_number} ({item.kanban_code})</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Specification</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.kanban_specification || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">PR Number</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.pr_number || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Remark / Catatan</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.remark || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Tanggal PO</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{dateFormat(item.date, "DD MMMM YYYY")}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Manual Purchase Order" />
            <div className="space-y-6">
                <DataTable
                    title="Manual Purchase Order History"
                    columns={columns}
                    expandable={{
                        hideActionColumn: true,
                        render: renderExpandedDetails,
                    }}
                    headerRight={
                        <div className="flex items-center gap-2">
                            <ButtonLink size='sm' href="/manual-purchase-orders/create" className="whitespace-nowrap">
                                Create Manual PO
                            </ButtonLink>
                            <FilterPurchaseOrderManual filter={filter} setFilter={setFilter} />
                        </div>
                    }
                    data={manualPurchaseOrders || []}
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
            <PoList />
        </Suspense>
    );
}
