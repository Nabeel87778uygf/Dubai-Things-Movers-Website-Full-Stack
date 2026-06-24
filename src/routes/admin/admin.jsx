import {
    createFileRoute,
    Link,
    Outlet,
    useRouterState,
    useNavigate,
    redirect,
} from "@tanstack/react-router";
import { useEffect } from "react";
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    LogOut,
    Truck,
    Bell,
    Search,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin/admin")({
    beforeLoad: () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

        if (!token) {
            throw redirect({ to: "/login" });
        } else if (role !== "admin") {
            throw redirect({ to: "/" });
        }
    },
    head: () => ({ meta: [{ title: "Admin Dashboard — MoveMate" }] }),
    component: AdminLayout,
});

const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
    { to: "/admin/employees", label: "Employees", icon: Users },
];

function AdminLayout() {
    const pathname = useRouterState({
        select: (s) => s.location.pathname || "",
    });
    const navigate = useNavigate();

    // PROTECTED ROUTE
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
            navigate({ to: "/login", replace: true });
        } else if (role !== "admin") {
            navigate({ to: "/", replace: true });
        }
    }, [navigate, pathname]);

    // optional: better UX (prevent flicker)
    if (!localStorage.getItem("token") || localStorage.getItem("role") !== "admin") {
        return null;
    }

    return (
        <div className="min-h-screen flex bg-secondary/30 w-full">
            {/* SIDEBAR */}
            <aside className="hidden md:flex w-64 bg-sidebar text-sidebar-foreground flex-col border-r border-border">
                <Link
                    to="/"
                    className="h-16 px-6 flex items-center gap-2 border-b border-sidebar-border"
                >
                    <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center">
                        <Truck className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-display font-bold text-foreground">MoveMate</span>
                </Link>

                <nav className="flex-1 p-4 space-y-1">
                    {nav.map((n) => {
                        const active = n.exact
                            ? pathname === n.to
                            : pathname.startsWith(n.to);

                        return (
                            <Link
                                key={n.to}
                                to={n.to}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                    }`}
                            >
                                <n.icon className="h-4 w-4" />
                                {n.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* LOGOUT */}
                <div className="p-4 border-t border-sidebar-border">
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("userId");
                            window.dispatchEvent(new Event("storage")); // Header ko update karo
                            navigate({ to: "/login", replace: true });
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent w-full cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" /> Sign out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER */}
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                placeholder="Search bookings, customers..."
                                className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/60 border border-transparent focus:border-border focus:bg-background outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative h-10 w-10 rounded-lg hover:bg-secondary grid place-items-center">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
                        </button>

                        <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>

            <Toaster />
        </div>
    );
}