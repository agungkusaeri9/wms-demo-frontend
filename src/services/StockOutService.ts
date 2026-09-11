import { FetchFunctionWithPagination, PaginatedResponse } from "@/types/fetch";
import { StockOut } from "@/types/stockOut";
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
  code?: string,
  machine_id?: number | null,
  machine_area_id?: number | null,
  sub_machine_id?: number | null
): Promise<PaginatedResponse<StockOut>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    page,
    limit,
    paginate: true,
  };
  
  if (start_date)  params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (code) params.keyword = code;
  if (machine_id) params.machine_id = machine_id;
  if (machine_area_id) params.machine_area_id = machine_area_id;
  if (sub_machine_id) params.sub_machine_id = sub_machine_id;
  const response = await api.get<PaginatedResponse<StockOut>>("stock-outs", { params });
  return response.data;
};

const getById = async (
  id:number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await api.get<PaginatedResponse<StockOut>>(`stock-outs/${id}`);
  return response.data;
};


const exportExcel = async (
  code?: string,
  start_date?: string,
  end_date?: string,
  machine_id?: number,
  machine_area_id?: number,
  sub_machine_id?: number
): Promise<Blob> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
  };
  
  if (start_date)  params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (code) params.keyword = code;
  if (machine_id) params.machine_id = machine_id;
  if (machine_area_id) params.machine_area_id = machine_area_id;
  if (sub_machine_id) params.sub_machine_id = sub_machine_id;

  const response = await api.get("stock-outs/export/excel", { 
    params,
    responseType: 'blob'
  });
  return response.data;
};

const update = async (id: number, data: {
  quantity:number
}) => {
  try {
    const response = await api.patch(`stock-outs/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const StockOutService = { get, getById,exportExcel, update } ;
export default StockOutService;