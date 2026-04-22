import React from "react";
import { useParams } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold font-display mb-2">
          Booking Details
        </h1>
        <p className="text-primary-100 text-lg">
          View your booking information and status 📋
        </p>
      </div>

      {/* Booking ID Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-display">
              Booking Reference
            </h3>
            <p className="text-2xl font-bold text-primary-600 font-mono">
              #{id}
            </p>
          </div>
          <Badge variant="success">Confirmed</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
        <EmptyState
          icon={<CalendarIcon className="h-16 w-16" />}
          title="Booking Details Loading"
          description="The detailed booking information system is currently under development. This will include complete booking details, payment status, itinerary, and customer support options."
          action={{
            label: "Back to My Bookings",
            onClick: () => (window.location.href = "/user/bookings"),
          }}
        />
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-primary-900 mb-3 font-display">
            Booking Information
          </h3>
          <ul className="space-y-2 text-sm text-primary-700">
            <li className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-3" />
              Travel dates and schedule
            </li>
            <li className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-3" />
              Destination and itinerary details
            </li>
            <li className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-3" />
              Number of travelers and preferences
            </li>
            <li className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-3" />
              Duration and timing information
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-2xl p-6 border border-success-200">
          <h3 className="text-lg font-bold text-success-900 mb-3 font-display">
            Payment & Support
          </h3>
          <ul className="space-y-2 text-sm text-success-700">
            <li className="flex items-center">
              <CreditCardIcon className="w-4 h-4 mr-3" />
              Payment status and receipt
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Cancellation and refund options
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3" />
              Customer support contact
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3" />
              Booking modification requests
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-display">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => (window.location.href = "/user/bookings")}
          >
            View All Bookings
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => alert("Contact support feature coming soon!")}
          >
            Contact Support
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => alert("Download receipt feature coming soon!")}
          >
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
