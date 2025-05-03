import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import axios from 'axios';
import jsPDF from 'jspdf';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // If using MUI X DatePicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const CreatePaymentModal = ({ open, onClose, student }) => {
  const [formData, setFormData] = useState({
    nota: '',
    abono: '',
    total: '',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const mes_pago = selectedDate ? dayjs(selectedDate).month() + 1 : null;
    const anio_pago = selectedDate ? dayjs(selectedDate).year() : null;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://escuelaback-production.up.railway.app/api/payments/create`,
        {
          mes_pago,
          anio_pago,
          nota: formData.nota,
          abono: formData.abono,
          total: formData.total,
          student_id: student.id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        toast.success('Folio generado correctamente', {
          position: "top-right",
          autoClose: 3000,
        });
        handleClose(true);
      }
    } catch (error) {
      toast.error('Error al generar el folio', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (success = false) => {
    if (!isSubmitting) {
      // Reiniciar el formulario
      setFormData({
        nota: '',
        abono: '',
        total: '',
      });
      setSelectedDate(null);
      onClose(success);
    }
  };

  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = error => reject(error);
      img.src = url;
    });
  };

  const handleGeneratePDF = async () => {
    const doc = new jsPDF();
  
    // Get logo as base64
    const logoData = await getBase64ImageFromURL('/images/logo.jpeg');
    // Add logo to PDF (x, y, width, height)
    doc.addImage(logoData, 'JPEG', 80, 10, 50, 30);
  
    // Add your PDF content below the logo
    doc.setFontSize(14);
    doc.text('INSTITUTO VALLE DE CHIAPAS, SC', 105, 50, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Sistema Educativo', 105, 58, { align: 'center' });
    doc.text('R.F.C. IVC-080414-R45', 105, 64, { align: 'center' });
    doc.text('AV. CENTRAL PONIENTE No. 429 COL. CENTRO CP. 29000', 105, 70, { align: 'center' });
    doc.text('TEL. 61 3 61 56 TUXTLA GUTIERREZ, CHIAPAS', 105, 76, { align: 'center' });
    doc.text('REGIMEN SIMPLIFICADO DE CONFIANZA', 105, 82, { align: 'center' });
  
    // ... Add the rest of your PDF content here ...
  
    doc.save('folio_pago.pdf');
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        {/* Logo at the top of the modal */}
        <img
          src="/images/logo.jpeg"
          alt="Instituto Valle de Chiapas Logo"
          style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 8 }}
        />
        <Typography variant="h6">Generar Folio de Pago</Typography>
        <IconButton
          onClick={() => handleClose(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#666',
          }}
          disabled={isSubmitting}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form id="payment-form" onSubmit={handleSubmit}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Estudiante: {student?.nombre} {student?.apellido_paterno} {student?.apellido_materno}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Mes y Año de Pago"
              views={['year', 'month']}
              value={selectedDate}
              onChange={setSelectedDate}
              renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
            />
          </LocalizationProvider>
          
          {/* Add your other form fields here */}
          <TextField
            fullWidth
            label="Nota"
            name="nota"
            value={formData.nota}
            onChange={handleChange}
            placeholder="Detalles del pago"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Abono"
            name="abono"
            type="number"
            value={formData.abono}
            onChange={handleChange}
            placeholder="Cantidad abonada"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Total"
            name="total"
            type="number"
            value={formData.total}
            onChange={handleChange}
            placeholder="Monto total"
            sx={{ mb: 2 }}
          />
        </form> {/* Add this closing tag */}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={() => handleClose(false)} 
          sx={{ color: '#666' }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="payment-form"
          variant="contained"
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': { backgroundColor: '#1b5e20' }
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Generando...' : 'Generar Folio'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePaymentModal;