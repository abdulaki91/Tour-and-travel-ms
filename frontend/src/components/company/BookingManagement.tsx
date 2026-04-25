import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  EyeIcon,
  UserIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { bookingService } from "../../services/bookings";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import { toast } from "react-hot-toast";

interface BookingManagementProps {
  booking: any;
  onUpdate?: () => void;
}

const BookingManagement: React.FC<BookingManagementProps> = ({
  booking,
  onUpdate,
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      bookingService.updateBookingStatus(id, status),
    onSuccess: (response) => {
      toast.success(`Booking ${response.data.status} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["company-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["company-booking-stats"] });
      onUpdate?.();
      setShowConfirmModal(false);
      setShowCancelModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update booking");
    },
  });

  const sendConfirmationMutation = useMutation({
    mutationFn: (id: number) => bookingService.sendBookingConfirmation(id),
    onSuccess: () => {
      toast.success("Booking confirmation sent to customer!");
      queryClient.invalidateQueries({ queryKey: ["company-bookings"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to send confirmation",
      );
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "gray";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "refunded":
        return "info";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirmBooking = () => {
    updateStatusMutation.mutate({ id: booking.id, status: "confirmed" });
  };

  const handleCancelBooking = () => {
    updateStatusMutation.mutate({ id: booking.id, status: "cancelled" });
  };

  const handleCompleteBooking = () => {
    updateStatusMutation.mutate({ id: booking.id, status: "completed" });
  };

  const handleSendConfirmation = () => {
    sendConfirmationMutation.mutate(booking.id);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDaysIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 font-display">
                {booking.package_title}
              </h3>
              <p className="text-sm text-gray-600">
                Ref: {booking.booking_reference}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={getStatusColor(booking.status) as any}
              className="text-sm font-medium"
            >
              {booking.status.toUpperCase()}
            </Badge>
            {booking.payment_status && (
              <Badge
                variant={getPaymentStatusColor(booking.payment_status) as any}
                className="text-xs"
              >
                {booking.payment_status.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {booking.customer_name}
              </p>
              <p className="text-xs text-gray-600">Customer</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(booking.booking_date).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-600">Travel Date</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <UserIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {booking.number_of_people} people
              </p>
              <p className="text-xs text-gray-600">Group Size</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCardIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Total Amount: {formatCurrency(booking.total_amount)}
              </span>
            </div>
            {booking.payment_method && (
              <span className="text-xs text-gray-600 capitalize">
                via {booking.payment_method.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDetailsModal(true)}
              className="flex items-center space-x-1"
            >
              <EyeIcon className="h-4 w-4" />
              <span>Details</span>
            </Button>

            {booking.status === "confirmed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendConfirmation}
                loading={sendConfirmationMutation.isPending}
                className="flex items-center space-x-1"
              >
                <EnvelopeIcon className="h-4 w-4" />
                <span>Send Confirmation</span>
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {booking.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center space-x-1"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Confirm</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </>
            )}

            {booking.status === "confirmed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCompleteBooking}
                loading={updateStatusMutation.isPending}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700"
              >
                <CheckCircleIcon className="h-4 w-4" />
                <span>Mark Complete</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Booking Details"
        size="lg"
      >
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{booking.customer_name}</p>
                  <p className="text-xs text-gray-600">Full Name</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">
                    {booking.customer_email}
                  </p>
                  <p className="text-xs text-gray-600">Email</p>
                </div>
              </div>
              {booking.customer_phone && (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {booking.customer_phone}
                    </p>
                    <p className="text-xs text-gray-600">Phone</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-3">
              Booking Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-900">Package</p>
                <p className="text-sm text-blue-700">{booking.package_title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Location</p>
                <p className="text-sm text-blue-700">
                  {booking.package_location}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Travel Date</p>
                <p className="text-sm text-blue-700">
                  {new Date(booking.booking_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Group Size</p>
                <p className="text-sm text-blue-700">
                  {booking.number_of_people} people
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Total Amount
                </p>
                <p className="text-sm text-blue-700">
                  {formatCurrency(booking.total_amount)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Booking Date
                </p>
                <p className="text-sm text-blue-700">
                  {formatDate(booking.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="bg-yellow-50 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                Special Requests
              </h4>
              <p className="text-sm text-yellow-800">
                {booking.special_requests}
              </p>
            </div>
          )}

          {/* Payment Information */}
          {booking.payment_status && (
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 mb-3">
                Payment Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-green-900">Status</p>
                  <Badge
                    variant={
                      getPaymentStatusColor(booking.payment_status) as any
                    }
                    className="text-xs"
                  >
                    {booking.payment_status.toUpperCase()}
                  </Badge>
                </div>
                {booking.payment_method && (
                  <div>
                    <p className="text-sm font-medium text-green-900">Method</p>
                    <p className="text-sm text-green-700 capitalize">
                      {booking.payment_method.replace("_", " ")}
                    </p>
                  </div>
                )}
                {booking.transaction_reference && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-green-900">
                      Transaction Reference
                    </p>
                    <p className="text-sm text-green-700 font-mono">
                      {booking.transaction_reference}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Confirm Booking Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Booking"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <p className="text-green-800 font-medium">
                Confirm this booking?
              </p>
            </div>
            <p className="text-green-700 text-sm mt-2">
              This will confirm the booking for {booking.customer_name} and send
              them a confirmation notification.
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleConfirmBooking}
              loading={updateStatusMutation.isPending}
              className="flex-1"
            >
              Yes, Confirm Booking
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <XCircleIcon className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">Cancel this booking?</p>
            </div>
            <p className="text-red-700 text-sm mt-2">
              This will cancel the booking for {booking.customer_name} and
              restore the available slots. This action cannot be undone.
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleCancelBooking}
              loading={updateStatusMutation.isPending}
              variant="outline"
              className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
            >
              Yes, Cancel Booking
            </Button>
            <Button
              onClick={() => setShowCancelModal(false)}
              className="flex-1"
            >
              Keep Booking
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingManagement;
