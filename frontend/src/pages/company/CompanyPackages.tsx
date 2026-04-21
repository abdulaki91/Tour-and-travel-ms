import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { packageService } from "../../services/packages";
import type { PackageFilters } from "../../types";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";

const CompanyPackages: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<PackageFilters>({
    page: 1,
    limit: 10,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    packageId?: number;
    packageTitle?: string;
  }>({
    isOpen: false,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["company-packages", filters],
    queryFn: () => packageService.getPackages(filters),
  });

  const deletePackageMutation = useMutation({
    mutationFn: (id: number) => packageService.deletePackage(id),
    onSuccess: () => {
      toast.success("Package deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["company-packages"] });
      setDeleteModal({ isOpen: false });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete package");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => packageService.togglePackageStatus(id),
    onSuccess: () => {
      toast.success("Package status updated");
      queryClient.invalidateQueries({ queryKey: ["company-packages"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update package status",
      );
    },
  });

  const handleDelete = (id: number, title: string) => {
    setDeleteModal({ isOpen: true, packageId: id, packageTitle: title });
  };

  const confirmDelete = () => {
    if (deleteModal.packageId) {
      deletePackageMutation.mutate(deleteModal.packageId);
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id);
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
        <p className="text-red-600 mb-4">Failed to load packages</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const packages = data?.data.items || [];
  const pagination = data?.data.pagination;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Packages</h1>
        <Link to="/company/packages/create">
          <Button>Create Package</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-gray-900">
            {packages.length}
          </div>
          <div className="text-sm text-gray-500">Total Packages</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">
            {packages.filter((p) => p.is_active).length}
          </div>
          <div className="text-sm text-gray-500">Active Packages</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-yellow-600">
            {packages.filter((p) => !p.is_active).length}
          </div>
          <div className="text-sm text-gray-500">Inactive Packages</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-indigo-600">
            {packages.reduce((sum, p) => sum + p.review_count, 0)}
          </div>
          <div className="text-sm text-gray-500">Total Reviews</div>
        </div>
      </div>

      {packages.length === 0 ? (
        <EmptyState
          title="No packages found"
          description="Create your first package to start attracting customers!"
          action={{
            label: "Create Package",
            onClick: () => (window.location.href = "/company/packages/create"),
          }}
        />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {pkg.images && pkg.images.length > 0 ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={pkg.images[0]}
                                alt={pkg.title}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {pkg.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {pkg.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${pkg.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pkg.duration_days} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={pkg.is_active ? "success" : "warning"}>
                          {pkg.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pkg.available_slots} / {pkg.max_people}
                        </div>
                        <div className="text-xs text-gray-500">available</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pkg.average_rating.toFixed(1)} ⭐
                        </div>
                        <div className="text-xs text-gray-500">
                          {pkg.review_count} reviews
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link to={`/packages/${pkg.id}`}>
                            <Button size="sm" variant="ghost">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/company/packages/${pkg.id}/edit`}>
                            <Button size="sm" variant="ghost">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(pkg.id)}
                            loading={toggleStatusMutation.isPending}
                          >
                            {pkg.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(pkg.id, pkg.title)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                disabled={!pagination.hasPrev}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: pagination.page - 1 }))
                }
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                disabled={!pagination.hasNext}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: pagination.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Package"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{deleteModal.packageTitle}"? This
            action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deletePackageMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyPackages;
