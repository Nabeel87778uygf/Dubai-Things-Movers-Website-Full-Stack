import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { DriverDashboard } from "@/components/Driver/Dashboard";
import { DriverBookings } from "@/components/Driver/Bookings";
import { DriverJobs } from "@/components/Driver/Jobs";
import { DriverProfile } from "@/components/Driver/Profile";

export const Route = createFileRoute("/Driver")({
  component: DriverPage,
});

function DriverPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [userRes, availableRes, myJobsRes] = await Promise.all([
        axiosInstance.get("/auth/profile"),
        axiosInstance.get("/driver/available-bookings"),
        axiosInstance.get("/driver/my-bookings"),
      ]);
      setUser(userRes.data.user);
      setAvailableJobs(availableRes.data.bookings || []);
      setMyJobs(myJobsRes.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "jobs", label: "Available Jobs", icon: "🔍" },
    { id: "bookings", label: "My Jobs", icon: "📦" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-gradient">
            Driver Panel{user ? ` — ${user.name}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">
            Find jobs, manage trips, and track your earnings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-8 w-fit flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-float-up">
          {activeTab === "dashboard" && (
            <DriverDashboard
              user={user}
              availableJobs={availableJobs}
              myJobs={myJobs}
              loading={loading}
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === "jobs" && (
            <DriverJobs
              availableJobs={availableJobs}
              loading={loading}
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === "bookings" && (
            <DriverBookings
              myJobs={myJobs}
              loading={loading}
              onRefresh={fetchAllData}
            />
          )}
          {activeTab === "profile" && (
            <DriverProfile user={user} onRefresh={fetchAllData} />
          )}
        </div>
      </div>
    </div>
  );
}
