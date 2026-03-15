import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout & Core Components
import Layout from "./layouts/Layouts";
import Footer from "./pages/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import BotEditor from "./pages/BotEditor";
import BotView from "./pages/BotView";
import HowToMakeBot from "./pages/Howtomakebotguide";
import LandingPage from "./components/landingPage/Landingpage";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Policy Pages
import TermsOfService from "./pages/Termsofservice";
import CookiesPolicy from "./pages/Cookiespolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Bot Components
import CreateBot from "./components/CreateBot";

// Utilities
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";
 
const App = () => {
  return (
    <BrowserRouter>
      {/* Global Authentication Context */}
      <AuthProvider>

        {/* Scroll to top on every route change */}
        <ScrollToTop />

        {/* Global Toast Notifications */}
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>

          {/* ================= PUBLIC LANDING ROUTE ================= */}
          <Route path="/" element={<LandingPage />} />

          <Route
            element={
              <ProtectedRoute>
                {/* Main Application Layout */}
                <Layout />
                {/* Global Footer */}
                <Footer />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Bot Management */}
            <Route path="/create-bot" element={<CreateBot />} />
            <Route path="/bot/:id" element={<BotView />} />
            <Route path="/bot/:id/edit" element={<BotEditor />} />
            {/* 🆕 Bot Details with Website Manager */}

            {/* Guides */}
            <Route path="/how-to-make-bot" element={<HowToMakeBot />} />

            {/* Policies */}
           
          </Route>

          {/* ================= AUTH ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= FALLBACK ROUTE ================= */}
             <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiesPolicy />} />

          {/* Handles undefined routes */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;