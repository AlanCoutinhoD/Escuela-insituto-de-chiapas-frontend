import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Button,
  Chip,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import PrintIcon from '@mui/icons-material/Print';
import { usePDF } from 'react-to-pdf';
import ReceiptPDF from './ReceiptPDF';

const PaymentsView = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://escuelaback-production.up.railway.app/api/payments/all`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setPayments(response.data);
    } catch (error) {
      toast.error('Error al cargar los folios de pago', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#2e7d32', mb: 1 }}>
          Folios de Pago
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Administre los folios de pago de los estudiantes
        </Typography>
      </Box>

      <Paper sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
        {payments.length === 0 ? (
          <Typography sx={{ color: '#666', textAlign: 'center', py: 4 }}>
            No hay folios de pago registrados.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Folio</TableCell>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Fecha de Creación</TableCell>
                  <TableCell>Mes de Pago</TableCell>
                  <TableCell>Año de Pago</TableCell>
                  <TableCell>Abono</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Restante</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => {
                  // Calcular el monto restante
                  const abono = parseFloat(payment.abono) || 0;
                  const total = parseFloat(payment.total) || 0;
                  const restante = total - abono;
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.folio}</TableCell>
                      <TableCell>
                        {`${payment.nombre} ${payment.apellido_paterno} ${payment.apellido_materno}`}
                      </TableCell>
                      <TableCell>
                        {new Date(payment.fecha_creacion).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(0, payment.mes_pago - 1).toLocaleString('es-ES', { month: 'long' })}
                      </TableCell>
                      <TableCell>{payment.anio_pago}</TableCell>
                      <TableCell>${abono.toFixed(2)}</TableCell>
                      <TableCell>${total.toFixed(2)}</TableCell>
                      <TableCell>
                        {restante <= 0 ? (
                          <Chip 
                            label="PAGADO" 
                            color="success" 
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        ) : (
                          <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                            ${restante.toFixed(2)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <PaymentDetails payment={payment} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentsView;

// Add this component for the PDF receipt
const ReceiptTemplate = ({ payment }) => {
  // Calcular el monto restante
  const abono = parseFloat(payment.abono) || 0;
  const total = parseFloat(payment.total) || 0;
  const restante = total - abono;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', background: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ width: '100px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '100%' }} />
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h2 style={{ margin: 0 }}>INSTITUTO VALLE DE CHIAPAS, SC</h2>
          <p style={{ margin: '5px 0' }}>Sistema Educativo</p>
          <p style={{ margin: '5px 0' }}>R.F.C. IVC-080414-R45</p>
          <p style={{ margin: '5px 0' }}>AV. CENTRAL PONIENTE No. 429 COL. CENTRO CP. 29000</p>
          <p style={{ margin: '5px 0' }}>TEL. 61 3 61 56 TUXTLA GUTIERREZ, CHIAPAS</p>
          <p style={{ margin: '5px 0' }}>REGIMEN SIMPLIFICADO DE CONFIANZA</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ border: '1px solid black', padding: '5px' }}>
            <p style={{ margin: 0 }}>RECIBO DE PAGO</p>
            <p style={{ margin: 0 }}>FOLIO No {payment.folio}</p>
          </div>
        </div>
      </div>

      {/* Date */}
      <div style={{ border: '1px solid black', padding: '5px', marginBottom: '20px' }}>
        <p style={{ margin: 0 }}>Tuxtla Gutiérrez, Chiapas; a {new Date(payment.fecha_pago).toLocaleDateString('es-MX')}</p>
      </div>

      {/* Payment Details */}
      <div style={{ border: '1px solid black', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>CANTIDAD</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>CONCEPTO</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>IMPORTE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                PAGO DE COLEGIATURA CORRESPONDIENTE<br />
                AL MES DE {new Date(0, payment.mes_pago - 1).toLocaleString('es-MX', { month: 'long' }).toUpperCase()} {payment.anio_pago}<br />
                ALUMNO: {`${payment.nombre} ${payment.apellido_paterno} ${payment.apellido_materno}`}<br />
                NIVEL EDUCATIVO: {payment.nivel_educativo}
              </td>
              <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>${Number(total).toFixed(2)}</td>
            </tr>
            {/* Añadir fila para el abono */}
            <tr>
              <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}></td>
              <td style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold' }}>ABONO REALIZADO</td>
              <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>${Number(abono).toFixed(2)}</td>
            </tr>
            {/* Añadir fila para el restante si es mayor a 0 */}
            {restante > 0 && (
              <tr>
                <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}></td>
                <td style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold', color: 'red' }}>SALDO PENDIENTE</td>
                <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right', color: 'red' }}>${Number(restante).toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ width: '70%', border: '1px solid black', padding: '5px' }}>
          <p style={{ margin: 0 }}>IMPORTE TOTAL CON LETRA: {/* Aquí iría la función para convertir a letra */}</p>
        </div>
        <div style={{ width: '30%', border: '1px solid black', padding: '5px', textAlign: 'right' }}>
          <p style={{ margin: 0 }}>TOTAL: ${Number(total).toFixed(2)}</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>ESTE DOCUMENTO NO ES COMPROBANTE CON VALOR FISCAL</p>
      </div>
    </div>
  );
};

// Component for payment details and actions
const PaymentDetails = ({ payment }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `folio_${payment.folio}.pdf`,
  });

  const handlePrintFolio = async (folio) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
  
    const logoUrl = `${window.location.origin}/images/logo.png`;
    const logoImg = new window.Image();
    logoImg.src = logoUrl;
  
    logoImg.onload = function() {
      doc.addImage(logoImg, 'JPEG', 10, 10, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('INSTITUTO VALLE DE CHIAPAS, SC', 60, 18);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Sistema Educativo', 60, 24);
      doc.text('R.F.C. IVC-080414-R45', 60, 29);
      doc.text('AV. CENTRAL PONIENTE No. 429 COL. CENTRO  CP. 29000', 60, 34);
      doc.text('TEL. 61 3 61 56  TUXTLA GUTIERREZ, CHIAPAS', 60, 39);
      doc.text('REGIMEN SIMPLIFICADO DE CONFIANZA', 60, 44);
  
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(220, 15, 70, 35);
  
      const boxX = 220;
      const boxY = 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('IUCH', boxX + 35, boxY + 10, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('RECIBO DE PAGO', boxX + 10, boxY + 18);
      doc.setFontSize(8);
      doc.text('UN PASO ADELANTE EN EDUCACIONnnnnnnn', boxX + 10, boxY + 24);
      doc.setFontSize(10);
      doc.text(`FOLIO No ${folio.folio}`, boxX + 10, boxY + 31);
  
      doc.setFontSize(10);
      doc.text('Tuxtla Gutiérrez, Chiapas; a', 10, 55);
      doc.text(`${new Date(folio.fecha_creacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}`, 90, 55);
  
      doc.setFontSize(10);
      doc.rect(10, 60, 270, 60);
      doc.rect(10, 70, 20, 40);
      doc.rect(30, 70, 180, 40);
      doc.rect(210, 70, 70, 40);
  
      doc.text('CANTIDAD', 15, 68);
      doc.text('IMPORTE', 235, 68);
  
      doc.text('1', 18, 80);
  
      const descLinesRaw = [
        'PAGO DE COLEGIATURA CORRESPONDIENTE',
        `AL MES DE ${String(folio.mes_pago).toUpperCase()} ${folio.anio_pago}`,
        `ALUMNO:  ${folio.nombre} ${folio.apellido_paterno} ${folio.apellido_materno}`,
        `NIVEL EDUCATIVO: ${folio.nivel_educativo || ''}`,
        'semana',
        'fecha de deposito',
        'recargos'
      ];
      let descStartY = 80;
      let descX = 32;
      let descMaxWidth = 175;
      let lineHeight = 6;
      descLinesRaw.forEach((rawLine) => {
        const splitLines = doc.splitTextToSize(rawLine, descMaxWidth);
        splitLines.forEach((line, idx) => {
          doc.text(line, descX, descStartY);
          descStartY += lineHeight;
        });
      });
  
      doc.text(`${Number(folio.total).toFixed(2)}`, 235, 80);
      
      // Calcular el monto restante
      const abono = parseFloat(folio.abono) || 0;
      const total = parseFloat(folio.total) || 0;
      const restante = total - abono;
      
      // Añadir información de abono y restante
      doc.text('ABONO:', 210, 95);
      doc.text(`${Number(abono).toFixed(2)}`, 235, 95);
      
      if (restante > 0) {
        doc.text('RESTANTE:', 210, 105);
        doc.text(`${Number(restante).toFixed(2)}`, 235, 105);
        
        // Añadir nota sobre saldo pendiente
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 0, 0); // Color rojo para el texto
        doc.text('PAGO PARCIAL - SALDO PENDIENTE', 32, 115);
        doc.setTextColor(0, 0, 0); // Volver al color negro
        doc.setFont('helvetica', 'normal');
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 128, 0); // Color verde para el texto
        doc.text('PAGADO COMPLETAMENTE', 32, 115);
        doc.setTextColor(0, 0, 0); // Volver al color negro
        doc.setFont('helvetica', 'normal');
      }
  
      doc.rect(10, 120, 200, 10);
      doc.rect(210, 120, 70, 10);
      doc.text('IMPORTE TOTAL CON LETRA:', 12, 127);
      doc.text(`(${folio.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} M.N.)`, 90, 127);
      doc.text('TOTAL', 235, 127);
      doc.text(`${Number(folio.total).toFixed(2)}`, 250, 127);
  
      doc.setFontSize(9);
      doc.text('ESTE DOCUMENTO NO ES COMPROBANTE CON VALOR FISCAL', 60, 140);
      
      // Añadir información adicional sobre el estado del pago
      if (restante > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text(`PENDIENTE POR PAGAR: $${Number(restante).toFixed(2)}`, 60, 150);
        doc.setFont('helvetica', 'normal');
      }
  
      doc.save('folio_pago.pdf');
    };
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<PrintIcon />}
        onClick={() => handlePrintFolio(payment)}
        sx={{ 
          backgroundColor: '#2e7d32',
          '&:hover': { backgroundColor: '#1b5e20' }
        }}
      >
        Imprimir
      </Button>
      
      
      <div style={{ display: 'none' }}>
        <div ref={targetRef}>
          <ReceiptTemplate payment={payment} />
        </div>
      </div>
    </div>
  );
};