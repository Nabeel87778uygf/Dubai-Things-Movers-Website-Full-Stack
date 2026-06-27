import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Package, Clock, CheckCircle, Truck, MapPin, Eye, X, ChevronDown, ChevronUp,
} from "lucide-react";

export function CustomerBookings({ bookings, loading, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

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

  const viewDetails = async (bookingId) => {
    if (expandedId === bookingId) {
      setExpandedId(null);
      setBookingDetail(null);
      return;
    }

    setExpandedId(bookingId);
    setDetailLoading(true);
    try {
      const res = await axiosInstance.get(`/booking/booking/${bookingId}`);
      setBookingDetail(res.data.booking);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load booking details");
    } finally {
      setDetailLoading(false);
    }
  };

  const acceptOffer = async (bookingId, offerId) => {
    try {
      await axiosInstance.put(`/booking/accept-offer/${bookingId}`, { offerId });
      toast.success("Offer accepted! Driver has been assigned.");
      onRefresh();
      setExpandedId(null);
      setBookingDetail(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept offer");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filters = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Accepted" },
    { id: "picked", label: "In Transit" },
    { id: "delivered", label: "Delivered" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.id
                ? "bg-gradient-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            {f.id !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({bookings.filter((b) => b.status === f.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl shadow-card border border-border/50">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mt-4">No bookings found</h3>
          <p className="text-muted-foreground mt-1">
            {filter === "all"
              ? "You haven't made any bookings yet."
              : `No ${filter} bookings.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden hover:shadow-elegant transition-shadow duration-300"
            >
              {/* Booking Header */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{booking.serviceType}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500 shrink-0" />
                        <span><strong>From:</strong> {booking.pickupAddress}</span>
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                        <span><strong>To:</strong> {booking.dropAddress}</span>
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Moving Date:</strong>{" "}
                      {new Date(booking.movingDate).toLocaleDateString()}
                    </p>
                    {booking.driver && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Driver:</strong> {booking.driver.name}{" "}
                        ({booking.driver.phone})
                      </p>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-2xl font-bold text-primary">
                      AED {booking.price || 0}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDetails(booking._id)}
                      className="flex items-center gap-1"
                    >
                      {expandedId === booking._id ? (
                        <>
                          <ChevronUp className="h-4 w-4" /> Hide Details
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" /> View Details
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === booking._id && (
                <div className="border-t border-border px-6 py-5 bg-secondary/30">
                  {detailLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : bookingDetail ? (
                    <div className="space-y-4">
                      {/* Offers Section */}
                      {bookingDetail.offers && bookingDetail.offers.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-bold mb-3">
                            Driver Offers ({bookingDetail.offers.length})
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {bookingDetail.offers.map((offer) => (
                              <div
                                key={offer._id}
                                className={`p-4 rounded-xl border ${
                                  offer.status === "accepted"
                                    ? "bg-green-50 border-green-200"
                                    : offer.status === "rejected"
                                    ? "bg-red-50 border-red-200 opacity-60"
                                    : "bg-card border-border"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-semibold">
                                      {offer.driver?.name || "Driver"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {offer.driver?.phone}
                                    </p>
                                    {offer.driver?.vehicleType && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        🚛 {offer.driver.vehicleType} — {offer.driver.vehicleNumber}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-bold text-primary">
                                      AED {offer.price}
                                    </p>
                                    <span
                                      className={`text-xs font-semibold capitalize ${
                                        offer.status === "accepted"
                                          ? "text-green-600"
                                          : offer.status === "rejected"
                                          ? "text-red-500"
                                          : "text-yellow-600"
                                      }`}
                                    >
                                      {offer.status}
                                    </span>
                                  </div>
                                </div>
                                {offer.status === "pending" &&
                                  bookingDetail.status === "pending" && (
                                    <Button
                                      size="sm"
                                      className="w-full mt-3 bg-gradient-primary"
                                      onClick={() =>
                                        acceptOffer(booking._id, offer._id)
                                      }
                                    >
                                      Accept This Offer
                                    </Button>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground text-sm">
                            No offers received yet. Drivers will send their offers soon.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Could not load details.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
