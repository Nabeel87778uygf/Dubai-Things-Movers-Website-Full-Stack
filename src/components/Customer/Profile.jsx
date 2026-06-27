import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar, LogOut, Shield } from "lucide-react";

export function CustomerProfile({ user, onRefresh }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("storage"));
    navigate({ to: "/login" });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        {/* Header Banner */}
        <div className="h-24 bg-gradient-primary"></div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-primary grid place-items-center shadow-elegant border-4 border-card">
              <span className="text-3xl font-bold text-primary-foreground">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold font-display">{user.name}</h2>
          <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
            <Shield className="h-3 w-3" />
            {user.role}
          </span>

          {/* Profile Details */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
