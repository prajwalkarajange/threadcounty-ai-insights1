import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  role: string;
};

export function useUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profileError) {
      console.error(profileError);
      setLoading(false);
      return;
    }

    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    const formatted =
      profiles?.map((profile) => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        role: roles?.find((r) => r.user_id === profile.id)?.role ?? "user",
      })) ?? [];

    setUsers(formatted);
    setLoading(false);
  }
  async function deleteUser(id: string) {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    console.error(error);
    return;
  }

  loadUsers();
}

  return {
  users,
  loading,
  refresh: loadUsers,
  deleteUser,
};
}
