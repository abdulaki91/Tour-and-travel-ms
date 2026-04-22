import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import type { BookingStatus } from "../../types";

interface Booking {
  id: number;
  status: BookingStatus;
  payment_status: string;
  travel_date: string;
  number_of_people: number;
  total_amount: number;
  special_requests?: string;
  created_at: string;
  package: {
    title: string;
    location: string;
    duration_days: number;
    company_name: string;
  };
}

interface BookingCardProps {
  booking: Booking;
  getStatusVariant: (
    status: BookingStatus,
  ) => "default" | "success" | "warning" | "danger" | "info";
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  getStatusVariant,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-[1.02]">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-gray-900 font-display">
                {booking.package.title}
              </h3>
              <Badge variant={getStatusVariant(booking.status)}>
                {booking.status}
              </Badge>
              <Badge
                variant={
                  booking.payment_status === "PAID" ? "success" : "warning"
                }
              >
                {booking.payment_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center bg-gray-50 rounded-xl p-3">
                <MapPinIcon className="h-5 w-5 mr-3 text-primary-500" />
                <span className="font-medium">{booking.package.location}</span>
              </div>
              <div className="flex items-center bg-gray-50 rounded-xl p-3">
                <CalendarIcon className="h-5 w-5 mr-3 text-primary-500" />
                <span className="font-medium">
                  {new Date(booking.travel_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center bg-gray-50 rounded-xl p-3">
                <UserGroupIcon className="h-5 w-5 mr-3 text-primary-500" />
                <span className="font-medium">
                  {booking.number_of_people} people
                </span>
              </div>
              <div className="flex items-center bg-gray-50 rounded-xl p-3">
                <ClockIcon className="h-5 w-5 mr-3 text-primary-500" />
                <span className="font-medium">
                  {booking.package.duration_days} days
                </span>
              </div>
            </div>

            {booking.special_requests && (
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
                <span className="text-sm font-bold text-primary-900">
                  Special Requests:{" "}
                </span>
                <span className="text-sm text-primary-700">
                  {booking.special_requests}
                </span>
              </div>
            )}
          </div>

          <div className="text-center lg:text-right">
            <div className="text-3xl font-bold text-primary-600 mb-4 font-display">
              ${booking.total_amount}
            </div>
            <div className="space-y-3">
              <Link to={`/user/bookings/${booking.id}`}>
                <Button
                  size="lg"
                  fullWidth
                  className="shadow-lg hover:shadow-xl"
                >
                  View Details
                </Button>
              </Link>
              {booking.status === "PENDING" && (
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  className="shadow-md hover:shadow-lg"
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-medium">
            Booked on{" "}
            <span className="text-gray-900 font-semibold">
              {new Date(booking.created_at).toLocaleDateString()}
            </span>
          </span>
          <span className="font-medium">
            by{" "}
            <span className="text-primary-600 font-semibold">
              {booking.package.company_name}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
