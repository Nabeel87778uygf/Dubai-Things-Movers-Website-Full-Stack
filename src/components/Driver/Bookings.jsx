import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, Clock, CheckCircle, Truck, MapPin } from "lucide-react";

export function DriverBookings({ myJobs, loading, onRefresh }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted": return "bg-blue-100 text-blue-800 border-blue-200";
      case "picked": return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="h-5 w-5" />;
      case "accepted": return <Truck className="h-5 w-5" />;
      case "picked": return <Package className="h-5 w-5" />;
      case "delivered": return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      if (status === "picked") {
        await axiosInstance.put(`/driver/start-trip/${bookingId}`);
      } else if (status === "delivered") {
        await axiosInstance.put(`/driver/complete-trip/${bookingId}`);
      }
      toast.success(`Status updated to ${status}`);
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {myJobs.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl shadow-card border border-border/50">
          <Truck className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mt-4">No Active Jobs</h3>
          <p className="text-muted-foreground mt-1">
            Send offers on available jobs to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myJobs.map((job) => (
            <div
              key={job._id}
              className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center justify-between md:justify-start gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(job.movingDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-xl">{job.serviceType}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Customer: <span className="font-medium text-foreground">{job.customer?.name}</span> • {job.customer?.phone}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-green-500" /> Pickup
                        </p>
                        <p className="text-sm font-medium">{job.pickupAddress}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-red-500" /> Drop-off
                        </p>
                        <p className="text-sm font-medium">{job.dropAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <div className="w-full md:text-right mb-4">
                      <p className="text-sm text-muted-foreground">Agreed Price</p>
                      <p className="text-3xl font-bold text-primary mb-1">
                        AED {job.price}
                      </p>
                      <div className="inline-block px-2 py-1 rounded bg-green-50 border border-green-100 text-xs font-medium text-green-700">
                        Your Earnings: AED {(job.price * 0.8).toFixed(2)}
                      </div>
                    </div>

                    <div className="w-full">
                      {job.status === "accepted" && (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => updateStatus(job._id, "picked")}
                        >
                          <Package className="h-4 w-4 mr-2" /> Mark as Picked
                        </Button>
                      )}
                      
                      {job.status === "picked" && (
                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => updateStatus(job._id, "delivered")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Mark as Delivered
                        </Button>
                      )}
                      
                      {job.status === "delivered" && (
                        <div className="flex items-center justify-center md:justify-end gap-2 text-green-600 font-semibold w-full bg-green-50 p-3 rounded-lg border border-green-100">
                          <CheckCircle className="h-5 w-5" /> Trip Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
