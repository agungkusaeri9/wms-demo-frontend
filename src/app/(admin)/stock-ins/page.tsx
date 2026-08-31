"use client"
import React, { Suspense, useState } from "react";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { dateFormat } from "@/utils/dateFormat";
import DataTable from "@/components/common/DataTable";
import { PurchaseOrder } from "@/types/purchaseOrder";
import StockInService from "@/services/StockInService";
import { StockIn } from "@/types/stockIn";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useFetchDataStock } from "@/hooks/useFetchDataStock";
import FilterStockIn from "@/components/pages/stock-in/FilterStockInOld";
import Loading from "@/components/common/Loading";
import ExportStockIn from "@/components/pages/stock-in/ExportStockIn";

function StockInList() {
    const [filter, setFilter] = useState({
        start_date: '',
        end_date: '',
        code: '',
    });
    const {
        data: stockIn,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataStock(StockInService.get, "stockIn", true, filter);

    const columns = [
        {
            header: 'Date',
            accessorKey: 'po_date',
            isNoWrap: true,
            cell: (item: StockIn) => dateFormat(item.created_at, 'DD MMM YYYY HH:mm')
        },
        {
            header: "Code",
            accessorKey: "kanban_code",
            isNoWrap: true
        },
        {
            header: "Rack",
            accessorKey: "rack",
            isNoWrap: true,
            cell: (item: StockIn) => item.kanban?.rack?.code || '-'
        },
        {
            header: "Description",
            accessorKey: "description",
            cell: (item: StockIn) => item.kanban?.description || '-'
        },
        {
            header: "Specification",
            accessorKey: "specification",
            cell: (item: StockIn) => item.kanban?.specification || '-'
        },
        {
            header: "Quantity",
            accessorKey: "quantity"
        },
        {
            header: "Operator",
            accessorKey: "operator",
            cell: (item: StockIn) => (
                item.operator?.name
            )
        },
        {
            header: 'Action',
            accessorKey: 'id',
            cell: (item: PurchaseOrder) => (
                <ButtonLink
                    href={`/stock-ins/${item.id}`}
                    variant='secondary'
                    size='xs'
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Show
                </ButtonLink>
            )
        }
    ];

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Stock In' }
                ]}
            />
            <div className="space-y-6">
                {/* <FilterStockIn filter={filter} setFilter={setFilter} /> */}
                <DataTable
                    title="Stock In History"
                    headerRight={
                        <>
                            <FilterStockIn filter={filter} setFilter={setFilter} />
                            <ExportStockIn filter={filter} />
                        </>
                    }
                    columns={columns}
                    data={stockIn || []}
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
            <StockInList />
        </Suspense>
    );
}
