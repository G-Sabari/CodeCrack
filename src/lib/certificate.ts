import jsPDF from "jspdf";
import QRCode from "qrcode";

export type CertificateData = {
  code: string;
  recipientName: string;
  contestTitle: string;
  rank: number;
  score: number;
  totalPoints: number;
  issuedAt: string;
  citation?: string;
  certificateType?: string;
  percentage?: number;
  accuracy?: number;
};



function generateCode() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CC-${year}-${rand}`;
}

export async function buildCertificatePdf(data: CertificateData, verifyUrl: string): Promise<Blob> {
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();

  // Background
  pdf.setFillColor(15, 12, 30);
  pdf.rect(0, 0, w, h, "F");

  // Decorative border
  pdf.setDrawColor(150, 100, 255);
  pdf.setLineWidth(3);
  pdf.rect(24, 24, w - 48, h - 48);
  pdf.setLineWidth(1);
  pdf.setDrawColor(90, 60, 180);
  pdf.rect(34, 34, w - 68, h - 68);

  // Title
  pdf.setTextColor(220, 210, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(36);
  pdf.text("CERTIFICATE OF ACHIEVEMENT", w / 2, 110, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(170, 160, 200);
  pdf.text("CodeCrack • Weekly Contest", w / 2, 138, { align: "center" });

  pdf.setFontSize(16);
  pdf.text("This certifies that", w / 2, 200, { align: "center" });

  // Name
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(40);
  pdf.setTextColor(255, 255, 255);
  pdf.text(data.recipientName, w / 2, 250, { align: "center" });

  // Underline
  const nameWidth = pdf.getTextWidth(data.recipientName);
  pdf.setDrawColor(150, 100, 255);
  pdf.setLineWidth(1.5);
  pdf.line(w / 2 - nameWidth / 2, 260, w / 2 + nameWidth / 2, 260);

  // Body
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(15);
  pdf.setTextColor(200, 195, 220);
  pdf.text(
    `has successfully completed ${data.contestTitle},`,
    w / 2,
    300,
    { align: "center" },
  );
  pdf.text(
    `achieving Rank #${data.rank} with a score of ${data.score} / ${data.totalPoints} points.`,
    w / 2,
    324,
    { align: "center" },
  );

  // Optional AI citation
  if (data.citation) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(12);
    pdf.setTextColor(190, 180, 230);
    const lines = pdf.splitTextToSize(`"${data.citation}"`, w - 220);
    pdf.text(lines, w / 2, 352, { align: "center" });
  }

  // Type badge
  if (data.certificateType) {
    const label = data.certificateType.replace(/_/g, " ").toUpperCase();
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(255, 215, 100);
    pdf.text(label, w / 2, 168, { align: "center" });
  }


  // Stats row
  const stats = [
    { label: "RANK", value: `#${data.rank}` },
    { label: "SCORE", value: `${data.score}` },
    { label: "CONTEST", value: `${data.contestTitle.slice(0, 22)}` },
  ];
  const statsY = 380;
  const statW = 160;
  const totalW = stats.length * statW + (stats.length - 1) * 20;
  let x = (w - totalW) / 2;
  for (const s of stats) {
    pdf.setDrawColor(80, 60, 140);
    pdf.setFillColor(30, 22, 60);
    pdf.roundedRect(x, statsY, statW, 60, 8, 8, "FD");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(150, 140, 200);
    pdf.text(s.label, x + statW / 2, statsY + 22, { align: "center" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(255, 255, 255);
    pdf.text(s.value, x + statW / 2, statsY + 46, { align: "center" });
    x += statW + 20;
  }

  // Footer: date, code, qr
  const date = new Date(data.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(170, 160, 200);
  pdf.text(`Issued: ${date}`, 70, h - 70);
  pdf.text(`Certificate ID: ${data.code}`, 70, h - 52);
  pdf.text(`Verify at: ${verifyUrl}`, 70, h - 34);

  // QR code
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 220,
      color: { dark: "#FFFFFF", light: "#0F0C1E" },
    });
    pdf.addImage(qrDataUrl, "PNG", w - 130, h - 130, 80, 80);
  } catch {
    // ignore
  }

  return pdf.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export { generateCode };
