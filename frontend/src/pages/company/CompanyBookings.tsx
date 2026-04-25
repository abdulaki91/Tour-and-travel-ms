import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { bookingService } from "../../services/bookings";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Pagination from "../../components/common/Pagination";
import BookingManagement from "../../components/company/BookingManagement";
import type { Booking, BookingFilters } from "../../types/booking";

const CompanyBookings: React.FC = () => {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["company-bookings", filters],
    queryFn: () => bookingService.getCompanyBookings(filters),
  });

  const { data: statsData } = useQuery({
    queryKey: ["company-booking-stats"],
    queryFn: () => bookingService.getCompanyBookingStats(),
  });

  const bookings = data?.data?.items || [];
  const pagination = data?.data?.pagination || {
    total: 0,
    page: 1,
    totalPages: 1,
  };
  const stats = statsData?.data || {
    total_bookings: 0,
    pending_bookings: 0,
    confirmed_bookings: 0,
    completed_bookings: 0,
    cancelled_bookings: 0,
    pending_payments: 0,
    completed_payments: 0,
    failed_payments: 0,
    total_revenue: 0,
  };

  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sort_by: "created_at",
      sort_order: "desc",
    });
  };

  const handleViewAll = () => {
    setShowAll(true);
    setFilters((prev) => ({
      ...prev,
      limit: 1000,
      page: 1,
    }));
  };

  const handleViewPaginated = () => {
    setShowAll(false);
    setFilters((prev) => ({
      ...prev,
      limit: 10,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
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
      <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <p className="text-error-600 mb-6 font-medium">
          Failed to load bookings
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold font-display mb-2">
              Booking Management
            </h1>
            <p className="text-primary-100 text-lg">
              Manage customer reservations and bookings 📋
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold">
              {formatCurrency(stats.total_revenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {stats.total_bookings}
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
                {stats.pending_bookings}
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
                {stats.confirmed_bookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-info-500 to-info-600 rounded-xl shadow-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Completed
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                {stats.completed_bookings}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                Paid Bookings
              </p>
              <p className="text-2xl font-bold text-green-900">
                {stats.completed_payments}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">
                Pending Payments
              </p>
              <p className="text-2xl font-bold text-yellow-900">
                {stats.pending_payments}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                Failed Payments
              </p>
              <p className="text-2xl font-bold text-red-900">
                {stats.failed_payments}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
            </Button>

            {!showAll && bookings.length > 0 && (
              <Button
                variant="outline"
                onClick={handleViewAll}
                className="flex items-center space-x-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View All ({pagination.totalItems})</span>
              </Button>
            )}

            {showAll && (
              <Button
                variant="outline"
                onClick={handleViewPaginated}
                className="flex items-center space-x-2"
              >
                <ChartBarIcon className="h-4 w-4" />
                <span>Show Paginated</span>
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>
              Showing {bookings.length} of {pagination.totalItems} bookings
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status
                </label>
                <select
                  className="block w-full rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 px-4 py-3 text-sm"
                  value={filters.status || ""}
                  onChange={(e) =>
                    handleFilterChange("status", e.target.value || undefined)
                  }
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  className="block w-full rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 px-4 py-3 text-sm"
                  value={filters.payment_status || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "payment_status",
                      e.target.value || undefined,
                    )
                  }
                >
                  <option value="">All Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  className="block w-full rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 px-4 py-3 text-sm"
                  value={filters.sort_by || "created_at"}
                  onChange={(e) =>
                    handleFilterChange("sort_by", e.target.value)
                  }
                >
                  <option value="created_at">Date Created</option>
                  <option value="booking_date">Travel Date</option>
                  <option value="total_amount">Amount</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarDaysIcon className="h-16 w-16" />}
          title="No Bookings Found"
          description="No bookings match your current filters. Try adjusting your search criteria or check back later for new bookings."
          action={{
            label: "Clear Filters",
            onClick: handleClearFilters,
          }}
        />
      ) : (
        <>
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingManagement
                key={booking.id}
                booking={booking}
                onUpdate={() => {
                  refetch();
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {!showAll && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {showAll && bookings.length > 10 && (
            <div className="text-center text-gray-600 mt-6">
              Showing all {bookings.length} bookings
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyBookings;
