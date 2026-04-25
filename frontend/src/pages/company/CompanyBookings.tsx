import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { bookingService } from "../../services/bookings";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Pagination from "../../components/common/Pagination";
import type { Booking, BookingFilters } from "../../types/booking";

const CompanyBookings: React.FC = () => {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["company-bookings", filters],
    queryFn: () => bookingService.getCompanyBookings(filters),
  });

  const bookings = data?.data?.items || [];
  const pagination = data?.data || { total: 0, page: 1, totalPages: 1 };

  // Calculate stats from actual data
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading bookings</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold font-display mb-2">
          Customer Bookings
        </h1>
        <p className="text-primary-100 text-lg">
          Manage all your tour bookings and reservations 📅
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl shadow-lg">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Pending
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-success-500 to-success-600 rounded-xl shadow-lg">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Confirmed
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                {stats.confirmed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg">
              <XCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Cancelled
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                {stats.cancelled}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
        {bookings.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<CalendarDaysIcon className="h-16 w-16" />}
              title="No Bookings Yet"
              description="When customers book your tour packages, they will appear here. You'll be able to manage reservations, confirm bookings, and communicate with customers."
              action={{
                label: "View My Packages",
                onClick: () => (window.location.href = "/company/packages"),
              }}
            />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Bookings
                </h2>
                <div className="flex gap-2">
                  <select
                    value={filters.status || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        status: e.target.value as any,
                        page: 1,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.package_title}
                        </h3>
                        <Badge
                          variant={getStatusColor(booking.status) as any}
                          size="sm"
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          <span>{booking.number_of_people} people</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="h-4 w-4" />
                          <span>{formatDate(booking.booking_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>{formatCurrency(booking.total_amount)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Ref: {booking.booking_reference}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/company/bookings/${booking.id}`)
                        }
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-6 border-t border-gray-200">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-primary-900 mb-3 font-display">
            Booking Management
          </h3>
          <ul className="space-y-2 text-sm text-primary-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              View all customer reservations
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Confirm or cancel bookings
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Manage payment status
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Send booking confirmations
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-2xl p-6 border border-success-200">
          <h3 className="text-lg font-bold text-success-900 mb-3 font-display">
            Customer Communication
          </h3>
          <ul className="space-y-2 text-sm text-success-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Automated booking notifications
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Pre-trip information sharing
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Customer support messaging
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Post-trip follow-up
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyBookings;
