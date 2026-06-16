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
      // REGISTER (ONLY CUSTOMER)
      if (isRegister) {
        const res = await axiosInstance.post("/auth/register", {
          ...formData,
          role: "customer",
        });

        toast.success(res.data.message || "Registered Successfully");

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: "customer",
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
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
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
            backgroundImage:
              "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <Link to="/" className="relative flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
            <Truck className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-lg">
            MoveMate.ae
          </span>
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
            {isRegister
              ? "Join MoveMate to manage your moves."
              : "Sign in to your dashboard."}
          </p>

          {/* TABS */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-secondary rounded-xl mt-6">

            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`py-2 text-sm font-semibold rounded-lg ${!isRegister ? "bg-background text-foreground" : "text-muted-foreground"
                }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-2 text-sm font-semibold rounded-lg ${isRegister ? "bg-background text-foreground" : "text-muted-foreground"
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
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
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
              <p className="text-xs text-muted-foreground">
                You will register as <b>Customer</b> by default
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? "Processing..."
                : isRegister
                  ? "Register"
                  : "Sign In"}

              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

          </form>

        </div>

      </div>

      <Toaster position="top-center" richColors />
    </main>
  );
}