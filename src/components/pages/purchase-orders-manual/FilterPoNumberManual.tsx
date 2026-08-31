import DatePicker from '@/components/form/datePicker'
import InputLabel from '@/components/form/FormInput'
import Button from '@/components/ui/button/Button'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { dateFormat } from '@/utils/dateFormat'
import { Dropdown } from '@/components/ui/dropdown/Dropdown'

interface FilterForm {
    pr_number: string;
    po_number: string;
    start_date: string;
    end_date: string;
    kanban: string;
}

const FilterPurchaseOrderManual = ({ filter, setFilter }: {
    filter: FilterForm,
    setFilter: (filter: FilterForm) => void
}) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm<FilterForm>({
        defaultValues: {
            pr_number: filter.pr_number || '',
            po_number: filter.po_number || '',
            start_date: filter.start_date || '',
            end_date: filter.end_date || '',
            kanban: filter.kanban || ''
        }
    });

    const [activeFilters, setActiveFilters] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const formValues = watch();
    useEffect(() => {
        let count = 0;
        if (formValues.pr_number) count++;
        if (formValues.po_number) count++;
        if (formValues.start_date) count++;
        if (formValues.end_date) count++;
        if (formValues.kanban) count++;
        setActiveFilters(count);
    }, [formValues]);

    const onSubmit = (data: FilterForm) => {
        setFilter(data);
        setIsOpen(false);
    };

    const handleReset = () => {
        reset();
        setFilter({
            pr_number: '',
            po_number: '',
            start_date: '',
            end_date: '',
            kanban: ''
        });
    };

    const removeFilter = (type: keyof FilterForm) => {
        setValue(type, '');
        setFilter({
            ...filter,
            [type]: '',
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDateChange = (selectedDates: Date[], dateStr: string, instance: any) => {
        const inputId = instance.element.id;
        if (inputId === 'start_date') {
            setValue('start_date', dateStr);
        } else if (inputId === 'end_date') {
            setValue('end_date', dateStr);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                {/* Active Filter Chips */}
                {filter.pr_number && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
                        <span>PR Number: {filter.pr_number}</span>
                        <button
                            onClick={() => removeFilter('pr_number')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}
                {filter.po_number && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
                        <span>PO Number: {filter.po_number}</span>
                        <button
                            onClick={() => removeFilter('po_number')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}
                {filter.start_date && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
                        <span>Start: {dateFormat(filter.start_date, 'DD MMM YYYY')}</span>
                        <button
                            onClick={() => removeFilter('start_date')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}
                {filter.end_date && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
                        <span>End: {dateFormat(filter.end_date, 'DD MMM YYYY')}</span>
                        <button
                            onClick={() => removeFilter('end_date')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}
                {filter.kanban && (
                    <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
                        <span>Kanban: {filter.kanban}</span>
                        <button
                            onClick={() => removeFilter('kanban')}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Filter Button with Dropdown */}
                <div className="relative">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2 relative dropdown-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                        Filter
                        {activeFilters > 0 && (
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
                                {activeFilters}
                            </span>
                        )}
                    </Button>
                    <Dropdown
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                    >
                        <div className="w-96 p-4">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-4">
                                    <InputLabel
                                        placeholder="PR Number"
                                        label="PR Number"
                                        name="pr_number"
                                        onChange={(e) => setValue('pr_number', e.target.value)}
                                        register={register("pr_number")}
                                    />
                                    <InputLabel
                                        placeholder="PO Number"
                                        label="PO Number"
                                        name="po_number"
                                        onChange={(e) => setValue('po_number', e.target.value)}
                                        register={register("po_number")}
                                    />
                                    <InputLabel
                                        placeholder="Kanban"
                                        label="Kanban"
                                        name="kanban"
                                        onChange={(e) => setValue('kanban', e.target.value)}
                                        register={register("kanban")}
                                    />
                                    <DatePicker
                                        placeholder='Start Date'
                                        label='Start Date'
                                        id='start_date'
                                        onChange={handleDateChange}
                                        mode='single'
                                        defaultDate={watch('start_date')}
                                    />
                                    <DatePicker
                                        placeholder='End Date'
                                        label='End Date'
                                        id='end_date'
                                        onChange={handleDateChange}
                                        mode='single'
                                        defaultDate={watch('end_date')}
                                    />
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            type="button"
                                            onClick={handleReset}
                                            size="xs"
                                            variant="outline"
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="xs"
                                            variant="primary"
                                        >
                                            Apply Filter
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default FilterPurchaseOrderManual
