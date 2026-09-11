"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Filter as FilterIcon, Calendar, Hash } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import DatePicker from "@/components/form/datePicker";
import InputLabel from "@/components/form/FormInput";
import Button from "@/components/ui/button/Button";
import { dateFormat } from "@/utils/dateFormat";

export interface ReceivingReportFilterForm {
  start_date: string;
  end_date: string;
  kanban: string;
}

interface FilterProps {
  filter: ReceivingReportFilterForm;
  setFilter: (filter: ReceivingReportFilterForm) => void;
}

export default function FilterReceivingReport({ filter, setFilter }: FilterProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<ReceivingReportFilterForm>({
    defaultValues: {
      start_date: filter.start_date || "",
      end_date: filter.end_date || "",
      kanban: filter.kanban || "",
    },
  });

  const [activeFilters, setActiveFilters] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const formValues = watch();
  useEffect(() => {
    let count = 0;
    if (formValues.start_date) count++;
    if (formValues.end_date) count++;
    if (formValues.kanban) count++;
    setActiveFilters(count);
  }, [formValues]);

  const onSubmit = (data: ReceivingReportFilterForm) => {
    setFilter(data);
    setIsOpen(false);
  };

  const handleReset = () => {
    reset({
      start_date: "",
      end_date: "",
      kanban: "",
    });
    setFilter({
      start_date: "",
      end_date: "",
      kanban: "",
    });
  };

  const removeFilter = (type: keyof ReceivingReportFilterForm) => {
    setValue(type, "");
    setFilter({
      ...filter,
      [type]: "",
    });
  };

  const handleDateChange = (selectedDates: Date[], dateStr: string, instance: any) => {
    const inputId = instance.element.id;
    if (inputId === "start_date") {
      setValue("start_date", dateStr);
    } else if (inputId === "end_date") {
      setValue("end_date", dateStr);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Active Filter Chips */}
      {filter.start_date && (
        <div className="flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
          <span>Start: {dateFormat(filter.start_date, "DD MMM YYYY")}</span>
          <button
            type="button"
            onClick={() => removeFilter("start_date")}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-1 font-bold"
          >
            ×
          </button>
        </div>
      )}
      {filter.end_date && (
        <div className="flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
          <span>End: {dateFormat(filter.end_date, "DD MMM YYYY")}</span>
          <button
            type="button"
            onClick={() => removeFilter("end_date")}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-1 font-bold"
          >
            ×
          </button>
        </div>
      )}
      {filter.kanban && (
        <div className="flex items-center gap-1 px-2.5 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">
          <span>Kanban: {filter.kanban}</span>
          <button
            type="button"
            onClick={() => removeFilter("kanban")}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-1 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Filter Button with Dropdown directly attached */}
      <div className="relative">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="flex items-center gap-2 relative dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FilterIcon className="w-4 h-4" />
          <span>Filter</span>
          {activeFilters > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full">
              {activeFilters}
            </span>
          )}
        </Button>

        {/* Dropdown Card */}
        <Dropdown
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="w-80 p-4 border border-gray-100 rounded-2xl shadow-xl dark:border-gray-800 dark:bg-gray-900 top-full mt-2 right-0"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Filter Receiving Reports</h3>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div>
              <InputLabel
                label="Kanban / Product Code"
                {...register("kanban")}
                placeholder="Cari kode atau nama barang..."
              />
            </div>

            <div className="space-y-3">
              <div>
                <DatePicker
                  id="start_date"
                  label="Start Date"
                  placeholder="Pilih tanggal mulai"
                  onChange={handleDateChange}
                  value={formValues.start_date}
                />
              </div>
              <div>
                <DatePicker
                  id="end_date"
                  label="End Date"
                  placeholder="Pilih tanggal akhir"
                  onChange={handleDateChange}
                  value={formValues.end_date}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" className="bg-[#107C41] hover:bg-[#0E6C38] text-white">
                Terapkan
              </Button>
            </div>
          </form>
        </Dropdown>
      </div>
    </div>
  );
}
