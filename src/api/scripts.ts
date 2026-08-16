import type { Script, CreateScriptRequest, UpdateScriptRequest, ScriptPageResponse, ScriptSearchParams } from "../types/script";
import { get, post, put, del } from "./client";
import { mockScriptStore } from "./mock-store";

export const scriptApi = {
  getScripts: (page = 0, size = 20): Promise<ScriptPageResponse> => {
    return get<ScriptPageResponse>("/scripts", { page, size });
  },

  getScript: (id: number): Promise<Script> => {
    return get<Script>(`/scripts/${id}`);
  },

  searchScripts: (params: ScriptSearchParams): Promise<ScriptPageResponse> => {
    const { q = "", categoryId, page = 0, size = 20 } = params;
    return get<ScriptPageResponse>("/scripts/search", { q, categoryId, page, size });
  },

  createScript: (data: CreateScriptRequest): Promise<Script> => {
    return post<Script>("/scripts", data);
  },

  updateScript: (id: number, data: UpdateScriptRequest): Promise<Script> => {
    return put<Script>(`/scripts/${id}`, data);
  },

  deleteScript: (id: number): Promise<void> => {
    return del(`/scripts/${id}`);
  },
};
