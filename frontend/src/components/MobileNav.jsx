import { Link, useLocation } from "react-router";
import { HomeIcon, UsersIcon, BellIcon, MessageSquareIcon } from "lucide-react";

const MobileNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Don't show on chat page (full-screen chat experience)
    if (currentPath.startsWith("/chat") || currentPath.startsWith("/call")) return null;

    const navItems = [
        { to: "/", icon: HomeIcon, label: "Home" },
        { to: "/friends", icon: UsersIcon, label: "Friends" },
        { to: "/notifications", icon: BellIcon, label: "Alerts" },
    ];

    return (
        <nav className="mobile-nav lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-200/95 backdrop-blur-md border-t border-base-300 safe-area-bottom">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {navItems.map(({ to, icon: Icon, label }) => {
                    const isActive = currentPath === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-all duration-200 ${isActive
                                ? "text-primary"
                                : "text-base-content/60 hover:text-base-content active:scale-95"
                                }`}
                        >
                            <Icon className={`size-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
                            <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                                {label}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;
