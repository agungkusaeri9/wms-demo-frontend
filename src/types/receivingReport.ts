import { Kanban } from "./kanban";

export interface ReceivingReport {
  id: number;
  kanban_code: string | null;
  received_quantity: number;
  created_at: string;
  updated_at: string;
  Kanban?: Kanban | null;
}
