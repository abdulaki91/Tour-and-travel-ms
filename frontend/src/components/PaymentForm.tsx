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

  const paymentMethods: PaymentMethod[] = [
    {
      id: "telebirr",
      name: "Telebirr",
      description: "Pay with Telebirr mobile wallet",
      icon: DevicePhoneMobileIcon,
      fees: "1.5% + 5 ETB",
      processingTime: "Instant",
    },
    {
      id: "chapa",
      name: "Chapa",
      description: "Pay with Chapa payment gateway",
      icon: CreditCardIcon,
      fees: "2.5%",
      processingTime: "Instant",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Direct bank transfer",
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

      if (response.data.gateway_response?.payment_url) {
        // Redirect to payment gateway
        window.open(response.data.gateway_response.payment_url, "_blank");
      } else if (response.data.gateway_response?.instructions) {
        // Show bank transfer instructions
        setShowConfirmation(true);
      }

      toast.success("Payment initiated successfully!");
      onSuccess?.(response.data);
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
      toast.success("Payment verified successfully!");
      onSuccess?.(response.data);
    },
    onError: (error: any) => {
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

    if (
      (selectedMethod === "telebirr" || selectedMethod === "chapa") &&
      !phoneNumber
    ) {
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
      verifyPaymentMutation.mutate(paymentResult.id);
    }
  };

  const calculateFees = (method: string, amount: number) => {
    switch (method) {
      case "telebirr":
        return Math.min(Math.max(amount * 0.015 + 5, 5), 100);
      case "chapa":
        return Math.min(Math.max(amount * 0.025, 2), 200);
      case "bank_transfer":
        return 10;
      default:
        return 0;
    }
  };

  const selectedPaymentMethod = paymentMethods.find(
    (m) => m.id === selectedMethod,
  );
  const fees = selectedMethod ? calculateFees(selectedMethod, amount) : 0;
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
                    onChange={(e) => setSelectedMethod(e.target.value)}
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
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Fees: {method.fees}</span>
                      <span>•</span>
                      <span>Processing: {method.processingTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(selectedMethod === "telebirr" || selectedMethod === "chapa") && (
          <div>
            <Input
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+251912345678"
              required
              helperText="Enter your phone number for payment confirmation"
            />
          </div>
        )}

        {selectedMethod === "bank_transfer" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Bank Transfer Instructions</p>
                <p>
                  After clicking "Proceed", you'll receive detailed bank
                  transfer instructions. Your booking will be confirmed once we
                  receive your payment.
                </p>
              </div>
            </div>
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

      {/* Bank Transfer Instructions Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Bank Transfer Instructions"
      >
        {paymentResult?.gateway_response?.instructions && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">
                Transfer Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Bank:</span>
                  <span className="font-medium text-blue-900">
                    {paymentResult.gateway_response.instructions.bank_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Account Number:</span>
                  <span className="font-medium text-blue-900">
                    {paymentResult.gateway_response.instructions.account_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Account Name:</span>
                  <span className="font-medium text-blue-900">
                    {paymentResult.gateway_response.instructions.account_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Amount:</span>
                  <span className="font-bold text-blue-900">
                    {paymentResult.gateway_response.instructions.amount.toLocaleString()}{" "}
                    ETB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Reference:</span>
                  <span className="font-medium text-blue-900">
                    {paymentResult.gateway_response.instructions.reference}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please include the reference number
                in your transfer description to ensure quick processing of your
                booking confirmation.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                I've Made the Transfer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Verification */}
      {paymentResult &&
        (selectedMethod === "telebirr" || selectedMethod === "chapa") && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-green-800">
                  Payment initiated. Click to verify payment status.
                </span>
              </div>
              <Button
                size="sm"
                onClick={handleVerifyPayment}
                loading={verifyPaymentMutation.isPending}
              >
                Verify Payment
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default PaymentForm;
