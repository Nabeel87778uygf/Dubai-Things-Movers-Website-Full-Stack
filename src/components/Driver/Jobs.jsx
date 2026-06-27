import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, MapPin, Navigation, Send } from "lucide-react";

export function DriverJobs({ availableJobs, loading, onRefresh }) {
  const [offerPrices, setOfferPrices] = useState({});

  const handlePriceChange = (jobId, price) => {
    setOfferPrices((prev) => ({ ...prev, [jobId]: price }));
  };

  const sendOffer = async (jobId) => {
    const price = offerPrices[jobId];
    if (!price || isNaN(price) || Number(price) <= 0) {
      toast.error("Please enter a valid price offer");
      return;
    }

    try {
      await axiosInstance.post(`/driver/send-offer/${jobId}`, {
        price: Number(price),
      });
      toast.success("Offer sent successfully!");
      setOfferPrices((prev) => {
        const newPrices = { ...prev };
        delete newPrices[jobId];
        return newPrices;
      });
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send offer");
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
      {availableJobs.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl shadow-card border border-border/50">
          <Navigation className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mt-4">No Available Jobs</h3>
          <p className="text-muted-foreground mt-1">
            Check back later for new moving requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableJobs.map((job) => (
            <div
              key={job._id}
              className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-elegant transition-shadow duration-300 flex flex-col"
            >
              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{job.serviceType}</h3>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                    {new Date(job.movingDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2 relative">
                  <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-border -z-10"></div>
                  <div className="flex gap-3 relative bg-card">
                    <div className="mt-1 flex items-center justify-center h-5 w-5 rounded-full bg-green-100 border-2 border-card z-10">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Pickup</p>
                      <p className="text-sm font-medium line-clamp-2">{job.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 relative bg-card">
                    <div className="mt-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-100 border-2 border-card z-10">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Drop-off</p>
                      <p className="text-sm font-medium line-clamp-2">{job.dropAddress}</p>
                    </div>
                  </div>
                </div>

                {job.estimatedItems && job.estimatedItems.length > 0 && (
                  <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Items</p>
                      <p className="text-sm">{job.estimatedItems.join(", ")}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-border/50 bg-secondary/30 space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Customer Budget:</span>
                  <span className="font-bold text-primary">AED {job.price || "N/A"}</span>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">AED</span>
                    <input
                      type="number"
                      placeholder="Your Offer"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={offerPrices[job._id] || ""}
                      onChange={(e) => handlePriceChange(job._id, e.target.value)}
                    />
                  </div>
                  <Button
                    className="bg-gradient-primary shrink-0"
                    onClick={() => sendOffer(job._id)}
                  >
                    <Send className="h-4 w-4 mr-2" /> Offer
                  </Button>
                </div>
                
                <p className="text-xs text-center text-muted-foreground">
                  You earn 80% (AED {offerPrices[job._id] ? (Number(offerPrices[job._id]) * 0.8).toFixed(2) : "0.00"})
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
