import type { Category } from "./category";

export type ScriptStatus = "DRAFT" | "READY" | "PUBLISHED" | "ARCHIVED";

export interface Script {
  id: number;
  title: string;
  scriptText: string;
  category: Category | null;
  status: ScriptStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScriptRequest {
  title: string;
  scriptText: string;
  categoryId: number | null;
  status: ScriptStatus;
}

export interface UpdateScriptRequest {
  title: string;
  scriptText: string;
  categoryId: number | null;
  status: ScriptStatus;
}

export interface ScriptPageResponse {
  content: Script[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ScriptSearchParams {
  q?: string;
  categoryId?: number;
  page?: number;
  size?: number;
}
