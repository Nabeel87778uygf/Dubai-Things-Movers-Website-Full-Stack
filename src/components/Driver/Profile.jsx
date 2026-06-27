import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, LogOut, Shield, Truck, FileText } from "lucide-react";

export function DriverProfile({ user, onRefresh }) {
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
      <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        <div className="h-24 bg-gradient-hero"></div>

        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-2xl bg-gradient-primary grid place-items-center shadow-elegant border-4 border-card">
              <span className="text-4xl font-bold text-primary-foreground">
                {user.name?.charAt(0)?.toUpperCase() || "D"}
              </span>
            </div>
            
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
              user.isAvailable 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {user.isAvailable ? "Available" : "Busy"}
            </div>
          </div>

          <h2 className="text-2xl font-bold font-display">{user.name}</h2>
          <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
            <Shield className="h-3 w-3" />
            {user.role} Partner
          </span>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Contact Info</h3>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">{user.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Vehicle Info</h3>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle Type</p>
                  <p className="font-medium text-sm">{user.vehicleType || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">License/Plate No.</p>
                  <p className="font-medium text-sm">{user.vehicleNumber || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground py-6"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Log Out
      </Button>
    </div>
  );
}
