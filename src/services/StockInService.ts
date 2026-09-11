import { FetchFunctionWithPagination, PaginatedResponse } from "@/types/fetch";
import { StockIn } from "@/types/stockIn";
import api from "@/utils/api";

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

const get = async (
  page = 1,
  limit = 10,
  start_date?: string,
  end_date?: string,
  keyword?: string
): Promise<PaginatedResponse<StockIn>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
  };
  
  if (start_date)  params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (keyword) params.keyword = keyword;

  const response = await api.get<PaginatedResponse<StockIn>>("stock-ins", { params });
  return response.data;
};


const getById = async (
  id:number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await api.get<PaginatedResponse<StockIn>>(`stock-ins/${id}`);
  return response.data;
};

const exportExcel = async (
  start_date?: string,
  end_date?: string,
  keyword?: string
): Promise<Blob> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
  };
  
  if (start_date)  params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (keyword) params.keyword = keyword;

  const response = await api.get("stock-ins/export/excel", { 
    params,
    responseType: 'blob'
  });
  return response.data;
};


const StockInService = { get, getById, exportExcel };
export default StockInService;