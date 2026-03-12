import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  // Minimum 2 second loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Determine which loader to show based on current path
  const getPageLoader = () => {
    if (location.pathname === "/" || location.pathname === "/dashboard") {
      return <DashboardLoader />;
    } else if (location.pathname.includes("/bot")) {
      return <BotEditorLoader />;
    } else if (location.pathname === "/analytics") {
      return <AnalyticsLoader />;
    }
    return <DefaultLoader />;
  };

  if (loading || showLoader) {
    return getPageLoader();
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ================= DEFAULT LOADER ================= */
const DefaultLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#fdf9f3] via-[#f5f0e8] to-[#f0e8dc] flex items-center justify-center p-4">
    <div className="flex flex-col items-center gap-8 max-w-sm">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-50 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400 border-r-yellow-300 animate-spin" />
        <div
          className="absolute inset-3 rounded-full border-2 border-transparent border-l-yellow-200 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "2s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          ⚙️
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          Preparing your workspace
        </h2>
        <p className="text-sm text-gray-500">
          Authenticating & loading data...
        </p>
      </div>
    </div>
  </div>
);

/* ================= DASHBOARD LOADER ================= */
const DashboardLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#fdf9f3] via-[#f5f0e8] to-[#f0e8dc] p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-[#e8e0d0] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-50 animate-pulse" />
              <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e0d0] space-y-4">
        <div className="h-6 w-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 flex-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bots Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e0d0] space-y-4">
        <div className="h-6 w-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
                <div className="h-3 w-64 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-gradient-to-r from-gray-100 to-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ================= BOT EDITOR LOADER ================= */
const BotEditorLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#fdf9f3] via-[#f5f0e8] to-[#f0e8dc] p-4 sm:p-6 lg:p-8">
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-56 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
        <div className="h-4 w-80 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
      </div>

      {/* Save Button Skeleton */}
      <div className="flex gap-3">
        <div className="h-10 w-32 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
      </div>

      {/* Basic Info Card Skeleton */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e0d0] space-y-6">
        <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />

        <div className="space-y-5">
          {/* Input fields */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
              <div className="h-10 w-full bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section Skeleton */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e0d0] space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
          <div className="h-9 w-28 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg animate-pulse" />
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-[#fdf9f3] border border-[#e8e0d0] rounded-xl p-5 space-y-4"
            >
              <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-10 w-full bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
                  <div className="h-20 w-full bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
                </div>
                <div className="h-10 w-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section Skeleton */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e8e0d0] space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
          <div className="h-9 w-28 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg animate-pulse" />
        </div>

        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-[#fdf9f3] border border-[#e8e0d0] rounded-xl p-5 space-y-4"
            >
              <div className="flex gap-4">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="h-10 w-full bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
                  <div className="h-10 w-full bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
                </div>
                <div className="h-10 w-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ================= ANALYTICS LOADER ================= */
const AnalyticsLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#fdf9f3] via-[#f5f0e8] to-[#f0e8dc] p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-56 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
        <div className="h-4 w-80 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
      </div>

      {/* Filter/Date Range Skeleton */}
      <div className="flex gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-[#e8e0d0] space-y-4"
          >
            <div className="h-4 w-28 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gradient-to-r from-green-100 to-green-50 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Large Chart Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e0d0] space-y-6">
        <div className="h-6 w-48 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-end gap-2">
              <div
                className="flex-1 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t animate-pulse"
                style={{ height: `${Math.random() * 100 + 40}px` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Data Table Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e0d0] space-y-4">
        <div className="h-6 w-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="h-4 w-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
              <div className="flex-1 h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProtectedRoute;