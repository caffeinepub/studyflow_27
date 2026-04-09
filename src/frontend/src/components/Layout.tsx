import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  CheckSquare,
  GraduationCap,
  LayoutDashboard,
  Timer,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type NavPath = "/" | "/subjects" | "/assignments" | "/calendar" | "/timer";

const NAV_LINKS: {
  to: NavPath;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact: boolean;
}[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/subjects", label: "Subjects", icon: BookOpen, exact: false },
  { to: "/assignments", label: "Assignments", icon: CheckSquare, exact: false },
  { to: "/calendar", label: "Calendar", icon: Calendar, exact: false },
  { to: "/timer", label: "Focus Timer", icon: Timer, exact: false },
];

function NavLink({
  to,
  label,
  icon: Icon,
  exact,
}: {
  to: NavPath;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact: boolean;
}) {
  const state = useRouterState();
  const pathname = state.location.pathname;
  const isActive = exact ? pathname === to : pathname.startsWith(to);

  return (
    <Link
      to={to}
      data-ocid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon
        className={cn(
          "size-4 flex-shrink-0",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      />
      <span className="truncate">{label}</span>
      {isActive && (
        <span className="ml-auto size-1.5 rounded-full bg-primary flex-shrink-0" />
      )}
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <GraduationCap className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sidebar-foreground text-lg tracking-tight">
            StudyFlow
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
            Navigation
          </p>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} {...link} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Built with caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center px-4 gap-3">
        <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
          <GraduationCap className="size-3.5 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-foreground text-base">
          StudyFlow
        </span>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex">
        {NAV_LINKS.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            data-ocid={`mobile-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-muted-foreground"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact }}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">
              {label.split(" ")[0]}
            </span>
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 min-w-0 md:pt-0 pt-14 pb-16 md:pb-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default Layout;
