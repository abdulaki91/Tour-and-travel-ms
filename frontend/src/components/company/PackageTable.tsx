import React from "react";
import PackageTableRow from "./PackageTableRow";

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

interface PackageTableProps {
  packages: Package[];
  onToggleStatus: (id: number) => void;
  onDelete: (id: number, title: string) => void;
  isToggling: boolean;
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  onToggleStatus,
  onDelete,
  isToggling,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Bookings
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
            {packages.map((pkg) => (
              <PackageTableRow
                key={pkg.id}
                pkg={pkg}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                isToggling={isToggling}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageTable;
