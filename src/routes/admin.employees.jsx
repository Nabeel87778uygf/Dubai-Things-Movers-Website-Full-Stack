import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Phone, Mail, Star, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/drivers/available",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmployees(res.data.drivers);
      } catch (error) {
        console.log("Error fetching drivers:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center text-muted-foreground">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-float-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            Employees
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your moving crew.
          </p>
        </div>

        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-1.5" /> Add Employee
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map((e) => (
          <div
            key={e._id}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                  {e.name?.charAt(0)}
                </div>

                <div>
                  <div className="font-semibold">{e.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.role}
                  </div>
                </div>
              </div>

              <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* CONTACT */}
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                {e.phone || "No phone"}
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                {e.email}
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Moves</div>
                <div className="font-semibold">{e.moves || 0}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Rating</div>
                <div className="font-semibold flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  {e.rating || 5.0}
                </div>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${e.isAvailable
                  ? "bg-success/10 text-success border-success/30"
                  : "bg-muted text-muted-foreground border-border"
                  }`}
              >
                {e.isAvailable ? "Available" : "On Job"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}