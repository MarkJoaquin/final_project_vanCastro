import { jsPDF } from 'jspdf';

/**
 * Genera un contrato en formato PDF para la lección reservada
 * @param studentName Nombre del estudiante
 * @param lessonDate Fecha de la lección formateada
 * @param lessonTime Hora de la lección
 * @param trackingNumber Número de seguimiento de la solicitud
 * @param lessonLocation Ubicación de la lección
 * @param lessonPlan Plan de lección seleccionado
 * @param lessonPrice Precio de la lección
 * @returns PDF en formato Base64 como string
 */
export function generateContract(
  studentName: string, 
  lessonDate: string, 
  lessonTime: string,
  trackingNumber: string,
  lessonLocation: string,
  lessonPlan: string,
  lessonPrice: number
) {
  const doc = new jsPDF();
  
  // Agregar encabezado
  doc.setFontSize(20);
  doc.text('VanCastro Driving School', 105, 30, { align: 'center' });
  doc.setFontSize(16);
  doc.text('Lesson Contract', 105, 40, { align: 'center' });
  
  // Información de la lección
  doc.setFontSize(12);
  doc.text(`Student: ${studentName}`, 20, 60);
  doc.text(`Lesson Date: ${lessonDate}`, 20, 70);
  doc.text(`Lesson Time: ${lessonTime}`, 20, 80);
  doc.text(`Lesson Location: ${lessonLocation}`, 20, 90);
  doc.text(`Lesson Plan: ${lessonPlan}`, 20, 100);
  doc.text(`Lesson Price: $${lessonPrice.toFixed(2)} (CAD)`, 20, 110);
  doc.text(`Tracking Number: ${trackingNumber}`, 20, 120);
  
  // Términos y condiciones
  doc.setFontSize(14);
  doc.text('Terms and Conditions:', 20, 140);
  
  doc.setFontSize(10);
  let y = 150;
  [
    '1. The student agrees to attend the lesson on the scheduled date and time.',
    '2. The payment must be made before the lesson to confirm the reservation.',
    '3. Cancellation policy: 24 hours notice is required to avoid charges.',
    '4. The school reserves the right to cancel the lesson in case of unsafe or emergency conditions.',
    '5. The student must have a valid driver license or learner permit when required.',
    '6. The student must be fit to drive (no alcohol, drugs, medications that affect driving).',
    '7. Promptness is expected. Delays of 15 minutes or more may result in cancellation without refund.',
    '8. VanCastro Driving School is not responsible for personal belongings left in vehicles.'
  ].forEach(line => {
    doc.text(line, 20, y);
    y += 10;
  });
  
  // Firmas
  doc.text('Student Signature: _________________________', 20, 230);
  doc.text('Date: _________________________', 20, 240);
  
  // Guardar como base64 con prefijo para PDF
  return doc.output('datauristring');
}
