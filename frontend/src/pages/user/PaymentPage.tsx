import React from "react";
import { useParams } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Booking ID: {bookingId}</p>
        <p className="text-gray-600 mt-4">Payment processing coming soon...</p>
      </div>
    </div>
  );
};

export default PaymentPage;
