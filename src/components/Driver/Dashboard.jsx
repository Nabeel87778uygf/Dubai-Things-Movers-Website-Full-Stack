import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Package, Truck, CheckCircle, Navigation, TrendingUp, DollarSign } from "lucide-react";

export function DriverDashboard({ user, availableJobs, myJobs, loading, onRefresh }) {
  const earnings = user?.earnings || 0;
  
  const stats = {
    available: availableJobs.length,
    active: myJobs.filter((b) => ["accepted", "picked"].includes(b.status)).length,
    completed: myJobs.filter((b) => b.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Earnings Overview */}
      <div className="bg-gradient-hero rounded-3xl p-8 text-white shadow-elegant relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <DollarSign className="w-64 h-64 transform rotate-12" />
        </div>
        
        <div className="relative z-10">
          <p className="text-white/80 font-medium mb-1">Total Lifetime Earnings</p>
          <h2 className="text-5xl font-bold font-display tracking-tight">
            <span className="text-3xl text-white/70 mr-1">AED</span>
            {earnings.toFixed(2)}
          </h2>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold">
            <TrendingUp className="h-4 w-4" />
            Keep completing jobs to increase your earnings!
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Available Jobs</p>
              <p className="text-3xl font-bold mt-1 text-blue-600">{stats.available}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-100 grid place-items-center">
              <Navigation className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Trips</p>
              <p className="text-3xl font-bold mt-1 text-purple-600">{stats.active}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-100 grid place-items-center">
              <Truck className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Completed</p>
              <p className="text-3xl font-bold mt-1 text-green-600">{stats.completed}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-100 grid place-items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold font-display">Current Status</h2>
            <Button variant="outline" size="sm" onClick={onRefresh}>Refresh</Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${user?.isAvailable ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                <span className="font-medium">Availability</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user?.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user?.isAvailable ? 'Available for Jobs' : 'Busy / In Trip'}
              </span>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-4">
              <h3 className="font-semibold mb-2">How it works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                <li>Check "Available Jobs" to see customer requests</li>
                <li>Submit your price offer (you earn 80%)</li>
                <li>Wait for customer to accept your offer</li>
                <li>Update status when you pickup and deliver</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h2 className="text-lg font-bold font-display mb-6">Recent Activity</h2>
          
          {myJobs.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No recent jobs found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myJobs.slice(0, 4).map((job) => (
                <div key={job._id} className="flex justify-between items-center p-3 hover:bg-secondary/50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium">{job.serviceType}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">AED {job.price}</p>
                    <p className={`text-xs font-semibold capitalize ${job.status === 'delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                      {job.status}
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