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
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-moving.jpg";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useState } from "react";

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

// Helper component to change map view
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const services = [
  {
    icon: Home,
    title: "Home Shifting",
    desc: "Apartment, villa & studio relocations across Dubai with full-service packing.",
    color: "text-primary",
  },
  {
    icon: Building2,
    title: "Office Relocation",
    desc: "Minimal downtime office moves — IT, furniture, and confidential files.",
    color: "text-success",
  },
  {
    icon: Sofa,
    title: "Furniture Moving",
    desc: "Single piece or full suite. Disassembly, transport and reassembly.",
    color: "text-primary",
  },
  {
    icon: Package,
    title: "Packing Services",
    desc: "Premium materials, expert packers, fragile-item specialists.",
    color: "text-success",
  },
];

const steps = [
  {
    n: "01",
    title: "Book Online",
    desc: "Fill the simple form with your move details in under 60 seconds.",
  },
  {
    n: "02",
    title: "Get a Quote",
    desc: "Our team reviews and confirms a transparent, all-inclusive price.",
  },
  {
    n: "03",
    title: "Relax & Move",
    desc: "Our insured crew handles everything door-to-door, on schedule.",
  },
];

const testimonials = [
  {
    name: "Aisha Khan",
    role: "Marina Resident",
    text: "Smoothest move I've ever had in Dubai. The team was on time, careful and friendly.",
    rating: 5,
  },
  {
    name: "Omar Al Farsi",
    role: "Office Manager",
    text: "Relocated 40 staff over a weekend. Zero downtime Monday morning. Highly recommended.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "JLT Resident",
    text: "Packed my fragile artwork like museum pros. Worth every dirham.",
    rating: 5,
  },
];

const locations = [
  { name: "Downtown Dubai", coords: [25.1972, 55.2744] },
  { name: "JLT & Marina", coords: [25.0800, 55.1400] },
  { name: "Business Bay", coords: [25.1860, 55.2630] },
  { name: "Palm Jumeirah", coords: [25.1124, 55.1390] },
  { name: "Abu Dhabi", coords: [24.4539, 54.3773] },
  { name: "Sharjah", coords: [25.3463, 55.4209] },
  { name: "Ajman", coords: [25.4052, 55.5136] },
  { name: "Al Ain", coords: [24.2075, 55.7447] },
];

function Index() {
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
              <Sparkles className="h-3.5 w-3.5" /> Dubai's #1 rated moving company
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Fast & Reliable <br />
              <span className="text-gradient">Moving Services</span> <br /> in Dubai
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              From cozy studios in JLT to corporate towers in DIFC — our insured movers deliver a
              stress-free, premium relocation experience across the UAE.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/booking">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 shadow-elegant text-base h-12 px-7"
                >
                  Book Your Move Now <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#services">
                <Button size="lg" variant="outline" className="h-12 px-7 text-base">
                  View Services
                </Button>
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: "10K+", l: "Moves done" },
                { v: "4.9★", l: "Rating" },
                { v: "100%", l: "Insured" },
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
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 border border-border">
              <div className="h-10 w-10 rounded-xl bg-success/15 grid place-items-center">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="font-semibold text-sm">Fully Insured</div>
                <div className="text-xs text-muted-foreground">Every move covered</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 border border-border">
              <div className="h-10 w-10 rounded-xl bg-primary/15 grid place-items-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">On-time</div>
                <div className="text-xs text-muted-foreground">98% punctuality</div>
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
              Our Services
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Everything you need to move
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Tailored relocation packages built for Dubai's pace.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <div
                key={s.title}
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
                <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <Link
                  to="/booking"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                >
                  Book now <ArrowRight className="h-3.5 w-3.5" />
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
              How it works
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Move in three simple steps
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 relative">
            {steps.map((step, i) => (
              <div
                key={step.n}
                className="relative rounded-2xl bg-card border border-border p-8 shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="text-5xl font-display font-bold text-gradient mb-4">{step.n}</div>
                <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-5 h-6 w-6 text-primary/40" />
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
              Coverage
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              We move across all 7 Emirates
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              From Dubai Marina to Abu Dhabi Corniche — wherever you go, we go.
            </p>

            {/* Updated cities list with click functionality */}
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {locations.map((city) => (
                <li
                  key={city.name}
                  onClick={() => {
                    setMapCenter(city.coords);
                    setMapZoom(13);
                  }}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {city.name}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SIDE MAP (CLICKABLE PREVIEW) */}
          <div
            onClick={() => setOpenMap(true)}
            className="cursor-pointer rounded-3xl overflow-hidden shadow-card border border-border bg-card aspect-[4/3]"
          >
            {/* Updated MapContainer with dynamic center and zoom */}
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
            >
              <ChangeMapView center={mapCenter} zoom={mapZoom} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={[25.0800, 55.1400]}>
                <Popup>Dubai Marina</Popup>
              </Marker>
              <Marker position={[25.1972, 55.2744]}>
                <Popup>Downtown Dubai</Popup>
              </Marker>
              <Marker position={[25.1860, 55.2630]}>
                <Popup>Business Bay</Popup>
              </Marker>
              <Marker position={[25.1124, 55.1390]}>
                <Popup>Palm Jumeirah</Popup>
              </Marker>
              <Marker position={[24.4539, 54.3773]}>
                <Popup>Abu Dhabi</Popup>
              </Marker>
              <Marker position={[25.3463, 55.4209]}>
                <Popup>Sharjah</Popup>
              </Marker>
              <Marker position={[25.4052, 55.5136]}>
                <Popup>Ajman</Popup>
              </Marker>
              <Marker position={[24.2075, 55.7447]}>
                <Popup>Al Ain</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-28 bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Loved by Dubai residents</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="rounded-2xl bg-card border border-border p-7 shadow-soft hover:shadow-card transition-shadow animate-float-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
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
              Ready to make your move?
            </h2>
            <p className="relative mt-4 text-white/90 text-lg max-w-xl mx-auto">
              Get a free quote in 60 seconds. No commitment, no hidden fees.
            </p>
            <Link to="/booking" className="relative inline-block mt-8">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-base font-semibold shadow-elegant"
              >
                Book Your Move Now <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}