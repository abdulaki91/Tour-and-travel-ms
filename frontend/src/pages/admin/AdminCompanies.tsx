import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ShieldCheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { adminService } from "../../services/admin";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

interface Company {
  id: number;
  user_id: number;
  company_name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  license_number?: string;
  logo?: string;
  is_verified: boolean;
  created_at: string;
  first_name: string;
  last_name: string;
  user_email: string;
  package_count: number;
}

const AdminCompanies: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    is_verified: undefined as boolean | undefined,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<Company | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: companiesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-companies", currentPage, filters],
    queryFn: () =>
      adminService.getCompanies({
        page: currentPage,
        limit: 10,
        ...filters,
      }),
  });

  const verifyCompanyMutation = useMutation({
    mutationFn: ({
      companyId,
      status,
    }: {
      companyId: number;
      status: string;
    }) => adminService.updateCompanyStatus(companyId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      toast.success("Company status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update company status",
      );
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: (companyId: number) => adminService.deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      toast.success("Company deleted successfully");
      setShowDeleteModal(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete company");
    },
  });

  const handleVerifyCompany = (companyId: number, isVerified: boolean) => {
    verifyCompanyMutation.mutate({
      companyId,
      status: isVerified ? "verified" : "pending",
    });
  };

  const handleDeleteCompany = (companyId: number) => {
    deleteCompanyMutation.mutate(companyId);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      is_verified: undefined,
      sort_by: "created_at",
      sort_order: "desc",
    });
    setCurrentPage(1);
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
        <p className="text-red-600 mb-6 font-medium">
          Failed to load companies
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const companies = companiesData?.data?.companies || [];
  const pagination = companiesData?.data?.pagination;

  const verifiedCount = companies.filter((c: Company) => c.is_verified).length;
  const pendingCount = companies.filter((c: Company) => !c.is_verified).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold font-display mb-2">
          Manage Companies
        </h1>
        <p className="text-primary-100 text-lg">
          Oversee tour companies and their registrations 🏢
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Companies
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                {pagination?.total_items || 0}
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
                Verified
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                {verifiedCount}
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
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-lg">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Packages
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                {companies.reduce(
                  (sum: number, c: Company) => sum + c.package_count,
                  0,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
            {Object.values(filters).some(
              (v) => v !== "" && v !== undefined,
            ) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <select
                  value={
                    filters.is_verified === undefined
                      ? ""
                      : filters.is_verified.toString()
                  }
                  onChange={(e) =>
                    handleFilterChange(
                      "is_verified",
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onChange={(e) => {
                    const [sort_by, sort_order] = e.target.value.split("-");
                    handleFilterChange("sort_by", sort_by);
                    handleFilterChange("sort_order", sort_order);
                  }}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="company_name-asc">Name A-Z</option>
                  <option value="company_name-desc">Name Z-A</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Companies Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Packages
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {companies.map((company: Company) => (
                <tr
                  key={company.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {company.company_name}
                        </div>
                        {company.email && (
                          <div className="text-sm text-gray-500">
                            {company.email}
                          </div>
                        )}
                        {company.phone && (
                          <div className="text-xs text-gray-400">
                            {company.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {company.first_name} {company.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {company.user_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        company.is_verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {company.is_verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.package_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(company.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDetailsModal(company)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleVerifyCompany(company.id, !company.is_verified)
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          company.is_verified
                            ? "text-yellow-600 hover:bg-yellow-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={
                          company.is_verified
                            ? "Mark as pending"
                            : "Verify company"
                        }
                      >
                        {company.is_verified ? (
                          <ClockIcon className="h-4 w-4" />
                        ) : (
                          <ShieldCheckIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(company.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete company"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No companies found
            </h3>
            <p className="text-gray-500">
              {Object.values(filters).some((v) => v !== "" && v !== undefined)
                ? "Try adjusting your filters"
                : "No companies have been registered yet"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Company Details Modal */}
      <Modal
        isOpen={showDetailsModal !== null}
        onClose={() => setShowDetailsModal(null)}
        title="Company Details"
      >
        {showDetailsModal && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {showDetailsModal.company_name}
                  </h3>
                  <p className="text-gray-500">
                    {showDetailsModal.is_verified
                      ? "Verified Company"
                      : "Pending Verification"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Owner
                  </label>
                  <p className="text-sm text-gray-900">
                    {showDetailsModal.first_name} {showDetailsModal.last_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {showDetailsModal.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900">
                    {showDetailsModal.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <p className="text-sm text-gray-900">
                    {showDetailsModal.website || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    License Number
                  </label>
                  <p className="text-sm text-gray-900">
                    {showDetailsModal.license_number || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Packages
                  </label>
                  <p className="text-sm text-gray-900">
                    {showDetailsModal.package_count}
                  </p>
                </div>
              </div>

              {showDetailsModal.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <p className="text-sm text-gray-900">
                    {showDetailsModal.address}
                  </p>
                </div>
              )}

              {showDetailsModal.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="text-sm text-gray-900">
                    {showDetailsModal.description}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleVerifyCompany(
                      showDetailsModal.id,
                      !showDetailsModal.is_verified,
                    );
                    setShowDetailsModal(null);
                  }}
                >
                  {showDetailsModal.is_verified
                    ? "Mark as Pending"
                    : "Verify Company"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        title="Delete Company"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this company? This action cannot be
            undone and will also delete all associated packages and bookings.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                showDeleteModal && handleDeleteCompany(showDeleteModal)
              }
              disabled={deleteCompanyMutation.isPending}
            >
              {deleteCompanyMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCompanies;
