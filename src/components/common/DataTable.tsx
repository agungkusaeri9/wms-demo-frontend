"use client"
import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, X } from "lucide-react";
import ComponentCard from "./ComponentCard";
import SkeletonTable from './SkeletonTable';

export interface RowInfo {
    isExpanded: boolean;
    toggleRow: () => void;
}

export interface Column {
    header: string;
    accessorKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell?: (info: any, rowInfo?: RowInfo) => React.ReactNode;
    className?: string;
    isNoWrap?: boolean;
}

export interface ExpandableConfig {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (item: any) => React.ReactNode;
    hideActionColumn?: boolean;
}

interface DataTableProps {
    title?: string;
    columns: Column[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    isLoading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        onPageChange: (page: number) => void;
        onLimitChange: (limit: number) => void;
    };
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    expandable?: ExpandableConfig;
    headerRight?: React.ReactNode;
}

export default function DataTable({
    title,
    columns,
    data,
    isLoading = false,
    pagination,
    search,
    headerRight,
    expandable
}: DataTableProps) {


    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [internalSearch, setInternalSearch] = useState(search?.value || "");

    React.useEffect(() => {
        setInternalSearch(search?.value || "");
    }, [search?.value]);

    const toggleRow = (index: number) => {
        setExpandedRows(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    return (
        <ComponentCard title={String(title)} className="w-full" headerRight={headerRight}>
            {isLoading ? (
                <SkeletonTable rows={5} columns={columns.length} />
            ) : (
                <>


                    <div className="mb-3 flex items-center justify-between">
                        {pagination && (
                            <div className="flex items-center gap-2">
                                <select
                                    className="h-9 bg-white rounded border font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    value={pagination.itemsPerPage}
                                    onChange={(e) => pagination.onLimitChange(e.target.value as unknown as number)}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={40}>40</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value={pagination.totalItems ? pagination.totalItems : 0}>All</option>
                                </select>
                                <span className="text-gray-500">entries</span>
                            </div>
                        )}
                        {search && (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={search.placeholder || "Search..."}
                                    className="h-9 rounded border border-gray-300 p-2 pr-8 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    value={internalSearch}
                                    onChange={(e) => setInternalSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            search.onChange(internalSearch);
                                        }
                                    }}
                                />
                                {internalSearch && (
                                    <button
                                        onClick={() => {
                                            setInternalSearch("");
                                            search.onChange("");
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/[0.05]">
                                <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        {expandable && !expandable.hideActionColumn && (
                                            <th className="w-20 px-3 py-3.5 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize whitespace-nowrap">
                                                Action
                                            </th>
                                        )}
                                        {columns.map((column, index) => (
                                            <th
                                                key={index}
                                                className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize whitespace-nowrap ${column.className || ''}`}
                                                onClick={() => handleSort(column.accessorKey)}
                                            >
                                                <div className="flex items-center gap-1 cursor-pointer select-none">
                                                    <span>{column.header}</span>
                                                    {sortConfig?.key === column.accessorKey && (
                                                        sortConfig.direction === 'asc' ?
                                                            <ChevronUp className="h-4 w-4 text-brand-500 shrink-0" /> :
                                                            <ChevronDown className="h-4 w-4 text-brand-500 shrink-0" />
                                                    )}
                                                    {sortConfig?.key !== column.accessorKey && (
                                                        <ChevronsUpDown className="h-4 w-4 text-gray-400 opacity-60 shrink-0" />
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-white/[0.05] dark:bg-white/[0.03]">
                                        {sortedData.length === 0 ? (
                                            <tr>
                                                <td colSpan={columns.length + (expandable && !expandable.hideActionColumn ? 1 : 0)} className="px-3 py-[5px] text-center text-sm text-gray-500 dark:text-gray-400">
                                                    No results found.
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedData.map((item, index) => {
                                                const isExpanded = expandedRows.includes(index);
                                                const rowInfo: RowInfo = {
                                                    isExpanded,
                                                    toggleRow: () => toggleRow(index)
                                                };

                                                return (
                                                    <React.Fragment key={index}>
                                                        <tr
                                                            onClick={() => {
                                                                if (expandable) {
                                                                    toggleRow(index);
                                                                }
                                                            }}
                                                            className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${
                                                                expandable ? "cursor-pointer" : ""
                                                            }`}
                                                        >
                                                            {expandable && !expandable.hideActionColumn && (
                                                                <td className="px-3 py-[5px] text-center">
                                                                    <button
                                                                        onClick={() => toggleRow(index)}
                                                                        className="inline-flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
                                                                        title={isExpanded ? "Hide details" : "Show details"}
                                                                    >
                                                                        {isExpanded ? (
                                                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                                                        ) : (
                                                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                                                        )}
                                                                    </button>
                                                                </td>
                                                            )}
                                                            {columns.map((column, colIndex) => (
                                                                <td key={colIndex} className={`px-3 py-[5px] text-sm text-gray-500 dark:text-gray-400  ${column.isNoWrap ? "whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]" : "whitespace-normal"} ${column.className || ''}`}>
                                                                    {column.cell ? column.cell(item, rowInfo) : item[column.accessorKey]}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        {expandable && isExpanded && (
                                                            <tr className="bg-blue-50/40 dark:bg-white/[0.02] border-t border-b border-blue-100 dark:border-white/[0.05]">
                                                                <td colSpan={columns.length + (expandable && !expandable.hideActionColumn ? 1 : 0)} className="px-4 py-3">
                                                                    {expandable.render(item)}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    {pagination && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} entries
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] text-sm"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    {pagination.currentPage > 3 && <span className="px-2">...</span>}
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            if (pagination.totalPages <= 5) return true;
                                            if (page === 1 || page === pagination.totalPages) return true;
                                            return Math.abs(page - pagination.currentPage) <= 1;
                                        })
                                        .map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => pagination.onPageChange(page)}
                                                className={`px-4 py-2 rounded ${pagination.currentPage === page
                                                    ? 'bg-brand-500 text-white'
                                                    : 'text-gray-700 dark:text-gray-400'
                                                    } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    {pagination.currentPage < pagination.totalPages - 2 && <span className="px-2">...</span>}
                                </div>
                                <button
                                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage >= pagination.totalPages}
                                    className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </ComponentCard>
    );
} 