import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Truck, MapPin, Plus, TrendingUp } from "lucide-react";

export function CustomerDashboard({ bookings, loading, onRefresh }) {
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    active: bookings.filter((b) => ["accepted", "picked"].includes(b.status)).length,
    delivered: bookings.filter((b) => b.status === "delivered").length,
  };

  const recentBookings = bookings.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "picked": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "accepted": return <Truck className="h-4 w-4" />;
      case "picked": return <Package className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elegant transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Bookings</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elegant transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pending</p>
              <p className="text-3xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-yellow-100 grid place-items-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elegant transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active</p>
              <p className="text-3xl font-bold mt-1 text-blue-600">{stats.active}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-100 grid place-items-center">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-elegant transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Delivered</p>
              <p className="text-3xl font-bold mt-1 text-green-600">{stats.delivered}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-100 grid place-items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h2 className="text-lg font-bold font-display mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/booking" className="block">
              <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-soft">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={onRefresh}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h2 className="text-lg font-bold font-display mb-4">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/40" />
              <p className="text-muted-foreground mt-3">No bookings yet</p>
              <Link to="/booking">
                <Button className="mt-4 bg-gradient-primary">Book Your First Move</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{booking.serviceType}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booking.pickupAddress?.substring(0, 30)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      AED {booking.price || 0}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
