import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "../../services/bookings";
import type { BookingFilters, BookingStatus } from "../../types";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import BookingFiltersComponent from "../../components/user/BookingFilters";
import BookingCard from "../../components/user/BookingCard";
import Pagination from "../../components/common/Pagination";

const UserBookings: React.FC = () => {
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    limit: 10,
  });
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user-bookings", filters],
    queryFn: () => bookingService.getUserBookings(filters),
  });

  const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  const handleViewAll = () => {
    setShowAll(true);
    setFilters((prev) => ({
      ...prev,
      limit: 1000, // Large number to get all bookings
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

  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
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

  const bookings = data?.data.items || [];
  const pagination = data?.data.pagination;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold font-display mb-2">
              My Bookings
            </h1>
            <p className="text-primary-100 text-lg">
              Track your tour reservations and travel plans 🎫
            </p>
          </div>
          <Link to="/packages">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl"
            >
              Browse Packages
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <BookingFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="flex items-center space-x-4">
          {!showAll && bookings.length > 0 && (
            <Button
              variant="outline"
              onClick={handleViewAll}
              className="whitespace-nowrap"
            >
              View All ({pagination?.totalItems || 0})
            </Button>
          )}
          {showAll && (
            <Button
              variant="outline"
              onClick={handleViewPaginated}
              className="whitespace-nowrap"
            >
              Show Paginated
            </Button>
          )}
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
              <BookingCard
                key={booking.id}
                booking={booking}
                getStatusVariant={getStatusVariant}
              />
            ))}
          </div>

          {/* Pagination */}
          {!showAll && pagination && pagination.totalPages > 1 && (
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

export default UserBookings;
