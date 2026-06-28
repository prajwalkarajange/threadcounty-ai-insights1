import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload as UploadIcon,
  X,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  FileImage,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { analyzeUpload } from "@/lib/analyze.functions";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({ meta: [{ title: "Upload Fabric — ThreadCounty" }] }),
  component: UploadPage,
});

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ["image/png", "image/jpeg", "image/webp"];

function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeUpload);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "uploading" | "analyzing">("idle");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onPick = useCallback((f: File | null) => {
    if (!f) return;
    if (!ACCEPT.includes(f.type)) return toast.error("Use PNG, JPEG, or WEBP");
    if (f.size > MAX_BYTES) return toast.error("Max file size is 10 MB");
    setFile(f);
  }, []);

  async function onAnalyze() {
    if (!file || !user) return;
    try {
      setPhase("uploading");
      setProgress(10);
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("fabric-uploads")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      setProgress(55);

      const { data: row, error: rowErr } = await supabase
        .from("uploads")
        .insert({
          user_id: user.id,
          storage_path: path,
          mime_type: file.type,
          file_size_bytes: file.size,
          original_name: file.name,
        })
        .select()
        .single();
      if (rowErr) throw rowErr;
      setProgress(70);

      setPhase("analyzing");
      const { analysisId } = await analyze({ data: { uploadId: row.id } });
      setProgress(100);
      toast.success("Analysis complete.");
      navigate({ to: "/analysis/$id", params: { id: analysisId } });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
      setPhase("idle");
      setProgress(0);
    }
  }

  return (
    <div className="hero-radial">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-thread">
            Step 01 · Upload
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Drop a fabric photo.</h1>
          <p className="mt-3 text-sm text-muted-foreground">PNG, JPEG, or WEBP · up to 10 MB</p>
        </div>

        <div className="mt-10">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT.join(",")}
            className="sr-only"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />

          {!file && (
            <motion.button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                onPick(e.dataTransfer.files?.[0] ?? null);
              }}
              whileHover={{ scale: 1.005 }}
              className={`relative w-full rounded-3xl border-2 border-dashed p-12 sm:p-16 text-center transition-colors ${
                dragOver
                  ? "border-thread bg-thread/5"
                  : "border-border bg-card/40 hover:border-thread/60"
              }`}
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl gradient-thread glow-thread">
                <UploadIcon className="h-7 w-7 text-[color:var(--accent-foreground)]" />
              </div>
              <p className="mt-6 font-display text-2xl">Drop your fabric image here</p>
              <p className="mt-2 text-sm text-muted-foreground">or click to browse</p>
              <div className="mt-6 flex justify-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                <span>PNG</span>·<span>JPEG</span>·<span>WEBP</span>
              </div>
            </motion.button>
          )}

          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border bg-card overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                  <div className="relative aspect-square bg-muted max-w-[250px]">
                    {preview && (
                      <img
                        src={preview}
                        alt="Fabric preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6 flex flex-col">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg gradient-thread shrink-0">
                        <FileImage className="h-5 w-5 text-[color:var(--accent-foreground)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium max-w-[280px] truncate" title={file.name}>
                          {file.name.length > 35 ? file.name.substring(0, 35) + "..." : file.name}
                        </p>

                        <p className="text-xs font-mono text-muted-foreground mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                          {file.type.replace("image/", "").toUpperCase()}
                        </p>
                      </div>
                      {phase === "idle" && (
                        <Button size="icon" variant="ghost" onClick={() => setFile(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {phase !== "idle" && (
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
                          <span>{phase === "uploading" ? "Uploading" : "Analyzing with AI"}</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                        {phase === "analyzing" && (
                          <p className="text-xs text-muted-foreground flex items-center gap-2 mt-3">
                            <Loader2 className="h-3 w-3 animate-spin text-thread" /> Vision model is
                            examining the weave — usually under 5s.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-6 flex flex-col-reverse sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        className="sm:flex-1"
                        onClick={() => inputRef.current?.click()}
                        disabled={phase !== "idle"}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" /> Choose different
                      </Button>
                      <Button
                        onClick={onAnalyze}
                        disabled={phase !== "idle"}
                        className="sm:flex-1 gradient-thread text-[color:var(--accent-foreground)] border-0"
                      >
                        {phase !== "idle" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" /> Analyze with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
