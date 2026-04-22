import React from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import EmptyState from "../../components/ui/EmptyState";

const CompanyBookings: React.FC = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                48
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
                12
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
                36
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
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
