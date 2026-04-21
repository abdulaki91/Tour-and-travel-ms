import React from "react";
import { useAuth } from "../../context/AuthContext";

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Company Dashboard
      </h1>
      <p className="text-gray-600 mb-6">Welcome, {user?.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">My Packages</h3>
          <p className="text-gray-600">Manage your tour packages</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Bookings</h3>
          <p className="text-gray-600">View customer bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p className="text-gray-600">View performance metrics</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
