import { useCallback, useRef, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  extracting?: boolean;
}

export function ResumeUploadCard({ file, onFileChange, accept, maxSizeMB = 5, label = "Upload Resume", description = "PDF or DOCX, up to 5 MB", extracting }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const validate = (f: File) => {
    setError(null);
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB} MB.`);
      return false;
    }
    const okExts = accept.split(",").map((s) => s.trim().toLowerCase());
    const name = f.name.toLowerCase();
    if (!okExts.some((ext) => name.endsWith(ext))) {
      setError(`Only ${accept} allowed.`);
      return false;
    }
    return true;
  };

  const handleFile = useCallback((f: File | null) => {
    if (!f) { onFileChange(null); return; }
    if (!validate(f)) return;
    // simulate progress for UX
    setProgress(20);
    setTimeout(() => setProgress(70), 120);
    setTimeout(() => { setProgress(100); onFileChange(f); }, 300);
  }, [onFileChange]);

  return (
    <Card className={cn("p-6 border-2 border-dashed transition-all", dragOver ? "border-primary bg-primary/5" : "border-border")}>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className="flex flex-col items-center justify-center py-10 text-center gap-3 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            {progress < 100 && <Progress value={progress} className="h-1 mt-2" />}
            {extracting && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> Extracting text…
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>Replace</Button>
          <Button variant="ghost" size="icon" onClick={() => { onFileChange(null); setProgress(0); }}>
            <X className="w-4 h-4" />
          </Button>
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
        </div>
      )}
      {error && <p className="text-sm text-destructive mt-3">{error}</p>}
    </Card>
  );
}
