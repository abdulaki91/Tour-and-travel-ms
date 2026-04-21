import api from "./api";
import type { User, Company, ApiResponse, PaginatedResponse } from "../types";

export interface AdminStats {
  total_users: number;
  total_companies: number;
  total_packages: number;
  total_bookings: number;
  total_revenue: number;
  pending_companies: number;
  active_packages: number;
  recent_bookings: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  sort_by?: "created_at" | "name" | "email";
  sort_order?: "asc" | "desc";
}

export interface CompanyFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  is_verified?: boolean;
  sort_by?: "created_at" | "company_name";
  sort_order?: "asc" | "desc";
}

export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  async updateUserStatus(
    userId: number,
    is_active: boolean,
  ): Promise<ApiResponse<User>> {
    const response = await api.patch(`/admin/users/${userId}/status`, {
      is_active,
    });
    return response.data;
  },

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  async getCompanies(
    filters: CompanyFilters = {},
  ): Promise<PaginatedResponse<Company>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/admin/companies?${params.toString()}`);
    return response.data;
  },

  async updateCompanyStatus(
    companyId: number,
    status: string,
  ): Promise<ApiResponse<Company>> {
    const response = await api.patch(`/admin/companies/${companyId}/status`, {
      status,
    });
    return response.data;
  },

  async verifyCompany(companyId: number): Promise<ApiResponse<Company>> {
    const response = await api.patch(`/admin/companies/${companyId}/verify`);
    return response.data;
  },

  async deleteCompany(companyId: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/admin/companies/${companyId}`);
    return response.data;
  },
};
