import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAdmin } from "@/hooks/use-admin";
import AdminLayout from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  const { loading, isAdmin } = useAdmin();

  if (loading) {
    return <div className="p-10">Checking admin access...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/upload" />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}