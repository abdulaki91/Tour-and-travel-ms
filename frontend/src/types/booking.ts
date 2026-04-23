export interface Booking {
  id: number;
  user_id: number;
  package_id: number;
  booking_reference: string;
  number_of_people: number;
  total_amount: number;
  booking_date: string;
  status: BookingStatus;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  package_title: string;
  location: string;
  package?: {
    id: number;
    title: string;
    location: string;
    price: number;
    duration_days: number;
    company_name: string;
  };
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface CreateBookingData {
  package_id: number;
  number_of_people: number;
  booking_date: string;
  special_requests?: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  sort_by?: "created_at" | "booking_date" | "total_amount";
  sort_order?: "asc" | "desc";
}

export interface BookingsResponse {
  success: boolean;
  data: {
    items: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
