import { Bell, ChevronRight, UserCircle, ChevronDown, LogOut, Settings, User } from "lucide-react";

import { ThemeToggle } from "@/components/site/theme-toggle";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminHeader() {
  const profile = useProfile();

  return (
    <header className="h-20 border-b bg-background px-8 flex items-center justify-between">
      {/* Left Side */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {profile?.full_name || "Administrator"} 👋
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-full p-2 hover:bg-muted transition">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4 font-semibold">Notifications</div>

            <DropdownMenuSeparator />

            <DropdownMenuItem>No new notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full border bg-card px-3 py-2 hover:bg-muted transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-lg">
                {(profile?.full_name || "A").charAt(0).toUpperCase()}
              </div>

              <div className="text-left hidden md:block">
                <p className="font-semibold">{profile?.full_name || "Administrator"}</p>
              </div>

              <ChevronDown size={18} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 bg-popover text-popover-foreground">
            <div className="px-3 py-3">
              <p className="font-semibold">{profile?.full_name}</p>

              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => supabase.auth.signOut()}
              className="text-red-500 focus:text-white focus:bg-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
