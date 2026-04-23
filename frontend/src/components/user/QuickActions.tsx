import React from "react";
import { Link } from "react-router-dom";
import {
  GlobeAltIcon,
  CalendarIcon,
  BellIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import Badge from "../ui/Badge";

interface QuickActionsProps {
  unreadCount?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({ unreadCount }) => {
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
      badge: unreadCount && unreadCount > 0 ? unreadCount : undefined,
    },
    {
      title: "Profile Settings",
      description: "Update your profile information",
      icon: CogIcon,
      href: "/user/profile",
      color: "secondary",
    },
  ];

  return (
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
              <div
                className={`p-3 bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow`}
              >
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
  );
};

export default QuickActions;
