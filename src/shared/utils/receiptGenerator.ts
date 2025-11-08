import jsPDF from 'jspdf';

interface ReceiptData {
  transactionId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  createdAt: Date;
  studentName?: string;
  studentEmail?: string;
}

export const generateReceipt = (payment: ReceiptData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Page setup
  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  
  let y = 20;

  // === MINIMALIST BLACK & WHITE HEADER ===
  
  // Top border line - thick and bold
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Company name - bold and minimal
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('ASKYOUR TUTOR', margin, y);
  
  // Receipt number aligned right
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${payment.transactionId.slice(-8).toUpperCase()}`, pageWidth - margin, y, { align: 'right' });
  
  y += 8;
  
  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Online Learning Platform', margin, y);
  
  y += 3;
  
  // Thin separator line
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  // Document title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', margin, y);
  
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Official Transaction Record', margin, y);
  
  y += 15;

  // === TRANSACTION INFORMATION SECTION ===
  
  // Section header
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION INFORMATION', margin, y);
  
  y += 2;
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Transaction details in two columns
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  
  // Left column labels
  const labelX = margin;
  const valueX = margin + 50;
  
  // Transaction ID
  doc.text('Transaction ID:', labelX, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(payment.transactionId, valueX, y);
  y += 7;
  
  // Date & Time
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Date & Time:', labelX, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const dateStr = new Date(payment.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  doc.text(dateStr, valueX, y);
  y += 7;
  
  // Payment Method
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Payment Method:', labelX, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(payment.paymentMethod, valueX, y);
  y += 7;
  
  // Payment Status
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Payment Status:', labelX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('✓ COMPLETED', valueX, y);
  y += 7;
  
  // Currency
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Currency:', labelX, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(payment.currency, valueX, y);
  
  y += 12;

  // === COURSE DETAILS SECTION ===
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('COURSE DETAILS', margin, y);
  
  y += 2;
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Course Name:', labelX, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  // Wrap long course titles
  const courseLines = doc.splitTextToSize(payment.courseTitle, contentWidth - 50);
  doc.text(courseLines, valueX, y);
  y += courseLines.length * 6 + 4;

  // === CUSTOMER INFORMATION SECTION (if available) ===
  
  if (payment.studentName || payment.studentEmail) {
    y += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER INFORMATION', margin, y);
    
    y += 2;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    
    doc.setFontSize(9);
    
    if (payment.studentName) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text('Full Name:', labelX, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(payment.studentName, valueX, y);
      y += 7;
    }
    
    if (payment.studentEmail) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text('Email Address:', labelX, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(payment.studentEmail, valueX, y);
      y += 7;
    }
  }

  // === AMOUNT SECTION - PROMINENT BOX ===
  
  y += 10;
  
  // Double border box for emphasis
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(2);
  doc.rect(margin, y, contentWidth, 30);
  
  doc.setLineWidth(0.5);
  doc.rect(margin + 2, y + 2, contentWidth - 4, 26);
  
  y += 12;
  
  // Amount label
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('TOTAL AMOUNT PAID', margin + 5, y);
  
  y += 10;
  
  // Amount value - large and prominent
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(`${payment.currency} $${payment.amount.toFixed(2)}`, pageWidth - margin - 5, y, { align: 'right' });
  
  y += 20;

  // === TERMS & CONDITIONS ===
  
  y += 5;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TERMS & CONDITIONS', margin, y);
  
  y += 2;
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const terms = [
    '• This receipt confirms your payment for the course enrollment.',
    '• All sales are final. Refunds are subject to our refund policy.',
    '• Access to course materials will be provided within 24 hours.',
    '• For support or inquiries, contact us at support@askyourtutor.com',
    '• Keep this receipt for your records.'
  ];
  
  terms.forEach(term => {
    doc.text(term, margin, y);
    y += 5;
  });

  // === FOOTER ===
  
  y = 270;
  
  // Footer separator
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  
  // Company info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('AskYour Tutor', margin, y);
  
  // Date generated
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Generated: ${generatedDate}`, pageWidth - margin, y, { align: 'right' });
  
  y += 5;
  
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('support@askyourtutor.com | www.askyourtutor.com', margin, y);
  
  y += 4;
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(7);
  doc.text('This is an electronically generated receipt and does not require a signature.', margin, y);

  // Generate filename
  const timestamp = new Date().getTime();
  const filename = `Receipt_${payment.transactionId.slice(-8)}_${timestamp}.pdf`;
  
  // Download PDF
  doc.save(filename);
};

export const downloadReceiptAsPDF = (payment: ReceiptData) => {
  generateReceipt(payment);
};
