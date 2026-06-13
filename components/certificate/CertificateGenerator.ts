import jsPDF from 'jspdf';

export interface CertificateData {
  userName: string;
  wpm: number;
  accuracy: number;
  date: string;
}

export function generateCertificate({ userName, wpm, accuracy, date }: CertificateData): jsPDF {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Outer border
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  // Inner border
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.rect(16, 16, 265, 178);

  // Title
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Certificate of Achievement', 148.5, 50, { align: 'center' });

  // Brand
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(59, 130, 246);
  doc.text('TypeFast — Typing Test Platform', 148.5, 60, { align: 'center' });

  // Body
  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105);
  doc.text('This certifies that', 148.5, 80, { align: 'center' });

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(userName, 148.5, 95, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `has achieved a typing speed of ${wpm} WPM with ${accuracy}% accuracy.`,
    148.5,
    110,
    { align: 'center' }
  );

  doc.setFontSize(12);
  doc.text(`Awarded on ${date}`, 148.5, 140, { align: 'center' });

  return doc;
}

export function downloadCertificate(data: CertificateData) {
  const doc = generateCertificate(data);
  doc.save(`certificate-${data.userName.replace(/\s+/g, '-')}-${data.date}.pdf`);
}

export function certificateToBase64(data: CertificateData): string {
  const doc = generateCertificate(data);
  return doc.output('datauristring').split(',')[1]; // base64 payload only
}
