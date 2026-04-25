import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  FunnelIcon,
  StarIcon,
  CameraIcon,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="loading-spinner h-12 w-12 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading amazing packages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Failed to load packages
            </h3>
            <p className="text-slate-600 mb-6">
              Something went wrong while fetching the tour packages.
            </p>
            <Button onClick={() => refetch()} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const packages = data?.data.items || [];
  const pagination = data?.data.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover East Hararghe
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Explore authentic Ethiopian culture and breathtaking landscapes
              with our expertly crafted tour packages
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span>{packages.length}+ Tours Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span>Local Expert Guides</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                <span>Authentic Experiences</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="card-gradient shadow-xl mb-12 -mt-8 relative z-10 animate-slide-up">
          <div className="card-content">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                <FunnelIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Find Your Perfect Tour
              </h2>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-group">
                  <label className="form-label">Search Tours</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      className="input pl-10"
                      placeholder="Search packages..."
                      value={filters.search || ""}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      className="input pl-10"
                      placeholder="Where to go?"
                      value={filters.location || ""}
                      onChange={(e) =>
                        handleFilterChange("location", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="input"
                      type="number"
                      placeholder="Min"
                      value={filters.min_price || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "min_price",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                    <input
                      className="input"
                      type="number"
                      placeholder="Max"
                      value={filters.max_price || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "max_price",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sort By</label>
                  <select
                    className="input"
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
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary">
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Search Tours
                </Button>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        {packages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
              No packages found
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              We couldn't find any tours matching your criteria. Try adjusting
              your search filters or browse all available packages.
            </p>
            <Button onClick={clearFilters} variant="primary">
              View All Packages
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Available Tours
                </h2>
                <p className="text-slate-600">
                  Showing {packages.length} of {pagination?.total || 0} amazing
                  experiences
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>Highly Rated</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 text-blue-400" />
                  <span>Local Guides</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="card hover-lift hover-glow group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-2xl overflow-hidden">
                    {pkg.images && pkg.images.length > 0 ? (
                      <img
                        src={pkg.images[0]}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center">
                        <CameraIcon className="h-16 w-16 text-white/80" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-bold text-slate-800 shadow-lg">
                      ${pkg.price}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center text-white/90 text-sm mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{pkg.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 mr-2">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(pkg.average_rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 ml-1">
                          {pkg.average_rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {pkg.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-sm text-slate-500 mb-4 gap-y-2">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{pkg.duration_days} days</span>
                      </div>
                      <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-100">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(pkg.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(pkg.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        <span>Max {pkg.max_people}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          by {pkg.company_name}
                        </p>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900">
                            ${pkg.price}
                          </div>
                          <div className="text-xs text-slate-500">
                            per person
                          </div>
                        </div>
                      </div>
                      <Link to={`/packages/${pkg.id}`}>
                        <Button size="md" variant="primary">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev}
                  onClick={() =>
                    handleFilterChange("page", pagination.page - 1)
                  }
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      const isActive = page === pagination.page;
                      return (
                        <button
                          key={page}
                          onClick={() => handleFilterChange("page", page)}
                          className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() =>
                    handleFilterChange("page", pagination.page + 1)
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
