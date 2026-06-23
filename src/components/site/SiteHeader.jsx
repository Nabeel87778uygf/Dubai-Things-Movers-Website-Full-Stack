import { Link } from "@tanstack/react-router";
import { Truck, Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const [role, setRole] = useState(
    typeof window !== "undefined" ? localStorage.getItem("role") : null
  );

  // Jab bhi login/logout ho, role update karo
  useEffect(() => {
    const syncRole = () => {
      setRole(localStorage.getItem("role"));
    };
    // Browser ka built-in storage event (different tabs ke liye)
    window.addEventListener("storage", syncRole);
    // Same tab ke liye custom event (login.jsx already dispatch karta hai)
    window.addEventListener("storage", syncRole);
    return () => {
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  const nav = [
    { to: "/", label: "Home" },
    { to: "/booking", label: "Book Now" },
    ...(role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-soft group-hover:shadow-glow transition-shadow">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            MoveMate<span className="text-primary">.ae</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
              activeProps={{
                className:
                  "px-4 py-2 text-sm font-semibold text-foreground rounded-lg bg-secondary",
              }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "EN" ? "AR" : "EN")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Globe className="h-4 w-4" /> {lang}
          </button>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/booking">
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 shadow-soft">
              Book Now
            </Button>
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-float-up">
          <div className="px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
            >
              Sign in
            </Link>
            <Link to="/booking" onClick={() => setOpen(false)}>
              <Button className="w-full mt-2 bg-gradient-primary">Book Now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
