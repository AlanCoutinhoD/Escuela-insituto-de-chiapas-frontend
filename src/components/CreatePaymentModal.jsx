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

const CreatePaymentModal = ({ open, onClose, student }) => {
  const [formData, setFormData] = useState({
    mes_pago: '',
    anio_pago: new Date().getFullYear(),
    total: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/payments/create`,
        {
          ...formData,
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
        onClose();
      }
    } catch (error) {
      toast.error('Error al generar el folio', {
        position: "top-right",
        autoClose: 3000,
      });
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        {/* Logo at the top of the modal */}
        <img
          src="/images/logo.jpeg"
          alt="Instituto Valle de Chiapas Logo"
          style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 8 }}
        />
        <Typography variant="h6">Generar Folio de Pago</Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#666',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Estudiante: {student?.nombre} {student?.apellido_paterno} {student?.apellido_materno}
        </Typography>
        <TextField
          select
          fullWidth
          label="Mes de Pago"
          name="mes_pago"
          value={formData.mes_pago}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <MenuItem key={month} value={month}>
              {new Date(0, month - 1).toLocaleString('es-ES', { month: 'long' })}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Año de Pago"
          name="anio_pago"
          type="number"
          value={formData.anio_pago}
          onChange={handleChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Total"
          name="total"
          type="number"
          value={formData.total}
          onChange={handleChange}
          required
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#666' }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': { backgroundColor: '#1b5e20' }
          }}
        >
          Generar Folio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePaymentModal;