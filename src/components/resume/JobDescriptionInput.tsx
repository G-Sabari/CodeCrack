import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Loader2 } from "lucide-react";
import { extractTextFromFile } from "@/lib/resumeParsers";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function JobDescriptionInput({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5 MB.");
      return;
    }
    try {
      setLoading(true);
      const text = await extractTextFromFile(file);
      onChange(text);
      toast.success("Job description extracted");
    } catch (e: any) {
      toast.error(e.message || "Failed to extract text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="paste">
        <TabsList>
          <TabsTrigger value="paste">Paste Text</TabsTrigger>
          <TabsTrigger value="upload">Upload File</TabsTrigger>
        </TabsList>
        <TabsContent value="paste" className="mt-3">
          <Textarea
            placeholder="Paste the full job description here…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[180px]"
          />
          <p className="text-xs text-muted-foreground mt-2">{value.length.toLocaleString()} characters</p>
        </TabsContent>
        <TabsContent value="upload" className="mt-3">
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg py-8 cursor-pointer hover:bg-muted/30 transition">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Upload className="w-6 h-6 text-primary" />}
            <span className="text-sm font-medium">Upload PDF or TXT</span>
            <span className="text-xs text-muted-foreground">Text will be extracted automatically</span>
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
          </label>
          {value && <p className="text-xs text-muted-foreground mt-2">Loaded {value.length.toLocaleString()} characters</p>}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
