import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import HeaderNav from "./components/HeaderNav.jsx";
import HeroSection from "./components/HeroSection.jsx";
import AssistantPanel from "./components/AssistantPanel.jsx";
import PageFooter from "./components/PageFooter.jsx";
import ApplyPage from "./components/ApplyPage.jsx";
import MemberPage from "./components/MemberPage.jsx";
import ReviewPage from "./components/ReviewPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import TrackPage from "./components/TrackPage.jsx";
import EventCenterPage from "./components/EventCenterPage.jsx";
import PublicBenefitsModal from "./components/PublicBenefitsModal.jsx";
import MemberManagementPage from "./components/MemberManagementPage.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    const current = window.location.pathname + window.location.search;
    window.location.href = "/login?redirect=" + encodeURIComponent(current);
    return null;
  }
  return children;
}

function HomePage() {
  const [showBenefits, setShowBenefits] = useState(false);
  return (
    <>
    <main className="min-h-screen bg-[#f8fbfb] bg-[url('/macau-page-bg.webp')] bg-cover bg-top bg-no-repeat p-0 pb-10">
      <HeaderNav />
      <HeroSection />
      <AssistantPanel />
      <PageFooter />
    </main>
      <button onClick={() => setShowBenefits(true)} className="fixed bottom-6 right-6 z-[999] bg-[#006252] text-white px-5 py-3 rounded-full shadow-lg font-bold text-[15px] hover:bg-[#004f46] transition">会员权益</button>
      {showBenefits && <PublicBenefitsModal onClose={() => setShowBenefits(false)} />}
    </>
  );
}

function AppRoutes() {
  const path = window.location.pathname;

  if (path === "/login") return <LoginPage />;
  if (path === "/apply") return <ApplyPage />;
  if (path === "/track") return <TrackPage />;
  if (path === "/events") return <EventCenterPage role={JSON.parse(atob((sessionStorage.getItem("token") || ".").split(".")[0]) || "{}").role || "member"} />;

  if (path === "/member") {
    return (
      <ProtectedRoute>
        <MemberPage />
      </ProtectedRoute>
    );
  }

  if (path === "/admin/members") {
    const token = sessionStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return null; }
    try {
      const payload = JSON.parse(atob(token.split(".")[0]));
      if (payload.role !== "root") { window.location.href = "/member"; return null; }
    } catch { window.location.href = "/login"; return null; }
    return <MemberManagementPage />;
  }

  if (path === "/review") {
    return (
      <ProtectedRoute>
        <ReviewPage />
      </ProtectedRoute>
    );
  }

  return <HomePage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
