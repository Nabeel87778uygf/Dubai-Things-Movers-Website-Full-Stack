import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Package, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/adminDashboard")({
    component: Dashboard,
});

function Dashboard() {
    const [bookings, setBookings] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, totalCommission: 0 });

    useEffect(() => {
        fetchBookings();
        fetchDrivers();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axiosInstance.get('/admin/bookings');
            if (res.data.success) {
                setBookings(res.data.bookings);
                calculateStats(res.data.bookings);
            }
        } catch (error) {
            toast.error("Failed to fetch bookings");
        }
    };

    const fetchDrivers = async () => {
        try {
            const res = await axiosInstance.get('/admin/drivers');
            if (res.data.success) {
                setDrivers(res.data.drivers);
            }
        } catch (error) {
            toast.error("Failed to fetch drivers");
        }
    };

    const calculateStats = (bookingsData) => {
        const total = bookingsData.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
        const commission = bookingsData.reduce((sum, b) => sum + (Number(b.commission) || 0), 0);
        setStats({
            totalBookings: bookingsData.length,
            totalRevenue: total,
            totalCommission: commission,
        });
    };

    const assignDriver = async (bookingId, driverId) => {
        if (!driverId) return;
        try {
            // Note: Backend doesn't have an assign route in admin controller yet.
            // This might throw 404 until implemented.
            await axiosInstance.put(`/admin/assign/${bookingId}`, { driverId });
            toast.success('Driver assigned successfully');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to assign driver');
        }
    };

    return (
        <div className="space-y-6 animate-float-up">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-display">Welcome back, Admin 👋</h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening with your moves today.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-blue-500" />
                        <div>
                            <p className="text-sm text-gray-500">Total Bookings</p>
                            <p className="text-2xl font-bold">{stats.totalBookings}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-500" />
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold">AED {stats.totalRevenue}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-purple-500" />
                        <div>
                            <p className="text-sm text-gray-500">Commission (20%)</p>
                            <p className="text-2xl font-bold">AED {stats.totalCommission}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left p-4">Customer</th>
                            <th className="text-left p-4">Service</th>
                            <th className="text-left p-4">From/To</th>
                            <th className="text-left p-4">Price</th>
                            <th className="text-left p-4">Commission</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Assign Driver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="border-b">
                                <td className="p-4">
                                    {booking.customer?.name}<br />
                                    <span className="text-xs text-gray-500">{booking.customer?.email}</span>
                                </td>
                                <td className="p-4">{booking.serviceType}</td>
                                <td className="p-4">
                                    <div className="text-sm">
                                        <div>📦 {booking.pickupAddress}</div>
                                        <div>🎯 {booking.dropAddress}</div>
                                    </div>
                                </td>
                                <td className="p-4">AED {booking.price}</td>
                                <td className="p-4 text-purple-600">AED {booking.commission || 0}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="border rounded p-1 text-sm bg-transparent"
                                        onChange={(e) => assignDriver(booking._id, e.target.value)}
                                        value={booking.driver?._id || ''}
                                    >
                                        <option value="">Select Driver</option>
                                        {Array.isArray(drivers) && drivers.map((driver) => (
                                            <option key={driver._id} value={driver._id}>
                                                {driver.name} {!driver.isAvailable && '(Busy)'}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No bookings found.</div>
                )}
            </div>
        </div>
    );
}
