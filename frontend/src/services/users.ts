import { api } from "./api";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role_name: string;
  company_name?: string;
  company_description?: string;
  company_address?: string;
  company_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateCompanyProfileData {
  company_name?: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface UserStats {
  bookings: {
    total_bookings: number;
    confirmed_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    total_spent: number;
  };
  reviews: {
    total_reviews: number;
    average_rating: number;
  };
  recent_bookings: Array<{
    id: number;
    booking_reference: string;
    status: string;
    total_amount: number;
    booking_date: string;
    package_title: string;
    location: string;
  }>;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  booking_updates: boolean;
  payment_updates: boolean;
  promotional_offers: boolean;
}

export interface DeleteAccountData {
  password: string;
}

export const userService = {
  // Profile management
  async getProfile(): Promise<UserProfile> {
    const response = await api.get("/users/profile");
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await api.put("/users/profile", data);
    return response.data.data;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.post("/users/change-password", data);
  },

  // Company profile (for company users)
  async updateCompanyProfile(
    data: UpdateCompanyProfileData,
  ): Promise<UserProfile> {
    const response = await api.put("/users/company-profile", data);
    return response.data.data;
  },

  // User statistics
  async getUserStats(): Promise<UserStats> {
    const response = await api.get("/users/stats");
    return response.data.data;
  },

  // Notification preferences
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await api.get("/users/notification-preferences");
    return response.data.data;
  },

  async updateNotificationPreferences(
    data: Partial<NotificationPreferences>,
  ): Promise<NotificationPreferences> {
    const response = await api.put("/users/notification-preferences", data);
    return response.data.data;
  },

  // Account deletion
  async deleteAccount(data: DeleteAccountData): Promise<void> {
    await api.delete("/users/account", { data });
  },
};
