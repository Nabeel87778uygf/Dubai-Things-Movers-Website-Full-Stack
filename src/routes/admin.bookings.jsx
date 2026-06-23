import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, X, UserPlus, MoreHorizontal, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsPage,
});
function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get('/admin/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axiosInstance.put(`/admin/status/${id}`, { status: newStatus });
      if (res.data.success) {
        setBookings((b) => b.map((x) => (x._id === id ? { ...x, status: newStatus } : x)));
        toast.success(`Booking status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    in_progress: bookings.filter((b) => b.status === "in_progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };

  return (
    <div className="space-y-6 animate-float-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage all customer bookings in one place.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1.5" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" /> Export
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        <div className="border-b border-border px-2 sm:px-4 flex gap-1 overflow-x-auto">
          {[
            ["all", "All"],
            ["pending", "Pending"],
            ["in_progress", "In Progress"],
            ["completed", "Completed"],
            ["rejected", "Rejected"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                filter === k
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}{" "}
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded bg-secondary">{counts[k]}</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-6 py-3">Booking</th>
                <th className="text-left font-semibold px-6 py-3">Customer</th>
                <th className="text-left font-semibold px-6 py-3">Service</th>
                <th className="text-left font-semibold px-6 py-3">Route</th>
                <th className="text-left font-semibold px-6 py-3">Date</th>
                <th className="text-left font-semibold px-6 py-3">Status</th>
                <th className="text-right font-semibold px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b._id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-semibold text-primary" title={b._id}>
                      ...{b._id.slice(-6)}
                    </div>
                    {b.driver && (
                      <div className="text-xs text-muted-foreground mt-0.5">👷 {b.driver.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">
                        {b.customer?.name?.charAt(0) || b.fullName?.charAt(0) || "C"}
                      </div>
                      <div>
                        <div className="font-semibold">{b.customer?.name || b.fullName}</div>
                        <div className="text-xs text-muted-foreground">{b.customer?.phone || b.phoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.serviceType}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <div>
                        <span className="text-muted-foreground">From:</span> {b.pickupAddress}
                      </div>
                      <div>
                        <span className="text-muted-foreground">To:</span> {b.dropAddress}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(b.movingDate || b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-1">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(b._id, "accepted")}
                            className="h-8 w-8 grid place-items-center rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                            title="Accept"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(b._id, "cancelled")}
                            className="h-8 w-8 grid place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No bookings in this status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    pending: { label: "Pending", cls: "bg-warning/15 text-warning-foreground border-warning/30" },
    in_progress: { label: "In Progress", cls: "bg-primary/10 text-primary border-primary/30" },
    accepted: { label: "Accepted", cls: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
    picked: { label: "Picked", cls: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
    delivered: { label: "Delivered", cls: "bg-success/10 text-success border-success/30" },
    completed: { label: "Completed", cls: "bg-success/10 text-success border-success/30" },
    rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive border-destructive/30" },
    cancelled: {
      label: "Cancelled",
      cls: "bg-destructive/10 text-destructive border-destructive/30",
    },
  }[status];
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls} whitespace-nowrap`}
    >
      {cfg.label}
    </span>
  );
}
