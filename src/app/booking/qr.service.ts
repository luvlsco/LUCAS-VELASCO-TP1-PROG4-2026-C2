import { Injectable } from '@angular/core';

export interface TicketPdfData {
  purchaseId: number;
  movie: string;
  date: string;
  time: string;
  room: string;
  format: string;
  seats: { id: string; price: number }[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class QrService {
  code(purchaseId: number): string {
    return `cine:${purchaseId}`;
  }

  async toDataUrl(text: string): Promise<string> {
    const { default: QRCode } = await import('qrcode');
    return QRCode.toDataURL(text, { width: 200 });
  }

  async ticketPdf(data: TicketPdfData, qrDataUrl: string): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    let y = 20;
    pdf.setFontSize(16);
    pdf.text(data.movie, 10, y);
    pdf.setFontSize(12);
    for (const line of [
      `Compra ${data.purchaseId} · ${data.date} ${data.time}`,
      `${data.room} · ${data.format}`,
      ...data.seats.map((s) => `${s.id} · $${s.price}`),
      `Total: $${data.total}`,
    ]) {
      y += 10;
      pdf.text(line, 10, y);
    }
    pdf.addImage(qrDataUrl, 'PNG', 10, y + 10, 60, 60);
    pdf.save(`entrada-${data.purchaseId}.pdf`);
  }
}
