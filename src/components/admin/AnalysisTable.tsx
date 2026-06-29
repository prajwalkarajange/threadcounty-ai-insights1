import { Eye } from "lucide-react";
import { useState } from "react";

import { useAnalysis } from "@/hooks/use-analysis";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AnalysisTable() {
  const { analysis, loading } = useAnalysis();
  const [selected, setSelected] = useState<any | null>(null);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <>
      <div className="rounded-2xl border bg-card p-6">

        <h2 className="text-2xl font-bold mb-4">
          AI Analysis
        </h2>

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>Fabric</TableHead>

              <TableHead>Confidence</TableHead>

              <TableHead>Quality</TableHead>

              <TableHead>Date</TableHead>

              <TableHead></TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {analysis.map((item) => (

              <TableRow key={item.id}>

                <TableCell>

                  {item.fabric_type}

                </TableCell>

                <TableCell>

                  <Badge>

                    {item.confidence}%

                  </Badge>

                </TableCell>

                <TableCell>

                  ⭐ {item.quality_score}

                </TableCell>

                <TableCell>

                  {new Date(item.created_at).toLocaleDateString()}

                </TableCell>

                <TableCell>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setSelected(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

      <Dialog
        open={!!selected}
        onOpenChange={() => setSelected(null)}
      >
        <DialogContent className="max-w-3xl">

          {selected && (

            <>
              <DialogHeader>

                <DialogTitle>

                  {selected.fabric_type}

                </DialogTitle>

              </DialogHeader>

              <div className="space-y-4">

                <p>
                  <b>Confidence:</b> {selected.confidence}%
                </p>

                <p>
                  <b>Quality Score:</b> {selected.quality_score}
                </p>

                <p>
                  <b>Texture:</b><br />
                  {selected.texture}
                </p>

                <p>
                  <b>Color Analysis:</b><br />
                  {selected.color_analysis}
                </p>

                <p>
                  <b>Weave Pattern:</b><br />
                  {selected.weave_pattern}
                </p>

                <p>
                  <b>Summary:</b><br />
                  {selected.summary}
                </p>

              </div>

            </>

          )}

        </DialogContent>

      </Dialog>
    </>
  );
}