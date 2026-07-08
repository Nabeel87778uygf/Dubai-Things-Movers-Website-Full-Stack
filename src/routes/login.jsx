import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Truck, ArrowRight, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  // Sync theme with custom event
  useEffect(() => {
    const syncTheme = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    window.addEventListener("themeChange", syncTheme);
    return () => window.removeEventListener("themeChange", syncTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("themeChange"));
  };

  const changeLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

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

        toast.success(res.data.message || t("auth.registeredSuccessfully"));

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

        toast.success(res.data.message || t("auth.loginSuccessful"));

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
      toast.error(error.response?.data?.message || t("auth.somethingWentWrong"));
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
          <span className="font-display font-bold text-lg text-white">
            {i18n.language === "ar" ? "موف ميت" : "MoveMate"}.ae
          </span>
        </Link>

        <div className="relative">
          <h2 className="font-display font-bold text-4xl leading-tight">
            {t("auth.dashboardHeading")}
          </h2>

          <p className="mt-4 text-white/80 text-lg max-w-md">
            {t("auth.dashboardSubheading")}
          </p>
        </div>

        <div className="relative text-xs text-white/60">
          © {new Date().getFullYear()} {i18n.language === "ar" ? "موف ميت" : "MoveMate"}.ae
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background relative">
        {/* TOP TOOLBAR FOR THEME & LANGUAGE */}
        <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto flex items-center gap-2">
          <button
            type="button"
            onClick={changeLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === "en" ? "AR" : "EN"}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold font-display text-foreground">
            {isRegister ? t("auth.createAccount") : t("auth.welcomeBack")}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {isRegister ? t("auth.registerDesc") : t("auth.signInDesc")}
          </p>

          {/* TABS */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-secondary rounded-xl mt-6">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`py-2 text-sm font-semibold rounded-lg cursor-pointer ${
                !isRegister ? "bg-background text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("auth.signIn")}
            </button>

            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`py-2 text-sm font-semibold rounded-lg cursor-pointer ${
                isRegister ? "bg-background text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("auth.register")}
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {isRegister && (
              <div>
                <Label>{t("auth.fullName")}</Label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
            )}

            <div>
              <Label>{t("auth.email")}</Label>
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
                <Label>{t("auth.phone")}</Label>
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
              <Label>{t("auth.password")}</Label>
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
                <Label>{t("auth.registerAs")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: "customer" }))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      formData.role === "customer"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xl">👤</span>
                    <span className="font-semibold text-sm">{t("auth.customer")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: "driver" }))}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                      formData.role === "driver"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xl">🚛</span>
                    <span className="font-semibold text-sm">{t("auth.driverPartner")}</span>
                  </button>
                </div>
              </div>
            )}

            {isRegister && formData.role === "driver" && (
              <div className="space-y-4 p-4 bg-secondary/30 rounded-xl border border-border/50 animate-fade-in">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("auth.driverDetails")}
                </p>
                <div>
                  <Label>{t("auth.vehicleType")}</Label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="Pickup 1 Ton">{i18n.language === "ar" ? "بيك أب 1 طن" : "Pickup 1 Ton"}</option>
                    <option value="Pickup 3 Ton">{i18n.language === "ar" ? "بيك أب 3 طن" : "Pickup 3 Ton"}</option>
                    <option value="Box Truck">{i18n.language === "ar" ? "شاحنة مغلقة" : "Box Truck"}</option>
                    <option value="Cargo Van">{i18n.language === "ar" ? "فان بضائع" : "Cargo Van"}</option>
                    <option value="Other">{i18n.language === "ar" ? "أخرى" : "Other"}</option>
                  </select>
                </div>
                <div>
                  <Label>{t("auth.vehiclePlateNumber")}</Label>
                  <Input
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder={i18n.language === "ar" ? "مثال: DXB-12345" : "e.g. DXB-12345"}
                    required
                  />
                </div>
                <div>
                  <Label>{t("auth.drivingLicenseNumber")}</Label>
                  <Input
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder={i18n.language === "ar" ? "مثال: DL-987654" : "e.g. DL-987654"}
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              {loading ? t("auth.processing") : isRegister ? t("auth.register") : t("auth.signIn")}

              <ArrowRight className="h-4 w-4 ms-2 rtl:rotate-180" />
            </Button>
          </form>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </main>
  );
}
