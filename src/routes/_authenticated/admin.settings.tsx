import { createFileRoute } from "@tanstack/react-router";
import SettingsPanel from "@/components/admin/SettingsPanel";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-muted-foreground">
          Manage system information.
        </p>
      </div>

      <SettingsPanel />

    </div>
  );
}