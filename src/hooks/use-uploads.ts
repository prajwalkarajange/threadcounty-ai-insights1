import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUploads() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUploads();
  }, []);

  async function loadUploads() {
    setLoading(true);

    const { data, error } = await supabase
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setUploads(data ?? []);
    }

    setLoading(false);
  }
 async function deleteUpload(id: string) {
  console.log("Delete button clicked");
  console.log("Upload ID:", id);

  const { error } = await supabase
    .from("uploads")
    .delete()
    .eq("id", id);

  console.log("Supabase error:", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Deleted successfully!");

  loadUploads();
}

return {
  uploads,
  loading,
  refresh: loadUploads,
  deleteUpload,
};
}