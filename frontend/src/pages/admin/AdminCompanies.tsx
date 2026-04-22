import React from "react";
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const AdminCompanies: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold font-display mb-2">
          Manage Companies
        </h1>
        <p className="text-primary-100 text-lg">
          Oversee tour companies and their registrations 🏢
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Companies
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                24
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-success-500 to-success-600 rounded-xl shadow-lg">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Approved
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">
                18
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl shadow-lg">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Pending
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">4</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-error-500 to-error-600 rounded-xl shadow-lg">
              <XCircleIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Rejected
              </p>
              <p className="text-3xl font-bold text-gray-900 font-display">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
        <EmptyState
          icon={<BuildingOfficeIcon className="h-16 w-16" />}
          title="Company Management Interface"
          description="The comprehensive company management system is currently under development. This will include company approval workflows, verification processes, and performance monitoring."
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
        <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-2xl p-6 border border-success-200">
          <h3 className="text-lg font-bold text-success-900 mb-3 font-display">
            Approval Workflow
          </h3>
          <ul className="space-y-2 text-sm text-success-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Review company registration documents
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Verify business licenses and permits
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Approve or reject applications
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-3"></div>
              Send automated notifications
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6 border border-accent-200">
          <h3 className="text-lg font-bold text-accent-900 mb-3 font-display">
            Monitoring Tools
          </h3>
          <ul className="space-y-2 text-sm text-accent-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
              Company performance metrics
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
              Customer satisfaction tracking
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
              Revenue and booking analytics
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-accent-500 rounded-full mr-3"></div>
              Compliance monitoring
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminCompanies;
