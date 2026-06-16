import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, UserPlus, MoreHorizontal, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsPage,
});

const initial = [
  {
    id: "MM-2945",
    name: "Aisha Khan",
    phone: "+971 50 111 2233",
    service: "Home Shifting",
    pickup: "JLT Cluster D",
    drop: "Marina Tower 4",
    date: "2026-05-18",
    status: "pending",
  },
  {
    id: "MM-2944",
    name: "Omar Al Farsi",
    phone: "+971 55 998 7766",
    service: "Office Relocation",
    pickup: "DIFC Gate 3",
    drop: "Business Bay",
    date: "2026-05-17",
    status: "in_progress",
    employee: "Karim H.",
  },
  {
    id: "MM-2943",
    name: "Priya Sharma",
    phone: "+971 52 444 8899",
    service: "Furniture Moving",
    pickup: "Jumeirah 2",
    drop: "Al Barsha",
    date: "2026-05-17",
    status: "pending",
  },
  {
    id: "MM-2942",
    name: "Mohammed Ali",
    phone: "+971 50 222 1100",
    service: "Packing Services",
    pickup: "Downtown",
    drop: "Palm Jumeirah",
    date: "2026-05-16",
    status: "completed",
    employee: "Salim R.",
  },
  {
    id: "MM-2941",
    name: "Fatima Hassan",
    phone: "+971 56 333 7711",
    service: "Home Shifting",
    pickup: "Mirdif",
    drop: "Sharjah",
    date: "2026-05-15",
    status: "completed",
    employee: "Yusuf A.",
  },
  {
    id: "MM-2940",
    name: "Raj Kumar",
    phone: "+971 54 666 4422",
    service: "Office Relocation",
    pickup: "Internet City",
    drop: "Media City",
    date: "2026-05-14",
    status: "rejected",
  },
];

function BookingsPage() {
  const [bookings, setBookings] = useState(initial);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const update = (id, patch) => {
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, ...patch } : x)));
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
                  key={b.id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-semibold text-primary">{b.id}</div>
                    {b.employee && (
                      <div className="text-xs text-muted-foreground mt-0.5">👷 {b.employee}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-xs text-muted-foreground">{b.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.service}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <div>
                        <span className="text-muted-foreground">From:</span> {b.pickup}
                      </div>
                      <div>
                        <span className="text-muted-foreground">To:</span> {b.drop}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{b.date}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-1">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              update(b.id, { status: "in_progress" });
                              toast.success(`Accepted ${b.id}`);
                            }}
                            className="h-8 w-8 grid place-items-center rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                            title="Accept"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              update(b.id, { status: "rejected" });
                              toast.error(`Rejected ${b.id}`);
                            }}
                            className="h-8 w-8 grid place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          update(b.id, { employee: "Karim H." });
                          toast.success(`Assigned to Karim H.`);
                        }}
                        className="h-8 w-8 grid place-items-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="Assign"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
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
    completed: { label: "Completed", cls: "bg-success/10 text-success border-success/30" },
    rejected: {
      label: "Rejected",
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
