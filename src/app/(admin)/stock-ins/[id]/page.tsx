"use client"
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { useParams } from "next/navigation";
import { useFetchById } from "@/hooks/useFetchDetailData";
import Breadcrumb from "@/components/common/Breadcrumb";
import { dateFormat } from "@/utils/dateFormat";
import StockInService from "@/services/StockInService";
import { StockIn } from "@/types/stockIn";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const { data: stockIn } = useFetchById<StockIn>(StockInService.getById, Number(id), "stockIn");

    if (!stockIn) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );


    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Stock In', href: '/stock-ins' },
                    { label: 'Detail' }
                ]}
            />

            <div className="grid gap-6">
                <ComponentCard title="Stock In Detail" className="w-full">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Date
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {dateFormat(stockIn?.created_at, 'DD MMM YYYY HH:mm')}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Kanban Number
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {stockIn?.kanban?.code}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Quantity
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {stockIn?.quantity}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Unit
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {stockIn?.kanban?.uom}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Specification
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {stockIn.kanban?.specification}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Description
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {stockIn?.kanban?.description}
                                    </div>
                                </div>

                            </div>


                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Operator
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {stockIn?.operator?.name}
                                </div>
                            </div>
                        </div>

                    </div>
                </ComponentCard>
            </div>
        </div>
    );
}
