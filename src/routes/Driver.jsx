// src/routes/dashboard/driver.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, CheckCircle, Package } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/Driver")({
    component: DriverDashboard,
});

function DriverDashboard() {
    const [availableJobs, setAvailableJobs] = useState([]);
    const [myJobs, setMyJobs] = useState([]);
    const [earnings, setEarnings] = useState(0);
    const [activeTab, setActiveTab] = useState('available');

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchAvailableJobs();
        fetchMyJobs();
        fetchEarnings();
    }, []);

    const fetchAvailableJobs = async () => {
        try {
            const res = await axiosInstance.get('/driver/available-bookings');
            setAvailableJobs(res.data.bookings || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyJobs = async () => {
        try {
            const res = await axiosInstance.get('/driver/my-bookings');
            setMyJobs(res.data.bookings || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEarnings = async () => {
        try {
            const res = await axiosInstance.get('/auth/me');
            setEarnings(res.data.user?.earnings || 0);
        } catch (error) {
            console.error(error);
        }
    };

    const acceptJob = async (bookingId) => {
        const offerPrice = window.prompt("Enter your offer price in AED:");
        if (!offerPrice) return;

        try {
            await axiosInstance.post(`/driver/send-offer/${bookingId}`, { price: Number(offerPrice) });
            toast.success('Offer sent successfully!');
            fetchAvailableJobs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send offer');
        }
    };

    const updateStatus = async (bookingId, status) => {
        try {
            if (status === 'picked') {
                await axiosInstance.put(`/driver/start-trip/${bookingId}`);
            } else if (status === 'delivered') {
                await axiosInstance.put(`/driver/complete-trip/${bookingId}`);
            }
            toast.success(`Status updated to ${status}`);
            fetchMyJobs();
            fetchEarnings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Driver Dashboard</h1>
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">AED {earnings}</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6 border-b">
                <button
                    className={`pb-2 px-4 ${activeTab === 'available' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    Available Jobs ({availableJobs.length})
                </button>
                <button
                    className={`pb-2 px-4 ${activeTab === 'myjobs' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
                    onClick={() => setActiveTab('myjobs')}
                >
                    My Jobs ({myJobs.length})
                </button>
            </div>

            {activeTab === 'available' && (
                <div className="space-y-4">
                    {availableJobs.map((job) => (
                        <div key={job._id} className="border rounded-lg p-6 bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{job.serviceType}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <MapPin className="inline h-4 w-4 mr-1" />
                                        From: {job.pickupAddress}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        To: {job.dropAddress}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Customer: {job.customer?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {job.price > 0 && <p className="text-2xl font-bold text-blue-600">AED {job.price}</p>}
                                    <Button onClick={() => acceptJob(job._id)} className="mt-2">
                                        Send Offer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {availableJobs.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 mx-auto text-gray-400" />
                            <p className="text-gray-500 mt-2">No available jobs at the moment</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'myjobs' && (
                <div className="space-y-4">
                    {myJobs.map((job) => (
                        <div key={job._id} className="border rounded-lg p-6 bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                                job.status === 'picked' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {job.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg mt-2">{job.serviceType}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        From: {job.pickupAddress}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        To: {job.dropAddress}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Customer: {job.customer?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600">AED {job.price}</p>
                                    <p className="text-sm text-gray-500">
                                        Your earning: AED {job.price * 0.8}
                                    </p>
                                    {job.status === 'accepted' && (
                                        <Button onClick={() => updateStatus(job._id, 'picked')} className="mt-2">
                                            Mark as Picked
                                        </Button>
                                    )}
                                    {job.status === 'picked' && (
                                        <Button onClick={() => updateStatus(job._id, 'delivered')} className="mt-2">
                                            Mark as Delivered
                                        </Button>
                                    )}
                                    {job.status === 'delivered' && (
                                        <CheckCircle className="h-8 w-8 text-green-500 mt-2 mx-auto" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}