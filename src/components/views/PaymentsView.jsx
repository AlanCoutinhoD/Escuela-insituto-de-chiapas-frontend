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
  Chip,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useParams, useLocation } from 'react-router-dom';

const PaymentsView = () => {
  const params = useParams();
  const location = useLocation(); // Agregar esta línea
  
  // Intentar obtener los parámetros de múltiples fuentes
  const studentId = params?.studentId || location?.state?.studentId || null;
  const year = params?.year || location?.state?.year || null;
  
  // Convertir a números si existen
  const numericStudentId = studentId ? Number(studentId) : null;
  const numericYear = year ? Number(year) : null;
  const [folios, setFolios] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('todos');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folioToDelete, setFolioToDelete] = useState(null);

  // Modificamos la función fetchFolios para asegurar que use la URL correcta
  const fetchFolios = async () => {
    try {
      const token = localStorage.getItem('token');
      let url;
      
      // Verificar que los parámetros sean válidos y no nulos
      if (studentId !== null && year !== null && !isNaN(studentId) && !isNaN(year)) {
        console.log('Parámetros válidos detectados:', { studentId, year });
        url = `https://escuelaback-production.up.railway.app/api/payments/student/${studentId}/year/${year}`;
      } else {
        console.log('Parámetros inválidos o no presentes:', { studentId, year });
        url = 'https://escuelaback-production.up.railway.app/api/payments/all';
      }

      console.log('URL final:', url);

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      
      setFolios(response.data);
    } catch (error) {
      console.error('Error completo:', error);
      toast.error('Error al cargar los folios', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Simplificamos el useEffect y agregamos validación
  useEffect(() => {
    if (!isNaN(studentId) && !isNaN(year)) {
      console.log('Cargando folios para estudiante específico:', { studentId, year });
    } else {
      console.log('Cargando todos los folios');
    }
    fetchFolios();
  }, [studentId, year]);

  // Eliminamos el segundo useEffect que era redundante

  // y modificamos el handleTipoChange
  const handleTipoChange = (event) => {
    setTipoSeleccionado(event.target.value);
    // Si necesitas filtrar por tipo, hazlo aquí con los datos existentes
    // en lugar de hacer otra llamada al API
  };

  // Actualizar la función de generación de PDF para incluir los nuevos campos
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
      // Corregimos el texto del slogan que tenía caracteres extra
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
  
      // Actualizar la descripción para incluir los nuevos campos
      const descLinesRaw = [
        'PAGO DE COLEGIATURA CORRESPONDIENTE',
        `AL MES DE ${String(folio.mes_pago).toUpperCase()} ${folio.anio_pago}`,
        `ALUMNO:  ${folio.nombre} ${folio.apellido_paterno} ${folio.apellido_materno}`,
        `NIVEL EDUCATIVO: ${folio.nivel_educativo || ''}`,
        `TUTOR: ${folio.tutor || ''}`,
        `TELÉFONO TUTOR: ${folio.numero_telefonico_tutor || ''}`,
        `DÍA DE PAGO: ${folio.dia_pago || ''}`,
        `MONTO MENSUAL: $${parseFloat(folio.monto_mensual).toFixed(2) || '0.00'}`
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

  // Funciones para manejar la eliminación
  const handleOpenDeleteDialog = (folio) => {
    setFolioToDelete(folio);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFolioToDelete(null);
  };

  const handleDeleteFolio = async () => {
    if (!folioToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://escuelaback-production.up.railway.app/api/payments/delete/${folioToDelete.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      toast.success('Folio de pago eliminado correctamente', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Actualizar la lista de folios
      fetchFolios(tipoSeleccionado);
      
      // Cerrar el diálogo
      setDeleteDialogOpen(false);
      setFolioToDelete(null);
    } catch (error) {
      console.error('Error al eliminar folio:', error);
      toast.error('Error al eliminar el folio de pago', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Folio</TableCell>
                <TableCell>Estudiante</TableCell>
                <TableCell>Nivel Educativo</TableCell>
                <TableCell>Tutor</TableCell>
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
              {folios.length > 0 ? (
                folios.map((payment) => {
                  const abono = parseFloat(payment.abono) || 0;
                  const total = parseFloat(payment.total) || 0;
                  const restante = total - abono;
                  
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.folio}</TableCell>
                      <TableCell>
                        {`${payment.nombre} ${payment.apellido_paterno} ${payment.apellido_materno}`}
                      </TableCell>
                      <TableCell>{payment.nivel_educativo}</TableCell>
                      <TableCell>{payment.tutor}</TableCell>
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
                        <IconButton 
                          color="primary" 
                          onClick={() => handlePrintFolio(payment)}
                          size="small"
                          title="Imprimir folio"
                        >
                          <ReceiptIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleOpenDeleteDialog(payment)}
                          size="small"
                          title="Eliminar folio"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" sx={{ color: '#666', fontWeight: 'medium' }}>
                      {studentId ? 
                        'No hay folios de pago registrados para este estudiante' :
                        'No hay folios de pago registrados'
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Está seguro que desea eliminar el folio de pago #{folioToDelete?.folio}?
          </Typography>
          {folioToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Estudiante:</strong> {folioToDelete.nombre} {folioToDelete.apellido_paterno} {folioToDelete.apellido_materno}
              </Typography>
              <Typography variant="body2">
                <strong>Mes de pago:</strong> {new Date(0, folioToDelete.mes_pago - 1).toLocaleString('es-ES', { month: 'long' })} {folioToDelete.anio_pago}
              </Typography>
              <Typography variant="body2">
                <strong>Total:</strong> ${parseFloat(folioToDelete.total).toFixed(2)}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDeleteFolio} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsView;