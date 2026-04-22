import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  CubeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();

  const quickStats = [
    {
      title: "Active Packages",
      value: "12",
      icon: CubeIcon,
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50",
      textColor: "text-primary-600",
    },
    {
      title: "Total Bookings",
      value: "48",
      icon: CalendarDaysIcon,
      color: "from-success-500 to-success-600",
      bgColor: "bg-success-50",
      textColor: "text-success-600",
    },
    {
      title: "Monthly Revenue",
      value: "$12,450",
      icon: ChartBarIcon,
      color: "from-accent-500 to-accent-600",
      bgColor: "bg-accent-50",
      textColor: "text-accent-600",
    },
  ];

  const quickActions = [
    {
      title: "Create New Package",
      description: "Add a new tour package to your offerings",
      icon: PlusIcon,
      action: () => (window.location.href = "/company/packages/create"),
      color: "from-primary-500 to-primary-600",
    },
    {
      title: "View All Packages",
      description: "Manage your existing tour packages",
      icon: EyeIcon,
      action: () => (window.location.href = "/company/packages"),
      color: "from-secondary-500 to-secondary-600",
    },
    {
      title: "View Bookings",
      description: "Check customer bookings and reservations",
      icon: CalendarDaysIcon,
      action: () => (window.location.href = "/company/bookings"),
      color: "from-success-500 to-success-600",
    },
    {
      title: "Analytics",
      description: "View performance metrics and insights",
      icon: DocumentChartBarIcon,
      action: () => alert("Analytics feature coming soon!"),
      color: "from-accent-500 to-accent-600",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold font-display mb-2">
          Company Dashboard
        </h1>
        <p className="text-primary-100 text-lg">
          Welcome back, {user?.name}! 🏢
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105"
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}
              >
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 font-display">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group cursor-pointer hover:scale-105"
            onClick={action.action}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 p-3 bg-gradient-to-br ${action.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}
              >
                <action.icon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display group-hover:text-primary-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 bg-success-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New booking received for "Harar Cultural Heritage Tour"
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Package "Babille Elephant Safari" was updated
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 bg-warning-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Customer review received (4.5 stars)
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
            Ready to grow your business?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Create compelling tour packages and reach more customers in East
            Hararghe region. Our platform helps you showcase the beauty of
            Ethiopian tourism.
          </p>
          <Button
            size="lg"
            onClick={() => (window.location.href = "/company/packages/create")}
            className="shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Your First Package
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
