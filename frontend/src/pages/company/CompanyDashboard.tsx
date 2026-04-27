import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  CubeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { packageService } from "../../services/packages";
import { bookingService } from "../../services/bookings";
import { useSocket } from "../../context/SocketContext";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import CompanyGuard from "../../components/company/CompanyGuard";

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useSocket();

  const { data: packagesData, isLoading: packagesLoading } = useQuery({
    queryKey: ["company-packages"],
    queryFn: () => packageService.getPackages({ limit: 10 }),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["company-bookings"],
    queryFn: () => bookingService.getCompanyBookings({ limit: 10 }),
  });

  const packages = packagesData?.data?.items || [];
  const bookings = bookingsData?.data?.items || [];

  // Calculate total revenue
  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (parseFloat(b.total_amount) || 0),
    0,
  );

  const quickStats = [
    {
      title: "Active Packages",
      value: packages.filter((p) => p.is_active).length,
      total: packages.length,
      icon: CubeIcon,
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50",
      textColor: "text-primary-600",
      change: "+2 this month",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      total: bookings.length,
      icon: CalendarDaysIcon,
      color: "from-success-500 to-success-600",
      bgColor: "bg-success-50",
      textColor: "text-success-600",
      change: "+8 this month",
    },
    {
      title: "Monthly Revenue",
      value:
        totalRevenue > 0 ? `${totalRevenue.toLocaleString()} ETB` : "0 ETB",
      total: null,
      icon: CurrencyDollarIcon,
      color: "from-accent-500 to-accent-600",
      bgColor: "bg-accent-50",
      textColor: "text-accent-600",
      change: "+15% vs last month",
    },
    {
      title: "Customer Rating",
      value: "4.8",
      total: "5.0",
      icon: StarIcon,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      change: "Based on reviews",
    },
  ];

  const recentActivity = [
    {
      type: "booking",
      message: 'New booking received for "Harar Cultural Heritage Tour"',
      time: "2 hours ago",
      icon: CheckCircleIcon,
      color: "text-green-600 bg-green-100",
    },
    {
      type: "package",
      message: 'Package "Babille Elephant Safari" was updated',
      time: "5 hours ago",
      icon: CubeIcon,
      color: "text-blue-600 bg-blue-100",
    },
    {
      type: "review",
      message: "Customer review received (4.5 stars)",
      time: "1 day ago",
      icon: StarIcon,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      type: "booking",
      message: 'Booking confirmed for "Coffee Highlands Experience"',
      time: "2 days ago",
      icon: CheckCircleIcon,
      color: "text-green-600 bg-green-100",
    },
  ];

  if (packagesLoading || bookingsLoading) {
    return (
      <CompanyGuard>
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </CompanyGuard>
    );
  }

  return (
    <CompanyGuard>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-display mb-2">
                Company Dashboard
              </h1>
              <p className="text-primary-100 text-lg">
                Welcome back, {user?.name}! 🏢
              </p>
              <p className="text-primary-200 text-sm mt-2">
                Manage your tour packages and track your business performance
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{unreadCount}</div>
                  <div className="text-sm text-primary-200">
                    New Notifications
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-gray-900 font-display">
                      {stat.value}
                    </p>
                    {stat.total && (
                      <p className="text-sm text-gray-500">/ {stat.total}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`flex-shrink-0 p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-display">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${activity.color}`}
                    >
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-display">
                This Month
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <UsersIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      New Customers
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {
                      bookings.filter(
                        (b) =>
                          new Date(b.created_at) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      ).length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Revenue Growth
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">+15%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <StarIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Avg. Rating
                    </span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    4.8/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 font-display">
                Recent Bookings
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/company/bookings")}
              >
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Package
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((booking, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {booking.first_name?.[0]}
                              {booking.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.first_name} {booking.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {booking.package_title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.number_of_people} people
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {booking.total_amount} ETB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() =>
                  (window.location.href = "/company/packages/create")
                }
                className="shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New Package
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = "/company/packages")}
                className="shadow-lg hover:shadow-xl"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                Manage Packages
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CompanyGuard>
  );
};

export default CompanyDashboard;
