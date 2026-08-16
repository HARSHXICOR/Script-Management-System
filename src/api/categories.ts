import type { Category } from "../types/category";
import { get, post, put, del } from "./client";
import { mockCategoryStore } from "./mock-store";

export const categoryApi = {
  getCategories: (): Promise<Category[]> => {
    return get<Category[]>("/categories");
  },

  createCategory: (name: string): Promise<Category> => {
    return post<Category>("/categories", { name });
  },

  updateCategory: (id: number, name: string): Promise<Category> => {
    return put<Category>(`/categories/${id}`, { name });
  },

  deleteCategory: (id: number): Promise<void> => {
    return del(`/categories/${id}`);
  },
};
