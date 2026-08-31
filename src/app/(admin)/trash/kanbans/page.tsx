"use client";
import React, { Suspense, useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import KanbanService from "@/services/KanbanService";
import ButtonLink from "@/components/ui/button/ButtonLink";
import { Kanban } from "@/types/kanban";
import DataTable, { RowInfo } from "@/components/common/DataTable";
import { useFetchDataKanban } from "@/hooks/useFetchDataKanban";
import Loading from "@/components/common/Loading";
import { useDeleteData } from "@/hooks/useDeleteData";
import { confirmDelete } from "@/utils/confirm";
import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";

function KanbanTrashList() {
    const [filter] = useState({
        machine_id: null as number | null,
        machine_area_id: null as number | null,
        rack_id: null as number | null,
        keyword: "",
        status: null as string | null,
        completed_status: null as string | null
    });
    const { mutate: restore } = useDeleteData(KanbanService.restore, ["kanbans"]);
    const handleRestore = async (id: number) => {
        const confirmed = await confirmDelete("Are you sure?", "Data cannot be restored!", "Yes, Restore!");
        if (confirmed) {
            restore(id);
        }
    };

    const {
        data: kanbans,
        isLoading,
        setCurrentPage,
        setLimit,
        limit,
        pagination
    } = useFetchDataKanban(KanbanService.getTrash, "kanbans", true, filter);

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
            accessorKey: "rack",
            isNoWrap: true,
            cell: (item: Kanban) => item.rack?.code || '-'
        },
        {
            header: "Description",
            accessorKey: "description",
            className: "max-w-[220px]",
            cell: (item: Kanban) => item.description || '-'
        },
        {
            header: "Min Qty",
            accessorKey: "min_quantity",
            cell: (item: Kanban) => item.min_quantity ?? '-'
        },
        {
            header: "Max Qty",
            accessorKey: "max_quantity",
            cell: (item: Kanban) => item.max_quantity ?? '-'
        },
        {
            header: "Is Completed",
            accessorKey: "is_completed",
            cell: (item: Kanban) => {
                if (item.is_completed == false)
                    return <div className="text-red-700 text-xs text-center w-full bg-red-100 rounded-md px-2 py-1 dark:bg-red-800/20 dark:text-red-400">Uncompleted</div>
                else
                    return <div className="text-green-700 text-xs text-center w-full bg-green-100 rounded-md px-2 py-1 dark:bg-green-800/20 dark:text-green-400">Completed</div>
            }
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: (item: Kanban) => (
                <div className="flex items-center gap-2">
                    <ButtonLink
                        href={`/trash/kanbans/${item.id}`}
                        variant='secondary'
                        size='xs'
                    >
                        Show
                    </ButtonLink>
                    <Button
                        onClick={() => handleRestore(item.id)}
                        variant='danger'
                        size='xs'
                    >
                        Restore
                    </Button>
                </div>
            ),
        },
    ];

    const renderExpandedDetails = (item: Kanban) => {
        return (
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all duration-300 transform">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#2957A5]" />
                    <span>Detail Informasi Kanban Trash: {item.code}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Specification</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.specification || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Area</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.machine_area?.name || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Machine</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.machine?.code || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Supplier</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.supplier?.name || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Maker</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.maker?.name || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Lead Time</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.lead_time ? `${item.lead_time} days` : '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">Order Point</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.order_point ?? '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 block font-medium">UOM / Unit</span>
                        <span className="text-gray-900 dark:text-gray-100 font-semibold">{item.uom || '-'}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Breadcrumb items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Trash', href: '#' },
                { label: 'Kanbans', href: '/trash/kanbans' }
            ]} />
            <div className="space-y-6">
                <DataTable
                    title="Kanban Trash List"
                    columns={columns}
                    expandable={{
                        hideActionColumn: true,
                        render: renderExpandedDetails,
                    }}
                    data={kanbans || []}
                    isLoading={isLoading}
                    pagination={{
                        currentPage: pagination?.curr_page || 1,
                        totalPages: pagination?.total_page || 1,
                        totalItems: pagination?.total || 0,
                        itemsPerPage: limit,
                        onPageChange: setCurrentPage,
                        onLimitChange: setLimit,
                    }}
                />
            </div>
        </div>
    );
}
export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <KanbanTrashList />
        </Suspense>
    );
}
