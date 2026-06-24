import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Phone, Mail, Star, Plus, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/admin/employees")({
    component: EmployeesPage,
});

function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", password: "", vehicleType: "", vehicleNumber: "", licenseNumber: ""
    });

    const fetchDrivers = async () => {
        try {
            const res = await axiosInstance.get("/admin/drivers");
            if (res.data.success) {
                setEmployees(res.data.drivers);
            }
        } catch (error) {
            console.log("Error fetching drivers:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const res = await axiosInstance.post("/auth/register", { ...formData, role: "driver" });
            if (res.data.success) {
                toast.success("Employee added successfully!");
                setIsModalOpen(false);
                setFormData({ name: "", email: "", phone: "", password: "", vehicleType: "", vehicleNumber: "", licenseNumber: "" });
                fetchDrivers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add employee");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="p-5 text-center text-muted-foreground">
                Loading employees...
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-float-up">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-display">
                        Employees
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your moving crew.
                    </p>
                </div>

                <Button className="bg-gradient-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1.5" /> Add Employee
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {employees.map((e) => (
                    <div
                        key={e._id}
                        className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
                    >
                        {/* HEADER */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                                    {e.name?.charAt(0)}
                                </div>

                                <div>
                                    <div className="font-semibold">{e.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {e.role}
                                    </div>
                                </div>
                            </div>

                            <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>

                        {/* CONTACT */}
                        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5" />
                                {e.phone || "No phone"}
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5" />
                                {e.email}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                            <div>
                                <div className="text-xs text-muted-foreground">Moves</div>
                                <div className="font-semibold">{e.moves || 0}</div>
                            </div>

                            <div>
                                <div className="text-xs text-muted-foreground">Rating</div>
                                <div className="font-semibold flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                                    {e.rating || 5.0}
                                </div>
                            </div>

                            <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${e.isAvailable
                                    ? "bg-success/10 text-success border-success/30"
                                    : "bg-muted text-muted-foreground border-border"
                                    }`}
                            >
                                {e.isAvailable ? "Available" : "On Job"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD EMPLOYEE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-bold">Add New Employee (Driver)</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddEmployee} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Full Name*</label>
                                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Email*</label>
                                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Phone*</label>
                                    <Input name="phone" value={formData.phone} onChange={handleChange} required placeholder="+971 50 XXX XXXX" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium">Password*</label>
                                    <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Vehicle Details (Required)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Vehicle Type*</label>
                                        <Input name="vehicleType" value={formData.vehicleType} onChange={handleChange} required placeholder="e.g. 3-Ton Truck" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Vehicle Number*</label>
                                        <Input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required placeholder="e.g. D-12345" />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-xs font-medium">License Number*</label>
                                        <Input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required placeholder="e.g. LIC-987654" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={adding}>
                                    {adding ? "Adding..." : "Add Employee"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}