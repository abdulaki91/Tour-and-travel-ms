import React from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

interface Package {
  id: number;
  title: string;
  location: string;
  price: number;
  duration_days: number;
  is_active: boolean;
  available_slots: number;
  max_people: number;
  average_rating: number;
  review_count: number;
  images?: string[];
}

interface PackageTableRowProps {
  pkg: Package;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number, title: string) => void;
  isToggling: boolean;
}

const PackageTableRow: React.FC<PackageTableRowProps> = ({
  pkg,
  onToggleStatus,
  onDelete,
  isToggling,
}) => {
  return (
    <tr className="hover:bg-white/80 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-14 w-14">
            {pkg.images && pkg.images.length > 0 ? (
              <img
                className="h-14 w-14 rounded-xl object-cover shadow-md"
                src={pkg.images[0]}
                alt={pkg.title}
              />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-md">
                <span className="text-gray-500 text-xs font-medium">
                  No Image
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-bold text-gray-900">{pkg.title}</div>
            <div className="text-sm text-gray-500 font-medium">
              📍 {pkg.location}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-gray-900">${pkg.price}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">
          {pkg.duration_days} days
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={pkg.is_active ? "success" : "warning"}>
          {pkg.is_active ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-gray-900">
          {pkg.available_slots} / {pkg.max_people}
        </div>
        <div className="text-xs text-gray-500 font-medium">available</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-gray-900">
          {pkg.average_rating.toFixed(1)} ⭐
        </div>
        <div className="text-xs text-gray-500 font-medium">
          {pkg.review_count} reviews
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <Link to={`/packages/${pkg.id}`}>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-primary-50 hover:text-primary-600"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/company/packages/${pkg.id}/edit`}>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-secondary-50 hover:text-secondary-600"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleStatus(pkg.id)}
            loading={isToggling}
            className="hover:bg-warning-50 hover:text-warning-600"
          >
            {pkg.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(pkg.id, pkg.title)}
            className="hover:bg-error-50 hover:text-error-600"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default PackageTableRow;
