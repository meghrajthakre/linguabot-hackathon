import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowRight, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf9f3] via-[#f5f0e8] to-[#f0e8dc] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center space-y-8">
          {/* 404 Animation */}
          <div className="relative h-40 flex items-center justify-center">
            {/* Background circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full bg-yellow-200/20 animate-pulse" />
              <div className="absolute w-24 h-24 rounded-full bg-yellow-300/20 animate-pulse" style={{ animationDelay: "0.2s" }} />
            </div>

            {/* 404 Text */}
            <div className="relative text-center">
              <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
                404
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest -mt-2">
                Not Found
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-10 right-10 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="absolute bottom-10 left-10 w-4 h-4 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </div>

          {/* Search Suggestion */}
          <div className="bg-white rounded-2xl p-6 border border-[#e8e0d0] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <p className="text-sm text-gray-600 font-medium">
                Try going back to the home page or navigate using the menu
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-[#e8e0d0] transition-all duration-200"
            >
              <ArrowRight size={18} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Links Grid */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <QuickLink href="/" label="Dashboard" />
            <QuickLink href="/bot" label="Bot Editor" />
            <QuickLink href="/analytics" label="Analytics" />
          </div>

          {/* Help Text */}
          <div className="pt-8 text-sm text-gray-500 space-y-2">
            <p>Error Code: 404</p>
            <p className="text-xs">Still having issues? Contact support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({ href, label }) => (
  <Link
    to={href}
    className="px-4 py-2.5 bg-white hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 font-medium text-sm rounded-lg border border-[#e8e0d0] transition-all duration-200"
  >
    {label}
  </Link>
);

export default NotFound;