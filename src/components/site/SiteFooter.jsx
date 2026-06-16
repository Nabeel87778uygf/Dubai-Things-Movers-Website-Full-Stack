import { Link } from "@tanstack/react-router";
import { Truck, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">MoveMate.ae</span>
          </div>
          <p className="text-sm text-sidebar-foreground/70 max-w-md leading-relaxed">
            Dubai's most trusted moving company. Premium home, office and furniture relocation
            services with insured handling and on-time delivery.
          </p>
          <div className="flex gap-3 mt-6">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-lg bg-sidebar-accent grid place-items-center hover:bg-sidebar-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-sidebar-foreground/90">
            Services
          </h4>
          <ul className="space-y-2.5 text-sm text-sidebar-foreground/70">
            <li>
              <Link to="/booking" className="hover:text-sidebar-foreground transition-colors">
                Home Shifting
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-sidebar-foreground transition-colors">
                Office Relocation
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-sidebar-foreground transition-colors">
                Furniture Moving
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-sidebar-foreground transition-colors">
                Packing Services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-sidebar-foreground/90">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-sidebar-foreground/70">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-sidebar-primary" /> Business Bay, Dubai, UAE
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-sidebar-primary" /> +971 50 123 4567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-sidebar-primary" /> hello@movemate.ae
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sidebar-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-sidebar-foreground/60 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} MoveMate.ae — All rights reserved.</p>
          <p>Licensed by Dubai DED · Fully Insured</p>
        </div>
      </div>
    </footer>
  );
}
