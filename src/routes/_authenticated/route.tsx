import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/site/site-nav";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,

  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }

    return { user: data.user };
  },

  component: () => {
    const pathname = window.location.pathname;
    const isAdmin = pathname.startsWith("/admin");

    return (
      <div className="min-h-screen flex flex-col">
        {!isAdmin && <SiteNav />}

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  },
});