import React, { useState } from "react";
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
  BellIcon,
  HeartIcon,
  TrophyIcon,
  FireIcon,
  CogIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../services/bookings";
import { userService } from "../../services/users";
import { useSocket } from "../../context/SocketContext";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Badge from "../../components/ui/Badge";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useSocket();

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => bookingService.getUserBookings({ limit: 5 }),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => userService.getUserStats(),
  });

  const recentBookings = bookingsData?.data.items || [];
  const stats = statsData || {
    bookings: { total_bookings: 0, confirmed_bookings: 0, completed_bookings: 0, cancelled_bookings: 0, total_spent: 0 },
    reviews: { total_reviews: 0, average_rating: 0 },
    recent_bookings: []
  };

  const dashboardStats = [
    {
      title: "Total Bookings",
      value: stats.bookings.total_bookings,
      icon: CalendarIcon,
      color: "blue",
      change: "+12%",
      description: "All time bookings",
    },
    {
      title: "Completed Tours",
      value: stats.bookings.completed_bookings,
      icon: TrophyIcon,
      color: "green",
      change: "+8%",
      description: "Successfully completed",
    },
    {
      title: "Upcoming Tours",
      value: stats.bookings.confirmed_bookings,
      icon: ClockIcon,
      color: "orange",
      change: "+3",
      description: "Confirmed bookings",
    },
    {
      title: "Total Spent",
      value: `$${stats.bookings.total_spent.toLocaleString()}`,
      icon: CreditCardIcon,
      color: "purple",
      change: "+15%",
      description: "Lifetime spending",
    },
  ];

  const quickActions = [
    {
      title: "Browse Packages",
      description: "Discover amazing tour packages",
      icon: GlobeAltIcon,
      href: "/packages",
      color: "primary",
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings",
      icon: CalendarIcon,
      href: "/user/bookings",
      color: "success",
    },
    {
      title: "Notifications",
      description: "Check your notifications",
      icon: BellIcon,
      href: "/notifications",
      color: "accent",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      title: "Profile Settings",
      description: "Update your profile information",
      icon: CogIcon,
      href: "/user/profile",
      color: "secondary",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      case "completed":
        return "primary";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (bookingsLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display mb-2">
              Welcome back, {user?.name}! 🌟
            </h1>
            <p className="text-primary-100 text-lg">
              Ready for your next adventure?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <UserIcon className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:scale-105"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl shadow-lg group-hover:shadow-${stat.color}-200`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 font-display">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                {action.badge && (
                  <Badge variant="error" size="sm">
                    {action.badge}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            Recent Bookings
          </h2>
          <Link to="/user/bookings">
            <Button variant="outline" size="sm">
              <EyeIcon className="h-4 w-4 mr-2" />
              View All
            </Button>
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start exploring our amazing tour packages!
            </p>
            <Link to="/packages">
              <Button>
                <GlobeAltIcon className="h-5 w-5 mr-2" />
                Browse Packages
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {booking.package_title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {booking.location} • {formatDate(booking.booking_date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ref: {booking.booking_reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusColor(booking.status)} size="sm">
                    {booking.status}
                  </Badge>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    ${booking.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Travel Tips */}
      <div className="bg-gradient-to-r from-accent-500 to-secondary-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center mb-6">
          <FireIcon className="h-8 w-8 mr-3" />
          <h2 className="text-2xl font-bold font-display">Travel Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h3 className="font-semibold mb-2">📱 Stay Connected</h3>
            <p className="text-sm text-accent-100">
              Download offline maps and keep emergency contacts handy during your travels.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h3 className="font-semibold mb-2">🎒 Pack Smart</h3>
            <p className="text-sm text-accent-100">
              Check weather conditions and pack accordingly. Don't forget essentials like sunscreen!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <h3 className="font-semibold mb-2">💡 Book Early</h3>
            <p className="text-sm text-accent-100">
              Get better deals and ensure availability by booking your tours in advance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
      href: "/packages",
      color: "blue",
      badge: "Popular",
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings",
      icon: CalendarIcon,
      href: "/user/bookings",
      color: "green",
      badge: allBookings.length > 0 ? `${allBookings.length}` : null,
    },
    {
      title: "Notifications",
      description: "Check your latest updates",
      icon: BellIcon,
      href: "/notifications",
      color: "purple",
      badge: unreadCount > 0 ? `${unreadCount}` : null,
    },
    {
      title: "Profile Settings",
      description: "Update your profile information",
      icon: UserIcon,
      href: "/user/profile",
      color: "indigo",
      badge: null,
    },
  ];

  const travelTips = [
    {
      icon: StarIcon,
      title: "Best Time to Visit",
      description:
        "October to March offers the best weather for touring East Hararghe.",
      color: "blue",
    },
    {
      icon: ChartBarIcon,
      title: "Local Currency",
      description:
        "Ethiopian Birr (ETB) is the local currency. USD is widely accepted.",
      color: "green",
    },
    {
      icon: GlobeAltIcon,
      title: "Cultural Respect",
      description:
        "Dress modestly when visiting religious sites and local communities.",
      color: "purple",
    },
    {
      icon: HeartIcon,
      title: "Local Cuisine",
      description:
        "Don't miss trying injera with traditional Ethiopian stews and coffee ceremonies.",
      color: "red",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
              {unreadCount > 0 && (
                <div className="mt-4">
                  <Link to="/notifications">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse">
                      <BellIcon className="h-5 w-5 mr-2" />
                      You have {unreadCount} new notification
                      {unreadCount > 1 ? "s" : ""}
                    </div>
                  </Link>
                </div>
              )}
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
                    <p className="text-xs text-slate-400 mt-1">
                      {stat.description}
                    </p>
                    <p
                      className={`text-xs font-medium mt-1 ${
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
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
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
                            <p className="text-xs text-slate-400">
                              {booking.number_of_people} people
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                      <Button variant="primary">
                        <FireIcon className="h-4 w-4 mr-2" />
                        Browse Packages
                      </Button>
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
                                : action.color === "purple"
                                  ? "bg-purple-100 group-hover:bg-purple-200"
                                  : "bg-indigo-100 group-hover:bg-indigo-200"
                          }`}
                        >
                          <action.icon
                            className={`h-5 w-5 ${
                              action.color === "blue"
                                ? "text-blue-600"
                                : action.color === "green"
                                  ? "text-green-600"
                                  : action.color === "purple"
                                    ? "text-purple-600"
                                    : "text-indigo-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h3>
                            {action.badge && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {action.badge}
                              </span>
                            )}
                          </div>
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
                  {travelTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          tip.color === "blue"
                            ? "bg-blue-100"
                            : tip.color === "green"
                              ? "bg-green-100"
                              : tip.color === "purple"
                                ? "bg-purple-100"
                                : "bg-red-100"
                        }`}
                      >
                        <tip.icon
                          className={`h-4 w-4 ${
                            tip.color === "blue"
                              ? "text-blue-600"
                              : tip.color === "green"
                                ? "text-green-600"
                                : tip.color === "purple"
                                  ? "text-purple-600"
                                  : "text-red-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">
                          {tip.title}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Section */}
        {allBookings.length > 0 && (
          <div className="mt-12">
            <div className="card animate-fade-in">
              <div className="card-header">
                <h2 className="text-xl font-bold text-slate-900">
                  Your Travel Journey
                </h2>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrophyIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      Explorer
                    </h3>
                    <p className="text-sm text-blue-700">
                      You've completed{" "}
                      {
                        allBookings.filter((b) => b.status === "completed")
                          .length
                      }{" "}
                      tours
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HeartIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-green-900 mb-2">
                      Adventurer
                    </h3>
                    <p className="text-sm text-green-700">
                      Total of{" "}
                      {allBookings.reduce(
                        (sum, b) => sum + (b.number_of_people || 1),
                        0,
                      )}{" "}
                      travelers
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <StarIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-purple-900 mb-2">
                      Valued Customer
                    </h3>
                    <p className="text-sm text-purple-700">
                      Member since{" "}
                      {new Date(user?.created_at || Date.now()).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
