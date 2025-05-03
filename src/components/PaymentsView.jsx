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
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import PrintIcon from '@mui/icons-material/Print';
import { usePDF } from 'react-to-pdf';

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
                  <TableCell>Total</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
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
                    <TableCell>${payment.total}</TableCell>
                    <TableCell>
                      <PaymentDetails payment={payment} />
                    </TableCell>
                  </TableRow>
                ))}
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
const ReceiptTemplate = ({ payment }) => (
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
            <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>${Number(payment.total).toFixed(2)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>TOTAL</td>
            <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>${Number(payment.total).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    {/* Amount in words */}
    <div style={{ marginBottom: '20px' }}>
      <p>IMPORTE TOTAL CON LETRA: {payment.monto_letra}</p>
    </div>

    {/* Footer */}
    <div style={{ textAlign: 'center' }}>
      <p>ESTE DOCUMENTO NO ES COMPROBANTE CON VALOR FISCAL</p>
    </div>
  </div>
);

// Add the print button to your existing payment details view
const PaymentDetails = ({ payment }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `recibo-${payment.folio}.pdf`,
    page: { format: 'letter' },
    method: 'open'
  });

  return (
    <>
      <Button
        variant="contained"
        size="small"
        startIcon={<PrintIcon />}
        onClick={() => toPDF()}
        sx={{
          backgroundColor: '#2e7d32',
          '&:hover': { backgroundColor: '#1b5e20' }
        }}
      >
        Imprimir
      </Button>
      
      <div ref={targetRef} style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
        <ReceiptTemplate payment={payment} />
      </div>
    </>
  );
};