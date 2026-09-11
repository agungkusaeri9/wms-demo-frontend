import api from "@/utils/api";
import { ApiResponse } from "@/types/fetch";

export interface ResetOptions {
  purchase_orders?: boolean;
  purchase_requests?: boolean;
  manual_purchase_orders?: boolean;
  stock_ins?: boolean;
  stock_outs?: boolean;
  receiving_reports?: boolean;
  processed_files?: boolean;
  reset_kanban_balances?: boolean;
}

export interface ResetSummary {
  stock_out_change_logs?: number;
  stock_outs?: number;
  stock_ins?: number;
  receiving_reports?: number;
  manual_purchase_orders?: number;
  stock_order_kanbans?: number;
  purchase_order_details?: number;
  purchase_orders?: number;
  purchase_order_detail_staggings?: number;
  purchase_order_staggings?: number;
  kanban_staggings?: number;
  purchase_request_details?: number;
  purchase_requests?: number;
  processed_files?: number;
  kanban_balances_reset?: number;
}

const resetAll = async (): Promise<ApiResponse<ResetSummary>> => {
  const response = await api.post<ApiResponse<ResetSummary>>("/reset/all");
  return response.data;
};

const resetData = async (
  options: ResetOptions = {}
): Promise<ApiResponse<ResetSummary>> => {
  const response = await api.post<ApiResponse<ResetSummary>>(
    "/reset-data",
    options
  );
  return response.data;
};

const resetPurchaseOrders = async (): Promise<ApiResponse<ResetSummary>> => {
  const response = await api.post<ApiResponse<ResetSummary>>(
    "/reset/purchase-orders"
  );
  return response.data;
};

const resetPurchaseRequests = async (): Promise<ApiResponse<ResetSummary>> => {
  const response = await api.post<ApiResponse<ResetSummary>>(
    "/reset/purchase-requests"
  );
  return response.data;
};

const resetManualPurchaseOrders = async (): Promise<
  ApiResponse<ResetSummary>
> => {
  const response = await api.post<ApiResponse<ResetSummary>>(
    "/reset/manual-purchase-orders"
  );
  return response.data;
};

const resetStockIn = async (): Promise<ApiResponse<ResetSummary>> => {
  const response = await api.post<ApiResponse<ResetSummary>>("/reset/stock-in");
  return response.data;
};

const resetStockOut = async (): Promise<ApiResponse<ResetSummary>> => {
  const response = await api.post<ApiResponse<ResetSummary>>("/reset/stock-out");
  return response.data;
};

export interface StockCountersRequest {
  kanban_code?: string;
  stock_in_quantity?: number;
  incoming_order_stock?: number;
  items?: Array<{
    kanban_code: string;
    stock_in_quantity?: number;
    incoming_order_stock?: number;
  }>;
  auto_populate?: boolean;
  limit?: number;
}

export interface StockCountersResponse {
  updated_count: number;
  items: Array<{
    code: string;
    stock_in_quantity: number;
    incoming_order_stock: number;
    balance?: number;
  }>;
}

const updateStockCounters = async (
  payload: StockCountersRequest
): Promise<ApiResponse<StockCountersResponse>> => {
  const response = await api.post<ApiResponse<StockCountersResponse>>(
    "/kanbans/stock-counters",
    payload
  );
  return response.data;
};

export interface FullFlowSimulationResponse {
  pr_number: string;
  po_number: string;
  total_items: number;
  items: Array<{
    code: string;
    description: string;
    po_quantity: number;
    stock_in_quantity: number;
    balance: number;
  }>;
}

const simulateFullFlow = async (): Promise<
  ApiResponse<FullFlowSimulationResponse>
> => {
  const response = await api.post<ApiResponse<FullFlowSimulationResponse>>(
    "/simulation/full-flow"
  );
  return response.data;
};

const DevModeService = {
  resetAll,
  resetData,
  resetPurchaseOrders,
  resetPurchaseRequests,
  resetManualPurchaseOrders,
  resetStockIn,
  resetStockOut,
  updateStockCounters,
  simulateFullFlow,
};

export default DevModeService;
