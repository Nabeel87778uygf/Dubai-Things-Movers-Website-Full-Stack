import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home,
  Building2,
  Sofa,
  Package,
  ArrowRight,
  Shield,
  Clock,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-moving.jpg";
import { ClientMap } from "@/components/site/ClientMap";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MoveMate Dubai — Fast & Reliable Moving Services" },
      {
        name: "description",
        content:
          "Book trusted home, office and furniture movers in Dubai. Insured, on-time, premium service.",
      },
    ],
  }),
  component: Index,
});

const servicesList = [
  { icon: Home, key: "home", color: "text-primary" },
  { icon: Building2, key: "office", color: "text-success" },
  { icon: Sofa, key: "furniture", color: "text-primary" },
  { icon: Package, key: "packing", color: "text-success" },
];

const stepsList = [0, 1, 2];

const testimonialsList = [0, 1, 2];

const locations = [
  { nameKey: "downtown", coords: [25.1972, 55.2744] },
  { nameKey: "jlt", coords: [25.0800, 55.1400] },
  { nameKey: "businessBay", coords: [25.1860, 55.2630] },
  { nameKey: "palm", coords: [25.1124, 55.1390] },
  { nameKey: "abuDhabi", coords: [24.4539, 54.3773] },
  { nameKey: "sharjah", coords: [25.3463, 55.4209] },
  { nameKey: "ajman", coords: [25.4052, 55.5136] },
  { nameKey: "alAin", coords: [24.2075, 55.7447] },
];

function Index() {
  const { t, i18n } = useTranslation();
  const [openMap, setOpenMap] = useState(false);

  const [mapCenter, setMapCenter] = useState([24.6, 54.7]);
  const [mapZoom, setMapZoom] = useState(7);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-success/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-float-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/60 px-3 py-1.5 text-xs font-medium text-accent-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5" /> {t("hero.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              {i18n.language === "ar" ? (
                <>
                  خدمات نقل <br />
                  <span className="text-gradient">سريعة وموثوقة</span> <br /> في دبي
                </>
              ) : (
                <>
                  Fast & Reliable <br />
                  <span className="text-gradient">Moving Services</span> <br /> in Dubai
                </>
              )}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/booking">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 shadow-elegant text-base h-12 px-7"
                >
                  {t("hero.bookNow")}{" "}
                  <ArrowRight className={`ml-1 h-4 w-4 ${i18n.language === "ar" ? "rotate-180" : ""}`} />
                </Button>
              </Link>
              <a href="#services">
                <Button size="lg" variant="outline" className="h-12 px-7 text-base">
                  {t("hero.viewServices")}
                </Button>
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: "10K+", l: t("hero.movesDone") },
                { v: "4.9★", l: t("hero.rating") },
                { v: "100%", l: t("hero.insured") },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold font-display">{s.v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-float-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative rounded-3xl overflow-hidden shadow-elegant">
              <img
                src={heroImg}
                alt="MoveMate movers loading a truck in Dubai"
                width={1536}
                height={1024}
                className="w-full h-auto object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-6 bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 border border-border ${
                i18n.language === "ar" ? "-right-6" : "-left-6"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-success/15 grid place-items-center">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="font-semibold text-sm">{t("hero.fullyInsured")}</div>
                <div className="text-xs text-muted-foreground">{t("hero.everyMoveCovered")}</div>
              </div>
            </div>
            <div
              className={`absolute -top-4 bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 border border-border ${
                i18n.language === "ar" ? "-left-4" : "-right-4"
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-primary/15 grid place-items-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">{t("hero.onTime")}</div>
                <div className="text-xs text-muted-foreground">{t("hero.punctuality")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              {t("services.tag")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {t("services.title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              {t("services.desc")}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {servicesList.map((s, i) => (
              <div
                key={s.key}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 animate-float-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-secondary grid place-items-center mb-5 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors`}
                >
                  <s.icon
                    className={`h-6 w-6 ${s.color} group-hover:text-primary-foreground transition-colors`}
                  />
                </div>
                <h3 className="font-display font-semibold text-lg">
                  {t(`services.items.${s.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t(`services.items.${s.key}.desc`)}
                </p>
                <Link
                  to="/booking"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                >
                  {t("services.bookNow")}{" "}
                  <ArrowRight className={`h-3.5 w-3.5 ${i18n.language === "ar" ? "rotate-180" : ""}`} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 lg:py-28 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              {t("howItWorks.tag")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 relative">
            {stepsList.map((stepIndex, i) => (
              <div
                key={stepIndex}
                className="relative rounded-2xl bg-card border border-border p-8 shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="text-5xl font-display font-bold text-gradient mb-4">
                  {t(`howItWorks.steps.${stepIndex}.n`)}
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">
                  {t(`howItWorks.steps.${stepIndex}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`howItWorks.steps.${stepIndex}.desc`)}
                </p>
                {i < stepsList.length - 1 && (
                  <ArrowRight
                    className={`hidden md:block absolute top-1/2 h-6 w-6 text-primary/40 ${
                      i18n.language === "ar"
                        ? "-left-5 rotate-180"
                        : "-right-5"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP / COVERAGE */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE TEXT */}
          <div>
            <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              {t("coverage.tag")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              {t("coverage.title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              {t("coverage.desc")}
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-3">
              {locations.map((city) => (
                <li
                  key={city.nameKey}
                  onClick={() => {
                    setMapCenter(city.coords);
                    setMapZoom(13);
                  }}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {t(`cities.${city.nameKey}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SIDE MAP (CLICKABLE PREVIEW) */}
          <div
            onClick={() => setOpenMap(true)}
            className="cursor-pointer rounded-3xl overflow-hidden shadow-card border border-border bg-card aspect-[4/3]"
          >
            <ClientMap mapCenter={mapCenter} mapZoom={mapZoom} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-28 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              {t("testimonials.tag")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {t("testimonials.title")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonialsList.map((testIndex, i) => (
              <div
                key={testIndex}
                className="rounded-2xl bg-card border border-border p-7 shadow-soft hover:shadow-card transition-shadow animate-float-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed">
                  "{t(`testimonials.items.${testIndex}.text`)}"
                </p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                    {t(`testimonials.items.${testIndex}.name`).charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {t(`testimonials.items.${testIndex}.name`)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t(`testimonials.items.${testIndex}.role`)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-hero p-10 lg:p-16 text-center shadow-elegant relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {t("cta.title")}
            </h2>
            <p className="relative mt-4 text-white/90 text-lg max-w-xl mx-auto">
              {t("cta.desc")}
            </p>
            <Link to="/booking" className="relative inline-block mt-8">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-base font-semibold shadow-elegant"
              >
                {t("cta.bookNow")}{" "}
                <ArrowRight className={`ml-1 h-4 w-4 ${i18n.language === "ar" ? "rotate-180" : ""}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}