import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { axiosInstance } from "@/lib/axios";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    vehicleType: "Pickup 1 Ton",
    vehicleNumber: "",
    licenseNumber: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // REGISTER
      if (isRegister) {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        };

        if (formData.role === "driver") {
          payload.vehicleType = formData.vehicleType;
          payload.vehicleNumber = formData.vehicleNumber;
          payload.licenseNumber = formData.licenseNumber;
        }

        const res = await axiosInstance.post("/auth/register", payload);

        toast.success(res.data.message || "Registered Successfully");

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "customer",
          vehicleType: "Pickup 1 Ton",
          vehicleNumber: "",
          licenseNumber: "",
        });

        setIsRegister(false);
      }

      // LOGIN
      else {
        const res = await axiosInstance.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        toast.success(res.data.message || "Login Successful");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("userId", res.data.user.id);

        // Redirect to home page
        // navigate({ to: "/" });
        window.dispatchEvent(new Event("storage"));

        // ROLE KE HISAB SE REDIRECT
        const role = res.data.user.role;

        if (role === "admin") {
          navigate({ to: "/admin" });
        } else if (role === "driver") {
          navigate({ to: "/" });
        } else {
          navigate({ to: "/" });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex relative bg-gradient-hero p-12 text-white flex-col justify-between overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <Link to="/" className="relative flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
            <Truck className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-lg">MoveMate.ae</span>
        </Link>

        <div className="relative">
          <h2 className="font-display font-bold text-4xl leading-tight">
            Manage every move from one beautiful dashboard.
          </h2>

          <p className="mt-4 text-white/80 text-lg max-w-md">
            Real-time bookings, employee assignment, status tracking — all in one place.
          </p>
        </div>

        <div className="relative text-xs text-white/60">
          © {new Date().getFullYear()} MoveMate.ae
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold font-display">
            {isRegister ? "Create an account" : "Welcome back"}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {isRegister ? "Join MoveMate to manage your moves." : "Sign in to your dashboard."}
          </p>

          {/* TABS */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-secondary rounded-xl mt-6">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`py-2 text-sm font-semibold rounded-lg ${
                !isRegister ? "bg-background text-foreground" : "text-muted-foreground"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-2 text-sm font-semibold rounded-lg ${
                isRegister ? "bg-background text-foreground" : "text-muted-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {isRegister && (
              <div>
                <Label>Full Name</Label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
            )}

            <div>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {isRegister && (
              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {isRegister && (
              <div className="space-y-2">
                <Label>Register As</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: "customer" }))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 ${
                      formData.role === "customer"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xl">👤</span>
                    <span className="font-semibold text-sm">Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: "driver" }))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 ${
                      formData.role === "driver"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xl">🚛</span>
                    <span className="font-semibold text-sm">Driver Partner</span>
                  </button>
                </div>
              </div>
            )}

            {isRegister && formData.role === "driver" && (
              <div className="space-y-4 p-4 bg-secondary/30 rounded-xl border border-border/50 animate-fade-in">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Driver Details
                </p>
                <div>
                  <Label>Vehicle Type</Label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="Pickup 1 Ton">Pickup 1 Ton</option>
                    <option value="Pickup 3 Ton">Pickup 3 Ton</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Cargo Van">Cargo Van</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label>Vehicle Plate Number</Label>
                  <Input
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g. DXB-12345"
                    required
                  />
                </div>
                <div>
                  <Label>Driving License Number</Label>
                  <Input
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="e.g. DL-987654"
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing..." : isRegister ? "Register" : "Sign In"}

              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </main>
  );
}
