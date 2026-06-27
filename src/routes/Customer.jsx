import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { CustomerDashboard } from "@/components/Customer/Dashboard";
import { CustomerBookings } from "@/components/Customer/Bookings";
import { CustomerProfile } from "@/components/Customer/Profile";

export const Route = createFileRoute("/Customer")({
  component: CustomerPage,
});

function CustomerPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, bookingsRes] = await Promise.all([
        axiosInstance.get("/auth/profile"),
        axiosInstance.get("/booking/my"),
      ]);
      setUser(userRes.data.user);
      setBookings(bookingsRes.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "bookings", label: "My Bookings", icon: "📦" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-gradient">
            Welcome{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your moves and bookings from one place
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-8 w-fit">
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
            <CustomerDashboard
              bookings={bookings}
              loading={loading}
              onRefresh={fetchData}
            />
          )}
          {activeTab === "bookings" && (
            <CustomerBookings
              bookings={bookings}
              loading={loading}
              onRefresh={fetchData}
            />
          )}
          {activeTab === "profile" && (
            <CustomerProfile user={user} onRefresh={fetchData} />
          )}
        </div>
      </div>
    </div>
  );
}
