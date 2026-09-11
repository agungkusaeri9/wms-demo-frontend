import { Kanban } from "./kanban";
import { Operator } from "./operator";

export type StockIn = {
    id: number;
    kanban_code?: string;
    kanban: Kanban;
    quantity: number;
    operator?: Operator;
    created_at: string;
}