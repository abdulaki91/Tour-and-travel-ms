import api from "./api";

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_method: string;
  transaction_reference: string;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_date?: string;
  created_at: string;
  updated_at: string;
  booking_reference?: string;
  package_title?: string;
  package_location?: string;
}

export interface CreatePaymentData {
  amount: number;
  payment_method: "telebirr" | "chapa" | "bank_transfer" | "cash";
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: "pending" | "completed" | "failed" | "refunded";
  sort_by?: "created_at" | "amount" | "payment_date";
  sort_order?: "asc" | "desc";
}

export interface PaymentsResponse {
  success: boolean;
  data: {
    payments: Payment[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  };
}

export const paymentsService = {
  async createPayment(
    bookingId: number,
    data: CreatePaymentData,
  ): Promise<{ success: boolean; data: Payment }> {
    const response = await api.post(`/payments/booking/${bookingId}`, data);
    return response.data;
  },

  async processPayment(
    id: number,
    success: boolean = true,
  ): Promise<{ success: boolean; data: Payment }> {
    const response = await api.post(`/payments/${id}/process`, { success });
    return response.data;
  },

  async getPaymentById(
    id: number,
  ): Promise<{ success: boolean; data: Payment }> {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  async getMyPayments(filters?: PaymentFilters): Promise<PaymentsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/payments/my?${params.toString()}`);
    return response.data;
  },

  async getBookingPayments(
    bookingId: number,
  ): Promise<{ success: boolean; data: Payment[] }> {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  },
};
