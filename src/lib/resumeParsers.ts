// Client-side text extraction for PDF & DOCX
import mammoth from "mammoth";

export async function extractPdfText(file: File | Blob): Promise<string> {
  // Dynamic import to avoid SSR / heavy initial bundle
  const pdfjs: any = await import("pdfjs-dist/build/pdf.mjs");
  // Use worker from CDN matching version
  const workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it: any) => it.str).join(" ") + "\n";
  }
  return out.trim();
}

export async function extractDocxText(file: File | Blob): Promise<string> {
  const buf = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
  return (value || "").trim();
}

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") return extractPdfText(file);
  if (name.endsWith(".docx") || file.type.includes("wordprocessingml")) return extractDocxText(file);
  if (name.endsWith(".txt") || file.type === "text/plain") return (await file.text()).trim();
  throw new Error("Unsupported file type. Please upload PDF, DOCX or TXT.");
}
