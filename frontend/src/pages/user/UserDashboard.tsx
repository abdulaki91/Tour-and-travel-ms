import React from "react";
import { useAuth } from "../../context/AuthContext";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
          <p className="text-gray-600">View and manage your tour bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Browse Packages</h3>
          <p className="text-gray-600">Discover amazing tour packages</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Profile Settings</h3>
          <p className="text-gray-600">Update your profile information</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
