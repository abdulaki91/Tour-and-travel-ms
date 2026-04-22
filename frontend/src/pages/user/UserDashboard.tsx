import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  StarIcon,
  ClockIcon,
  CreditCardIcon,
  ChartBarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../services/bookings";
import Button from "../../components/ui/Button";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: bookingsData } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => bookingService.getUserBookings({ limit: 3 }),
  });

  const recentBookings = bookingsData?.data.items || [];

  const stats = [
    {
      title: "Total Bookings",
      value: bookingsData?.data.pagination?.total || 0,
      icon: CalendarIcon,
      color: "blue",
      change: "+12%",
    },
    {
      title: "Completed Tours",
      value: recentBookings.filter((b) => b.status === "COMPLETED").length,
      icon: MapPinIcon,
      color: "green",
      change: "+8%",
    },
    {
      title: "Upcoming Tours",
      value: recentBookings.filter((b) => b.status === "CONFIRMED").length,
      icon: ClockIcon,
      color: "orange",
      change: "+3",
    },
    {
      title: "Total Spent",
      value: `$${recentBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)}`,
      icon: CreditCardIcon,
      color: "purple",
      change: "+15%",
    },
  ];

  const quickActions = [
    {
      title: "Browse Packages",
      description: "Discover amazing tour packages",
      icon: GlobeAltIcon,
      href: "/packages",
      color: "blue",
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings",
      icon: CalendarIcon,
      href: "/user/bookings",
      color: "green",
    },
    {
      title: "Profile Settings",
      description: "Update your profile information",
      icon: UserIcon,
      href: "/user/profile",
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-primary mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-xl text-slate-600">
                Ready for your next adventure? Let's explore what's waiting for
                you.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                <UserIcon className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="card hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      stat.color === "blue"
                        ? "bg-blue-100"
                        : stat.color === "green"
                          ? "bg-green-100"
                          : stat.color === "orange"
                            ? "bg-orange-100"
                            : "bg-purple-100"
                    }`}
                  >
                    <stat.icon
                      className={`h-6 w-6 ${
                        stat.color === "blue"
                          ? "text-blue-600"
                          : stat.color === "green"
                            ? "text-green-600"
                            : stat.color === "orange"
                              ? "text-orange-600"
                              : "text-purple-600"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">
                    Recent Bookings
                  </h2>
                  <Link to="/user/bookings">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="card-content">
                {recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking, index) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <MapPinIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {booking.package_title}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {new Date(
                                booking.booking_date,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : booking.status === "COMPLETED"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </div>
                          <p className="text-sm font-semibold text-slate-900 mt-1">
                            ${booking.total_amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Start exploring our amazing tour packages!
                    </p>
                    <Link to="/packages">
                      <Button variant="primary">Browse Packages</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card animate-slide-in-right">
              <div className="card-header">
                <h2 className="text-xl font-bold text-slate-900">
                  Quick Actions
                </h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={action.title}
                      to={action.href}
                      className="block p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            action.color === "blue"
                              ? "bg-blue-100 group-hover:bg-blue-200"
                              : action.color === "green"
                                ? "bg-green-100 group-hover:bg-green-200"
                                : "bg-purple-100 group-hover:bg-purple-200"
                          }`}
                        >
                          <action.icon
                            className={`h-5 w-5 ${
                              action.color === "blue"
                                ? "text-blue-600"
                                : action.color === "green"
                                  ? "text-green-600"
                                  : "text-purple-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel Tips */}
            <div
              className="card animate-slide-in-right"
              style={{ animationDelay: "200ms" }}
            >
              <div className="card-header">
                <h2 className="text-xl font-bold text-slate-900">
                  Travel Tips
                </h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <StarIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">
                        Best Time to Visit
                      </h4>
                      <p className="text-sm text-slate-500">
                        October to March offers the best weather for touring
                        East Hararghe.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ChartBarIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">
                        Local Currency
                      </h4>
                      <p className="text-sm text-slate-500">
                        Ethiopian Birr (ETB) is the local currency. USD is
                        widely accepted.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GlobeAltIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">
                        Cultural Respect
                      </h4>
                      <p className="text-sm text-slate-500">
                        Dress modestly when visiting religious sites and local
                        communities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
