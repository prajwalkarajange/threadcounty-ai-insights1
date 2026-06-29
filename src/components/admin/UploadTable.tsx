import { Eye, Trash2 } from "lucide-react";

import { useUploads } from "@/hooks/use-uploads";
import { supabase } from "@/integrations/supabase/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UploadTable() {
  const { uploads, loading, deleteUpload } = useUploads();

  if (loading) {
    return <div className="rounded-xl border p-8 text-center">Loading uploads...</div>;
  }

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Uploaded Images</h2>

        <p className="text-muted-foreground">Total Uploads : {uploads.length}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>

            <TableHead>File Name</TableHead>

            <TableHead>Size</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Date</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {uploads.map((upload) => {
            const imageUrl = supabase.storage
              .from("fabric-uploads")
              .getPublicUrl(upload.storage_path).data.publicUrl;

            return (
              <TableRow key={upload.id}>
                <TableCell>
                  <img
                    src={imageUrl}
                    alt="Fabric"
                    className="h-14 w-14 rounded-lg object-cover border"
                  />
                </TableCell>

                <TableCell className="max-w-xs truncate">{upload.original_name}</TableCell>

                <TableCell>{(upload.file_size_bytes / 1024 / 1024).toFixed(2)} MB</TableCell>

                <TableCell>
                  <Badge>{upload.status}</Badge>
                </TableCell>

                <TableCell>{new Date(upload.created_at).toLocaleDateString()}</TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => window.open(imageUrl, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Delete this upload?")) {
                          deleteUpload(upload.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
