import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Package,
  Calendar,
  Users,
  Building,
  BarChart3,
  User,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case "ADMIN":
        return [
          { icon: BarChart3, label: "Dashboard", path: "/admin" },
          { icon: Users, label: "Users", path: "/admin/users" },
          { icon: Building, label: "Companies", path: "/admin/companies" },
        ];
      case "COMPANY":
        return [
          { icon: BarChart3, label: "Dashboard", path: "/company" },
          { icon: Package, label: "My Packages", path: "/company/packages" },
          { icon: Calendar, label: "Bookings", path: "/company/bookings" },
        ];
      case "USER":
      default:
        return [
          { icon: Home, label: "Dashboard", path: "/user" },
          { icon: User, label: "Profile", path: "/user/profile" },
          { icon: Calendar, label: "My Bookings", path: "/user/bookings" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 z-50 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2 px-6 pb-4 border-b border-gray-200 lg:hidden">
          <MapPin className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">TravelMS</span>
        </div>

        {/* Navigation */}
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={clsx(
                      "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group",
                      isActive &&
                        "bg-primary-50 text-primary-700 border-r-2 border-primary-700",
                    )}
                  >
                    <Icon
                      className={clsx(
                        "w-5 h-5 transition duration-75",
                        isActive
                          ? "text-primary-700"
                          : "text-gray-500 group-hover:text-gray-900",
                      )}
                    />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Back to main site */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <MapPin className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
              <span className="ml-3">Back to Site</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
