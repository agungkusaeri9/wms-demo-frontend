import { Machine } from "./machine";

export type SubMachine = {
    id: number;
    code: string;
    name?: string;
    machine: Machine;
}