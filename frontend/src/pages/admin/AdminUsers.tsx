import React from "react";
import {
  UsersIcon,
  UserPlusIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const AdminUsers: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold font-display mb-2">Manage Users</h1>
        <p className="text-primary-100 text-lg">
          Oversee all system users and their permissions 👥
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                156
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-success-500 to-success-600 rounded-xl shadow-lg">
              <UserPlusIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                New This Month
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                23
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-lg">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Active Users
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                142
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
        <EmptyState
          icon={<UsersIcon className="h-16 w-16" />}
          title="User Management Interface"
          description="The comprehensive user management system is currently under development. This will include user roles, permissions, activity monitoring, and account management features."
          action={{
            label: "Coming Soon",
            onClick: () =>
              alert(
                "This feature is under development and will be available soon!",
              ),
          }}
        />
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-primary-900 mb-3 font-display">
            Upcoming Features
          </h3>
          <ul className="space-y-2 text-sm text-primary-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              User role management (Admin, Company, Customer)
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Account activation/deactivation
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              User activity monitoring
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
              Bulk user operations
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6 border border-secondary-200">
          <h3 className="text-lg font-bold text-secondary-900 mb-3 font-display">
            Security Features
          </h3>
          <ul className="space-y-2 text-sm text-secondary-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
              Two-factor authentication
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
              Login attempt monitoring
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
              Password policy enforcement
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
              Session management
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
