import React from "react";
import { useParams } from "react-router-dom";

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Details</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Booking ID: {id}</p>
        <p className="text-gray-600 mt-4">Booking details coming soon...</p>
      </div>
    </div>
  );
};

export default BookingDetails;
