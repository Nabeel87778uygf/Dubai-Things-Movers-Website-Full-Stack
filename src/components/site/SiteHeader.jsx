import { Link } from "@tanstack/react-router";
import { Truck, Globe, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const [role, setRole] = useState(
    typeof window !== "undefined" ? localStorage.getItem("role") : null
  );

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

  // Sync role across tabs and same tab (custom event)
  useEffect(() => {
    const syncRole = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", syncRole);
    window.addEventListener("roleChange", syncRole);

    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener("roleChange", syncRole);
    };
  }, []);

  // Set initial language and direction from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n]);

  const changeLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const nav = [
    { to: "/", label: t("navbar.home") },
    { to: "/booking", label: t("navbar.booking") },
    ...(role === "admin" ? [{ to: "/admin", label: t("navbar.admin") }] : []),
    ...(role === "customer"
      ? [{ to: "/Customer", label: t("navbar.dashboard") }]
      : []),
    ...(role === "driver"
      ? [{ to: "/Driver", label: t("navbar.driverDashboard") }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-soft group-hover:shadow-glow transition-shadow">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            {i18n.language === "ar" ? "موف ميت" : "MoveMate"}
            <span className="text-primary">.ae</span>
          </span>
        </Link>

        <nav
          className={`hidden md:flex items-center gap-1 ${i18n.language === "ar" ? "flex-row-reverse" : ""
            }`}
        >
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
            onClick={changeLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            {i18n.language === "en" ? "AR" : "EN"}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {role ? (
            <Link
              to={
                role === "admin"
                  ? "/admin"
                  : role === "driver"
                    ? "/Driver"
                    : "/Customer"
              }
            >
              <Button variant="outline" size="sm">
                {t("navbar.dashboard")}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                {t("navbar.signin")}
              </Button>
            </Link>
          )}

          <Link to="/booking">
            <Button
              size="sm"
              className="bg-gradient-primary hover:opacity-90 shadow-soft"
            >
              {t("navbar.booking")}
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-float-up">
          <div
            className={`px-4 py-3 flex flex-col gap-1 ${i18n.language === "ar" ? "text-right" : "text-left"
              }`}
          >
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

            {role ? (
              <Link
                to={
                  role === "admin"
                    ? "/admin"
                    : role === "driver"
                      ? "/Driver"
                      : "/Customer"
                }
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
              >
                {t("navbar.dashboard")}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
              >
                {t("navbar.signin")}
              </Link>
            )}

            <button
              onClick={() => {
                changeLanguage();
                setOpen(false);
              }}
              className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary flex items-center gap-2 cursor-pointer w-full text-left rtl:text-right"
            >
              <Globe className="h-4 w-4" />
              <span>{i18n.language === "en" ? "العربية" : "English"}</span>
            </button>

            <button
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary flex items-center gap-2 cursor-pointer w-full text-left rtl:text-right"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span>{i18n.language === "en" ? "Light Mode" : "الوضع المضيء"}</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span>{i18n.language === "en" ? "Dark Mode" : "الوضع الداكن"}</span>
                </>
              )}
            </button>

            <Link to="/booking" onClick={() => setOpen(false)}>
              <Button className="w-full mt-2 bg-gradient-primary">
                {t("navbar.booking")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}