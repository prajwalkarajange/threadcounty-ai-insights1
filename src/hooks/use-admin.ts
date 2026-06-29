import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

type AdminState = {
  loading: boolean;
  isAdmin: boolean;
};

export function useAdmin(): AdminState {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    async function checkRole() {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.role === "admin");
      }

      setLoading(false);
    }

    checkRole();
  }, [user, authLoading]);

  return {
    loading,
    isAdmin,
  };
}