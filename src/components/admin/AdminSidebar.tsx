import {
  LayoutDashboard,
  Users,
  Upload,
  BrainCircuit,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { title: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { title: "Users", to: "/admin/users", icon: Users },
  { title: "Uploads", to: "/admin/uploads", icon: Upload },
  { title: "Analysis", to: "/admin/analysis", icon: BrainCircuit },
  { title: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <aside className="w-72 border-r bg-card flex flex-col">

      {/* Logo */}
      <div className="h-20 border-b flex items-center px-7">

        <div className="h-11 w-11 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-lg">
          🧵
        </div>

        <div className="ml-3">

          <h1 className="text-2xl font-bold">
            Thread<span className="text-orange-500">County</span>
          </h1>

          <p className="text-xs text-muted-foreground">
            Admin Panel
          </p>

        </div>

      </div>

      {/* Menu */}
      <nav className="flex-1 p-5 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
  item.to === "/admin"
    ? pathname === "/admin"
    : pathname.startsWith(item.to);
          return (
            <Link
              key={item.title}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200

              ${
                active
                  ? "bg-orange-500 text-white shadow-md"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="border-t p-5">

        <button
          onClick={() => supabase.auth.signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut size={20} />

          Logout
        </button>

      </div>

    </aside>
  );
}