import React from "react";

const CompanyBookings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Customer Bookings
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">No bookings found.</p>
      </div>
    </div>
  );
};

export default CompanyBookings;
