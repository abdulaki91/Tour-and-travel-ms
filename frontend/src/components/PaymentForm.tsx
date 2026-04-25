import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { paymentService } from "../services/payments";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import LoadingSpinner from "./ui/LoadingSpinner";
import { toast } from "react-hot-toast";

interface PaymentFormProps {
  bookingId: number;
  amount: number;
  onSuccess?: (payment: any) => void;
  onCancel?: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  fees: string;
  processingTime: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  amount,
  onSuccess,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success">("idle");

  const paymentMethods: PaymentMethod[] = [
    {
      id: "telebirr",
      name: "Telebirr",
      description: "Pay with Telebirr mobile wallet (Merchant: +251 91 123 4567)",
      icon: DevicePhoneMobileIcon,
      fees: "1.5% + 5 ETB",
      processingTime: "Instant",
    },
    {
      id: "bank_transfer",
      name: "Commercial Bank of Ethiopia (CBE)",
      description: "Direct bank transfer (Acc: 1000123456789)",
      icon: BanknotesIcon,
      fees: "10 ETB",
      processingTime: "1-3 business days",
    },
  ];

  const createPaymentMutation = useMutation({
    mutationFn: (paymentData: any) =>
      paymentService.createPayment(bookingId, paymentData),
    onSuccess: (response) => {
      setPaymentResult(response.data);
      setShowConfirmation(true);
      toast.success("Payment instructions generated!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to initiate payment",
      );
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (paymentId: number) => paymentService.verifyPayment(paymentId),
    onSuccess: (response) => {
      setPaymentStatus("success");
      toast.success("Payment verified successfully!");
      setTimeout(() => {
        onSuccess?.(response.data);
      }, 2000);
    },
    onError: (error: any) => {
      setPaymentStatus("idle");
      toast.error(
        error.response?.data?.message || "Payment verification failed",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (selectedMethod === "telebirr" && !phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    const paymentData = {
      amount,
      payment_method: selectedMethod,
      user_phone: phoneNumber || undefined,
      return_url: `${window.location.origin}/user/bookings`,
    };

    createPaymentMutation.mutate(paymentData);
  };

  const handleVerifyPayment = () => {
    if (paymentResult?.id) {
      setPaymentStatus("verifying");
      verifyPaymentMutation.mutate(paymentResult.id);
    }
  };

  const handleCBEComplete = () => {
    setShowConfirmation(false);
    setPaymentStatus("success");
    toast.success("Booking request submitted!");
    setTimeout(() => {
      onSuccess?.(paymentResult);
    }, 2000);
  };

  if (paymentStatus === "success") {
    return (
      <div className="text-center py-12 px-4 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="h-12 w-12 text-success-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {selectedMethod === "telebirr" ? "Payment Confirmed!" : "Booking Submitted!"}
        </h2>
        <p className="text-gray-600 mb-8">
          {selectedMethod === "telebirr" 
            ? "Your payment was successful. Your booking is now confirmed." 
            : "Your transfer details have been saved. Your booking will be confirmed once our team verifies the payment."}
        </p>
        <div className="flex justify-center">
          <div className="flex items-center text-primary-600 font-medium">
            <LoadingSpinner size="sm" className="mr-2" />
            Redirecting to your bookings...
          </div>
        </div>
      </div>
    );
  }

  const fees = selectedMethod === "telebirr" ? Math.min(Math.max(amount * 0.015 + 5, 5), 100) : selectedMethod === "bank_transfer" ? 10 : 0;
  const totalAmount = amount + fees;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Payment Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Amount:</span>
            <span className="font-medium">{amount.toLocaleString()} ETB</span>
          </div>
          {fees > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fees:</span>
              <span className="font-medium">{fees.toLocaleString()} ETB</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold text-gray-900">Total Amount:</span>
            <span className="font-bold text-primary-600">
              {totalAmount.toLocaleString()} ETB
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Select Payment Method
          </label>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    readOnly
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <method.icon className="h-6 w-6 text-gray-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {method.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedMethod === "telebirr" && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <Input
              label="Your Telebirr Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+2519..."
              required
              helperText="Enter the phone number you will use to pay"
            />
          </div>
        )}

        <div className="flex space-x-4">
          <Button
            type="submit"
            loading={createPaymentMutation.isPending}
            disabled={!selectedMethod}
            className="flex-1"
          >
            <ArrowRightIcon className="h-4 w-4 mr-2" />
            Proceed to Payment
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Payment Instructions Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => !verifyPaymentMutation.isPending && setShowConfirmation(false)}
        title={selectedMethod === "telebirr" ? "Telebirr Payment" : "CBE Bank Transfer"}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">
              Transfer Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Recipient:</span>
                <span className="font-medium text-blue-900">East Hararghe Tour & Travel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">
                  {selectedMethod === "telebirr" ? "Merchant Number:" : "Account Number:"}
                </span>
                <span className="font-bold text-blue-900">
                  {selectedMethod === "telebirr" ? "+251 91 123 4567" : "1000123456789"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Amount:</span>
                <span className="font-bold text-blue-900">
                  {totalAmount.toLocaleString()} ETB
                </span>
              </div>
              {paymentResult?.booking_reference && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Reference:</span>
                  <span className="font-medium text-blue-900 font-mono">
                    {paymentResult.booking_reference}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              {selectedMethod === "telebirr" 
                ? "Please complete the payment on your Telebirr app. After paying, click the verify button below."
                : "Please include the booking reference in your transfer description. We will verify your payment within 24 hours."}
            </p>
          </div>

          <div className="flex space-x-4">
            {selectedMethod === "telebirr" ? (
              <Button
                onClick={handleVerifyPayment}
                loading={verifyPaymentMutation.isPending}
                className="flex-1"
                variant="primary"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                I've Paid - Verify Now
              </Button>
            ) : (
              <Button
                onClick={handleCBEComplete}
                className="flex-1"
                variant="primary"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                I've Made the Transfer
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentForm;
