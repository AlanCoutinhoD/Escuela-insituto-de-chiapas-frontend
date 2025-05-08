import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Box, 
  Typography, 
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import axios from 'axios';
import jsPDF from 'jspdf';

const PaymentsView = () => {
  const [folios, setFolios] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('todos');
  const [nivelesEducativos, setNivelesEducativos] = useState([]);

  // Fetch folios from backend
  const fetchFolios = async (tipo = 'todos') => {
    try {
      const token = localStorage.getItem('token');
      let url = `https://escuelaback-production.up.railway.app/api/payments/all`;
      
     
      
      const response = await axios.get(
        url,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setFolios(response.data);
    } catch (error) {
      toast.error('Error al cargar los folios', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Obtener niveles educativos únicos
  const fetchNivelesEducativos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://escuelaback-production.up.railway.app/api/students/niveles`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Si la API no proporciona los niveles, usar una lista predefinida
      if (!response.data || response.data.length === 0) {
        setNivelesEducativos([
          'Preescolar',
          'Primaria',
          'Secundaria',
          'Preparatoria',
          'Universidad',
          'Examen',
          'Curso belleza',
          'Constancia'
        ]);
      } else {
        setNivelesEducativos(response.data);
      }
    } catch (error) {
      // Si hay error, usar una lista predefinida
      setNivelesEducativos([
        'Preescolar',
        'Primaria',
        'Secundaria',
        'Preparatoria',
        'Universidad',
        'Examen',
        'Curso belleza',
        'Constancia'
      ]);
    }
  };

  useEffect(() => {
    fetchFolios();
    fetchNivelesEducativos();
  }, []);

  // Actualizar folios cuando cambia el tipo seleccionado
  useEffect(() => {
    fetchFolios(tipoSeleccionado);
  }, [tipoSeleccionado]);

  const handleTipoChange = (event) => {
    setTipoSeleccionado(event.target.value);
  };

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
      doc.text('UN PASO ADELANTE EN EDUCACION', boxX + 10, boxY + 24);
      doc.setFontSize(10);
      doc.text(`FOLIO No ${folio.folio}`, boxX + 10, boxY + 31);
  
      doc.setFontSize(10);
      doc.text('Tuxtla Gutiérrez, Chiapas; a', 10, 55);
      doc.text(`${new Date(folio.fecha_creacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}`, 90, 55);
  
      doc.setFontSize(10);
      doc.rect(10, 60, 270, 80); // Aumentado de 70 a 80 de altura
      doc.rect(10, 70, 20, 60); // Aumentado de 50 a 60 de altura
      doc.rect(30, 70, 180, 60); // Aumentado de 50 a 60 de altura
      doc.rect(210, 70, 70, 60); // Aumentado de 50 a 60 de altura
  
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
        doc.text('PAGO PARCIAL - SALDO PENDIENTE', 32, 125); // Ajustado de 120 a 125
        doc.setTextColor(0, 0, 0); // Volver al color negro
        doc.setFont('helvetica', 'normal');
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 128, 0); // Color verde para el texto
        doc.text('PAGADO COMPLETAMENTE', 32, 125); // Ajustado de 120 a 125
        doc.setTextColor(0, 0, 0); // Volver al color negro
        doc.setFont('helvetica', 'normal');
      }
  
      doc.rect(10, 140, 200, 10); // Ajustado de 130 a 140
      doc.rect(210, 140, 70, 10); // Ajustado de 130 a 140
      doc.text('IMPORTE TOTAL CON LETRA:', 12, 147); // Ajustado de 137 a 147
      doc.text(`(${folio.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} M.N.)`, 90, 147); // Ajustado de 137 a 147
      doc.text('TOTAL', 235, 147); // Ajustado de 137 a 147
      doc.text(`${Number(folio.total).toFixed(2)}`, 250, 147); // Ajustado de 137 a 147
  
      doc.setFontSize(9);
      doc.text('ESTE DOCUMENTO NO ES COMPROBANTE CON VALOR FISCAL', 60, 160); // Ajustado de 150 a 160
      
      // Añadir información adicional sobre el estado del pago
      if (restante > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text(`PENDIENTE POR PAGAR: $${Number(restante).toFixed(2)}`, 60, 170); // Ajustado de 160 a 170
        doc.setFont('helvetica', 'normal');
      }
  
      doc.save('folio_pago.pdf');
    };
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#2e7d32', mb: 1, fontSize: '2rem' }}>
          Folios de Pago
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', fontSize: '1.2rem' }}>
          Administre los folios de pago del instituto
        </Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="tipo-select-label">Filtrar por Nivel Educativo</InputLabel>
            <Select
              labelId="tipo-select-label"
              id="tipo-select"
              value={tipoSeleccionado}
              label="Filtrar por Nivel Educativo"
              onChange={handleTipoChange}
            >
              <MenuItem value="todos">Todos los niveles</MenuItem>
              {nivelesEducativos.map((nivel) => (
                <MenuItem key={nivel} value={nivel}>{nivel}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Folio</TableCell>
                <TableCell>Mes de Pago</TableCell>
                <TableCell>Año de Pago</TableCell>
                <TableCell>Nota</TableCell>
                <TableCell>Abono</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Restante</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido Paterno</TableCell>
                <TableCell>Apellido Materno</TableCell>
                <TableCell>Nivel Educativo</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {folios && folios.length > 0 ? folios.map((folio) => {
                // Calcular el monto restante
                const abono = parseFloat(folio.abono) || 0;
                const total = parseFloat(folio.total) || 0;
                const restante = total - abono;
                
                return (
                  <TableRow key={folio.id}>
                    <TableCell>{folio.folio}</TableCell>
                    <TableCell>{folio.mes_pago}</TableCell>
                    <TableCell>{folio.anio_pago}</TableCell>
                    <TableCell>{folio.nota}</TableCell>
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
                    <TableCell>{folio.nombre}</TableCell>
                    <TableCell>{folio.apellido_paterno}</TableCell>
                    <TableCell>{folio.apellido_materno}</TableCell>
                    <TableCell>{folio.nivel_educativo}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="success" 
                        onClick={() => handlePrintFolio(folio)}
                      >
                        <ReceiptIcon sx={{ color: '#388e3c' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No hay folios de pago registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default PaymentsView;