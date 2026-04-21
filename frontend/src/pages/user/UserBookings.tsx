import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { bookingService } from "../../services/bookings";
import type { BookingFilters, BookingStatus } from "../../types";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

const UserBookings: React.FC = () => {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user-bookings", filters],
    queryFn: () => bookingService.getUserBookings(filters),
  });

  const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "danger";
      case "COMPLETED":
        return "info";
      default:
        return "default";
    }
  };

  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
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
      <div className="text-center">
        <p className="text-red-600 mb-4">Failed to load bookings</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const bookings = data?.data.items || [];
  const pagination = data?.data.pagination;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <Link to="/packages">
          <Button>Browse Packages</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={filters.status || ""}
              onChange={(e) =>
                handleFilterChange("status", e.target.value || undefined)
              }
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={filters.payment_status || ""}
              onChange={(e) =>
                handleFilterChange(
                  "payment_status",
                  e.target.value || undefined,
                )
              }
            >
              <option value="">All Payment Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilters({ page: 1, limit: 10 })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="You haven't made any bookings yet. Start exploring our amazing packages!"
          action={{
            label: "Browse Packages",
            onClick: () => (window.location.href = "/packages"),
          }}
        />
      ) : (
        <>
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.package.title}
                        </h3>
                        <Badge variant={getStatusVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                        <Badge
                          variant={
                            booking.payment_status === "PAID"
                              ? "success"
                              : "warning"
                          }
                        >
                          {booking.payment_status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>{booking.package.location}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(booking.travel_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-2" />
                          <span>{booking.number_of_people} people</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2" />
                          <span>{booking.package.duration_days} days</span>
                        </div>
                      </div>

                      {booking.special_requests && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-700">
                            Special Requests:{" "}
                          </span>
                          <span className="text-sm text-gray-600">
                            {booking.special_requests}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600 mb-2">
                        ${booking.total_amount}
                      </div>
                      <div className="space-y-2">
                        <Link to={`/user/bookings/${booking.id}`}>
                          <Button size="sm" fullWidth>
                            View Details
                          </Button>
                        </Link>
                        {booking.status === "PENDING" && (
                          <Button size="sm" variant="outline" fullWidth>
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Booked on{" "}
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                    <span>by {booking.package.company_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                disabled={!pagination.hasPrev}
                onClick={() => handleFilterChange("page", pagination.page - 1)}
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                disabled={!pagination.hasNext}
                onClick={() => handleFilterChange("page", pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserBookings;
