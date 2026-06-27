import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  Truck,
  Bell,
  Search,
  User,
  Mail,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { axiosInstance } from "@/lib/axios";

export const Route = createFileRoute("/admin/admin")({
  beforeLoad: () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!token) {
      throw redirect({ to: "/login" });
    } else if (role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({ meta: [{ title: "Admin Dashboard — MoveMate" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/admin/employees", label: "Employees", icon: Users },
];

function AdminLayout() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname || "",
  });
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Admin profile & bookings for notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileRes = await axiosInstance.get("/auth/profile");
        if (profileRes.data.success) {
          setAdmin(profileRes.data.user);
        }

        // Fetch bookings to build notifications
        const bookingsRes = await axiosInstance.get("/admin/bookings");
        if (bookingsRes.data.success) {
          const bookingsData = bookingsRes.data.bookings || [];

          // Create dynamic notification list
          const list = bookingsData.map((b) => {
            let title = "";
            let desc = "";
            let type = "info"; // info, warning, success

            if (b.status === "pending") {
              title = "New Booking Request";
              desc = `${b.customer?.name || "Customer"} requested ${b.serviceType}.`;
              type = "warning";
            } else if (b.status === "accepted") {
              title = "Booking Accepted";
              desc = `Booking for ${b.customer?.name || "Customer"} is accepted.`;
              type = "info";
            } else if (b.status === "delivered" || b.status === "completed") {
              title = "Booking Completed";
              desc = `Job successfully completed by driver.`;
              type = "success";
            } else {
              title = "Status Update";
              desc = `Booking status is now ${b.status}.`;
              type = "info";
            }

            return {
              id: b._id,
              title,
              desc,
              type,
              time: new Date(b.createdAt).toLocaleDateString(),
              read: false,
            };
          });
          setNotifications(list);
        }
      } catch (err) {
        console.error("Failed to load admin layout data", err);
      }
    };

    fetchData();
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("storage"));
    navigate({ to: "/login", replace: true });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // PROTECTED ROUTE
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      navigate({ to: "/login", replace: true });
    } else if (role !== "admin") {
      navigate({ to: "/", replace: true });
    }
  }, [navigate, pathname]);

  // optional: better UX (prevent flicker)
  if (!localStorage.getItem("token") || localStorage.getItem("role") !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-secondary/30 w-full">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-sidebar text-sidebar-foreground flex-col border-r border-border">
        <Link to="/" className="h-16 px-6 flex items-center gap-2 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">MoveMate</span>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);

            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("userId");
              window.dispatchEvent(new Event("storage")); // Header ko update karo
              navigate({ to: "/login", replace: true });
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent w-full cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search bookings, customers..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/60 border border-transparent focus:border-border focus:bg-background outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* NOTIFICATION BELL */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative h-10 w-10 rounded-lg hover:bg-secondary grid place-items-center transition-colors"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-2xl border border-border shadow-elegant z-50 p-4 space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <h3 className="font-semibold text-sm font-display">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-muted-foreground">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-xl border text-left transition-colors flex gap-2 items-start ${
                            n.read
                              ? "bg-background/50 border-border/40"
                              : "bg-primary/5 border-primary/20"
                          }`}
                        >
                          {n.type === "success" && (
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          )}
                          {n.type === "warning" && (
                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                          )}
                          {n.type === "info" && (
                            <Clock className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold font-display">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug break-words">
                              {n.desc}
                            </p>
                            <span className="text-[10px] text-muted-foreground/60 block mt-1">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm cursor-pointer shadow-soft hover:opacity-90 transition-opacity"
              >
                {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-card rounded-2xl border border-border shadow-elegant z-50 p-4 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center text-white font-bold text-lg">
                      {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold font-display truncate">
                        {admin?.name || "Admin"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {admin?.email || "admin@movemate.ae"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground px-2">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      <span className="capitalize">{admin?.role || "Admin"} Access</span>
                    </div>
                    {admin?.phone && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground px-2">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        <span>{admin.phone}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 border border-destructive/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
