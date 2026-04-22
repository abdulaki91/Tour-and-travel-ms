import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold font-display mb-2">My Profile</h1>
        <p className="text-primary-100 text-lg">
          Manage your account information and preferences 👤
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-900 font-display">
              {user?.name}
            </h2>
            <p className="text-gray-500 font-medium">{user?.role} Account</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <UserIcon className="h-5 w-5 text-primary-600 mr-3" />
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Full Name
                </label>
              </div>
              <p className="text-lg text-gray-900 font-medium">{user?.name}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-600 mr-3" />
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Email Address
                </label>
              </div>
              <p className="text-lg text-gray-900 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <PhoneIcon className="h-5 w-5 text-primary-600 mr-3" />
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Phone Number
                </label>
              </div>
              <p className="text-lg text-gray-900 font-medium">
                {user?.phone || (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <ShieldCheckIcon className="h-5 w-5 text-primary-600 mr-3" />
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Account Role
                </label>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 shadow-sm">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            size="lg"
            onClick={() => alert("Profile editing feature coming soon!")}
            className="shadow-lg hover:shadow-xl"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-2xl p-6 border border-success-200">
          <h3 className="text-lg font-bold text-success-900 mb-2 font-display">
            Account Status
          </h3>
          <p className="text-success-700">✅ Active and Verified</p>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-primary-900 mb-2 font-display">
            Member Since
          </h3>
          <p className="text-primary-700">🗓️ {new Date().getFullYear()}</p>
        </div>

        <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6 border border-accent-200">
          <h3 className="text-lg font-bold text-accent-900 mb-2 font-display">
            Security
          </h3>
          <p className="text-accent-700">🔒 Password Protected</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
