import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAdmin } from "@/hooks/use-admin";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import RecentActivity from "@/components/admin/RecentActivity";
import LatestAnalysis from "@/components/admin/LatestAnalysis";


import {
  Users,
  Upload,
  BrainCircuit,
  Star,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

import StatCard from "@/components/admin/StatCard";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminPage,
});

function AdminPage() {
  const stats = useAdminDashboard();
  const { loading, isAdmin } = useAdmin();

  if (loading) {
    return <div className="p-10">Checking admin access...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/upload" />;
  }

  return (
    

<div className="space-y-8">

  {/* Statistics */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

    <StatCard
      title="Total Users"
      value={stats.users}
      icon={Users}
    />

    <StatCard
      title="Uploads"
      value={stats.uploads}
      icon={Upload}
    />

    <StatCard
      title="AI Analysis"
      value={stats.analyses}
      icon={BrainCircuit}
    />

    <StatCard
      title="Average Quality"
      value={`${stats.avgQuality}%`}
      icon={Star}
    />

  </div>

  {/* Charts + Activity */}
  <div className="grid lg:grid-cols-2 gap-6">

    <AnalyticsDashboard />

    <RecentActivity />

  </div>

  {/* Latest Analysis */}
  <LatestAnalysis />

</div>


  );
}