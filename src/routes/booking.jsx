import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Building2,
  Sofa,
  Box,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/booking")({
  component: Booking,
});

const services = [
  { id: "Home Shifting", icon: Home, basePrice: 500, labelKey: "homeShifting" },
  { id: "Office Relocation", icon: Building2, basePrice: 1000, labelKey: "officeRelocation" },
  { id: "Furniture Moving", icon: Sofa, basePrice: 300, labelKey: "furnitureMoving" },
  { id: "Packing Services", icon: Box, basePrice: 200, labelKey: "packingServices" },
];

function Booking() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState("Home Shifting");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [distance, setDistance] = useState(10);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    pickupAddress: "",
    dropAddress: "",
    movingDate: "",
    estimatedItems: "",
  });

  useEffect(() => {
    const selected = services.find(s => s.id === service);
    const price = (selected?.basePrice || 0) + (distance * 5);
    setCalculatedPrice(price);
  }, [service, distance]);

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
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error(t("booking.pleaseLogin"));
        navigate({ to: '/login' });
        return;
      }

      await axiosInstance.post("/booking/create", {
        serviceType: service,
        price: calculatedPrice,
        ...formData,
      });

      toast.success(t("booking.bookingCreatedSuccess"));
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
          <h1 className="text-3xl font-bold mt-4">{t("booking.bookingConfirmed")}</h1>
          <p className="text-gray-500 mt-2">
            {t("booking.estimatedPrice")} {i18n.language === "ar" ? "درهم" : "AED"} {calculatedPrice}
          </p>
          <p className="text-gray-500">{t("booking.driverAssignment")}</p>
          <Button className="mt-6" onClick={() => navigate({ to: '/Customer' })}>
            {t("booking.viewMyBookings")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-background text-foreground min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-card border border-border p-8 rounded-xl shadow-card">
        <h1 className="text-3xl font-bold mb-6">{t("booking.title")}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setService(item.id)}
                className={`p-4 border rounded-lg transition cursor-pointer
                  ${service === item.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium block">{t(`booking.${item.labelKey}`)}</span>
                <span className="text-xs text-gray-500 block mt-1">
                  {t("booking.from")} {item.basePrice}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t("booking.estimatedPrice")}</span>
            <span className="text-2xl font-bold text-blue-600">
              {i18n.language === "ar" ? "درهم" : "AED"} {calculatedPrice}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t("booking.priceDetails")}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            name="fullName"
            placeholder={t("booking.fullName")}
            value={formData.fullName}
            onChange={handleChange}
            required
            className={i18n.language === "ar" ? "text-right" : "text-left"}
          />
          <Input
            name="phoneNumber"
            placeholder={t("booking.phoneNumber")}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className={i18n.language === "ar" ? "text-right" : "text-left"}
          />
          <Input
            name="pickupAddress"
            placeholder={t("booking.pickupAddress")}
            value={formData.pickupAddress}
            onChange={handleChange}
            required
            className={i18n.language === "ar" ? "text-right" : "text-left"}
          />
          <Input
            name="dropAddress"
            placeholder={t("booking.dropAddress")}
            value={formData.dropAddress}
            onChange={handleChange}
            required
            className={i18n.language === "ar" ? "text-right" : "text-left"}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-600 font-medium">
              {t("booking.movingDate")}
            </label>
            <Input
              type="date"
              name="movingDate"
              value={formData.movingDate}
              onChange={handleChange}
              required
              className={i18n.language === "ar" ? "text-right" : "text-left"}
            />
          </div>
          <Input
            name="estimatedItems"
            placeholder={t("booking.estimatedItems")}
            value={formData.estimatedItems}
            onChange={handleChange}
            className={i18n.language === "ar" ? "text-right" : "text-left"}
          />

          <div className="space-y-2 pt-2">
            <label className="text-sm text-gray-600 font-medium block">
              {t("booking.distance")} {distance} {i18n.language === "ar" ? "كم" : "km"}
            </label>
            <Input
              type="range"
              min="1"
              max="50"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 {i18n.language === "ar" ? "كم" : "km"}</span>
              <span>50 {i18n.language === "ar" ? "كم" : "km"}</span>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-primary">
            {loading ? t("common.loading") : t("booking.confirmBooking")}
            <ArrowRight className={`ml-2 h-4 w-4 ${i18n.language === "ar" ? "rotate-180" : ""}`} />
          </Button>
        </form>
      </div>
    </main>
  );
}