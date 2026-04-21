import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { packageService } from "../services/packages";
import type { PackageFilters } from "../types";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import Rating from "../components/ui/Rating";

const PackagesPage: React.FC = () => {
  const [filters, setFilters] = useState<PackageFilters>({
    page: 1,
    limit: 12,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["packages", filters],
    queryFn: () => packageService.getPackages(filters),
  });

  const handleFilterChange = (key: keyof PackageFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sort_by: "created_at",
      sort_order: "desc",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load packages</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const packages = data?.data.items || [];
  const pagination = data?.data.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tour Packages</h1>
        <p className="text-gray-600">
          Discover amazing destinations and create unforgettable memories
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search packages..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              leftIcon={<MagnifyingGlassIcon />}
            />

            <Input
              placeholder="Location"
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              leftIcon={<MapPinIcon />}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={filters.min_price || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "min_price",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={filters.max_price || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "max_price",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>

            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={`${filters.sort_by}-${filters.sort_order}`}
              onChange={(e) => {
                const [sort_by, sort_order] = e.target.value.split("-");
                handleFilterChange("sort_by", sort_by);
                handleFilterChange("sort_order", sort_order);
              }}
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="duration-asc">Shortest Duration</option>
              <option value="duration-desc">Longest Duration</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </form>
      </div>

      {/* Results */}
      {packages.length === 0 ? (
        <EmptyState
          title="No packages found"
          description="Try adjusting your search criteria or browse all packages"
          action={{
            label: "Clear Filters",
            onClick: clearFilters,
          }}
        />
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {packages.length} of {pagination?.total || 0} packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {pkg.images && pkg.images.length > 0 ? (
                    <img
                      src={pkg.images[0]}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPinIcon className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-indigo-600">
                      ${pkg.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {pkg.title}
                    </h3>
                    <Rating value={pkg.average_rating} readonly size="sm" />
                  </div>

                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {pkg.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{pkg.duration_days} days</span>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>Max {pkg.max_people}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">
                        by {pkg.company_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pkg.review_count} review
                        {pkg.review_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Link to={`/packages/${pkg.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
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

export default PackagesPage;
