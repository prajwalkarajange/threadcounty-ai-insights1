import { createFileRoute } from "@tanstack/react-router";

import UploadTable from "@/components/admin/UploadTable";

export const Route = createFileRoute("/_authenticated/admin/uploads")({
  component: UploadPage,
});

function UploadPage() {
  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Uploads
        </h1>

        <p className="text-muted-foreground">
          Manage uploaded fabric images.
        </p>

      </div>

      <UploadTable />

    </div>
  );
}