import { FetchFunctionWithPagination, PaginatedResponse } from "@/types/fetch";
import { ReceivingReport } from "@/types/receivingReport";
import api from "@/utils/api";

const get = async (
  page = 1,
  limit = 10,
  start_date?: string,
  end_date?: string,
  keyword?: string,
  kanban?: string
): Promise<PaginatedResponse<ReceivingReport>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
  };

  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (keyword) params.keyword = keyword;
  if (kanban) params.kanban = kanban;

  const response = await api.get<PaginatedResponse<ReceivingReport>>("receiving-reports", { params });
  return response.data;
};

const getById = async (id: number): Promise<{ data: ReceivingReport }> => {
  const response = await api.get<{ data: ReceivingReport }>(`receiving-reports/${id}`);
  return response.data;
};

const importExcel = async (data: { file: string; filename: string }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await api.post<any>("receiving-reports/import", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const downloadTemplate = async () => {
  try {
    const response = await api.get("receiving-reports/template", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "TemplateReceivingReport.xlsb");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};

const getNextSequence = async (date?: string) => {
  try {
    const response = await api.get<{
      data: {
        date: string;
        dateFormatted: string;
        sequence: number;
        filename: string;
      };
    }>("receiving-reports/next-sequence", {
      params: date ? { date } : undefined,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ReceivingReportService = { get, getById, importExcel, downloadTemplate, getNextSequence };
export default ReceivingReportService;
