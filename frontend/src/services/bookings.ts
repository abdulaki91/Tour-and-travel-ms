import api from "./api";
import type {
  Booking,
  BookingFilters,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export interface CreateBookingData {
  package_id: number;
  number_of_people: number;
  travel_date: string;
  special_requests?: string;
}

export const bookingService = {
  async getBookings(
    filters: BookingFilters = {},
  ): Promise<PaginatedResponse<Booking>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/bookings?${params.toString()}`);
    return response.data;
  },

  async getBooking(id: number): Promise<ApiResponse<Booking>> {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async createBooking(data: CreateBookingData): Promise<ApiResponse<Booking>> {
    const response = await api.post("/bookings", data);
    return response.data;
  },

  async updateBookingStatus(
    id: number,
    status: string,
  ): Promise<ApiResponse<Booking>> {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  async cancelBooking(
    id: number,
    reason?: string,
  ): Promise<ApiResponse<Booking>> {
    const response = await api.patch(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  async getUserBookings(
    filters: BookingFilters = {},
  ): Promise<PaginatedResponse<Booking>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/bookings/my?${params.toString()}`);
    return response.data;
  },

  async getCompanyBookings(
    filters: BookingFilters = {},
  ): Promise<PaginatedResponse<Booking>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/bookings/company?${params.toString()}`);
    return response.data;
  },
};
