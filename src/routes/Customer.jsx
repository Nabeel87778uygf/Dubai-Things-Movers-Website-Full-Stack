// src/routes/dashboard/customer.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Truck, MapPin } from "lucide-react";

export const Route = createFileRoute("/Customer")({
    component: CustomerDashboard,
});

function CustomerDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const userId = localStorage.getItem('userId');
        const res = await axiosInstance.get('/booking/my-bookings', {
            headers: { 'x-user-id': userId }
        });
        setBookings(res.data);
        setLoading(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'accepted': return <Truck className="h-5 w-5 text-blue-500" />;
            case 'picked': return <Package className="h-5 w-5 text-purple-500" />;
            case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
            default: return <Clock className="h-5 w-5" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <Link to="/booking">
                    <Button>+ New Booking</Button>
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400" />
                    <h2 className="text-xl font-semibold mt-4">No bookings yet</h2>
                    <p className="text-gray-500 mt-2">Book your first move today!</p>
                    <Link to="/booking">
                        <Button className="mt-4">Book Now</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="border rounded-lg p-6 bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(booking.status)}
                                        <span className="font-semibold capitalize">{booking.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        <strong>Service:</strong> {booking.serviceType}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>From:</strong> {booking.pickupAddress}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>To:</strong> {booking.dropAddress}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Date:</strong> {new Date(booking.movingDate).toLocaleDateString()}
                                    </p>
                                    {booking.driver && (
                                        <p className="text-sm text-gray-600">
                                            <strong>Driver:</strong> {booking.driver.name} ({booking.driver.phone})
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600">AED {booking.price}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}