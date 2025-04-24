import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,              // <-- Add this
  TableContainer,     // <-- Add this
  Table,              // <-- Add this
  TableHead,          // <-- Add this
  TableRow,           // <-- Add this
  TableCell,          // <-- Add this
  TableBody,          // <-- Add this
  IconButton // <-- Add this
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentsView from './PaymentsView';
import StudentsView from './StudentsView';
import axios from 'axios'; // <-- Add this if not already imported
import PrintIcon from '@mui/icons-material/Print';
import CreatePaymentModal from './CreatePaymentModal'; // <-- Import if you want to reuse modal
import jsPDF from 'jspdf'; // <-- Import if you want to call PDF logic directly

const drawerWidth = 240;

const UserView = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('students');
  const [folios, setFolios] = useState([]); // <-- Add this
  const [selectedFolio, setSelectedFolio] = useState(null); // <-- Add this
  const [openPrintModal, setOpenPrintModal] = useState(false); // <-- Add this

  // Fetch folios from backend
  useEffect(() => {
    const fetchFolios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/payments/all`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setFolios(response.data);
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchFolios();
  }, []);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  // Fix: Only one closing brace for this function!
  const handlePrintFolio = async (folio) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const logoUrl = `${window.location.origin}/images/logo.jpeg`;
    const logoImg = new window.Image();
    logoImg.src = logoUrl;

    logoImg.onload = function() {
      // Draw logo
      doc.addImage(logoImg, 'JPEG', 10, 10, 30, 30);
  
      // Header (left side, outside the box)
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

      // Recibo de pago box (right side)
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(220, 15, 70, 35); // Wider and taller box

      // Content inside the box
      const boxX = 220;
      const boxY = 15;
      // Centered "IUCH" at the top of the box
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('IUCH', boxX + 35, boxY + 10, { align: 'center' });

      // "RECIBO DE PAGO" below
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('RECIBO DE PAGO', boxX + 10, boxY + 18);

      // Slogan below
      doc.setFontSize(8);
      doc.text('UN PASO ADELANTE EN EDUCACION', boxX + 10, boxY + 24);

      // Folio number at the bottom of the box
      doc.setFontSize(10);
      doc.text(`FOLIO No ${folio.folio}`, boxX + 10, boxY + 31);

      // (REMOVE these lines, they are not needed anymore)
      // doc.setFont('helvetica', 'bold');
      // doc.setFontSize(16);
      // doc.text('IUCH', 250, 18);
      // doc.setFontSize(8);
      // doc.setFont('helvetica', 'normal');
      // doc.text('UN PASO ADELANTE EN EDUCACION', 245, 23);
  
      // Date and location
      doc.setFontSize(10);
      doc.text('Tuxtla Gutiérrez, Chiapas; a', 10, 55);
      doc.text(`${new Date(folio.fecha_creacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}`, 90, 55);
  
      // Table
      doc.setFontSize(10);
      doc.rect(10, 60, 270, 60); // Outer table
      doc.rect(10, 70, 20, 40); // Cantidad
      doc.rect(30, 70, 180, 40); // Description
      doc.rect(210, 70, 70, 40); // Importe
  
      // Table headers
      doc.text('CANTIDAD', 15, 68);
      doc.text('IMPORTE', 235, 68);
  
      // Table content
      doc.text('1', 18, 80);
      doc.text('PAGO DE COLEGIATURA CORRESPONDIENTE', 32, 80);
      // Fix: Ensure mes_pago is a string before calling toUpperCase
      doc.text(
        `AL MES DE ${String(folio.mes_pago).toUpperCase()} ${folio.anio_pago}`,
        32,
        86
      );
      doc.text(`ALUMNO:  ${folio.nombre} ${folio.apellido_paterno} ${folio.apellido_materno}`, 32, 92);
      doc.text(`NIVEL EDUCATIVO: ${folio.nivel_educativo || ''}`, 32, 98);
      doc.text('semana', 32, 104);
      doc.text('fecha de deposito', 32, 110);
      doc.text('recargos', 32, 116);
  
      // Fix: Ensure folio.total is a number before using toFixed
      doc.text(`${Number(folio.total).toFixed(2)}`, 235, 80);
  
      // Total row
      doc.rect(10, 120, 200, 10);
      doc.rect(210, 120, 70, 10);
      doc.text('IMPORTE TOTAL CON LETRA:', 12, 127);
      // You may want to convert the number to words in Spanish here
      doc.text(`(${folio.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} M.N.)`, 90, 127);
      doc.text('TOTAL', 235, 127);
      doc.text(`${Number(folio.total).toFixed(2)}`, 250, 127);
  
      // Footer
      doc.setFontSize(9);
      doc.text('ESTE DOCUMENTO NO ES COMPROBANTE CON VALOR FISCAL', 60, 140);
  
      doc.save('folio_pago.pdf');
    };
  }; // <-- Only one closing brace here

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#2e7d32' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Logo */}
            <img
              src="/images/logo.jpeg"
              alt="Instituto Valle de Chiapas Logo"
              style={{ width: 80, height: 80, objectFit: 'contain', marginRight: 16 }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                fontSize: '2.5rem',
                textTransform: 'uppercase',
                fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
                letterSpacing: 2
              }}
            >
              Instituto Valle de Chiapas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* <Typography
              sx={{
                fontSize: '1.5rem',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif"
              }}
            >
              Bienvenido, {user.username && user.username.toUpperCase()}
            </Typography> */}
            
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            borderRight: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // To push content to top and bottom
          },
        }}
      >
        <Box>
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            <List>
              <ListItem 
                button 
                selected={currentView === 'students'}
                onClick={() => setCurrentView('students')}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  transition: 'background 0.2s',
                  ...(currentView === 'students' && {
                    backgroundColor: '#e8f5e9',
                  }),
                  '&:hover': {
                    backgroundColor: '#c8e6c9',
                  },
                }}
              >
                <ListItemIcon>
                  <PeopleIcon sx={{ color: '#2e7d32', fontSize: 32 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Estudiantes"
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
                    color: '#2e7d32',
                    fontSize: '1.25rem',
                    letterSpacing: 1,
                  }}
                />
              </ListItem>
              <ListItem 
                button 
                selected={currentView === 'payments'}
                onClick={() => setCurrentView('payments')}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  transition: 'background 0.2s',
                  ...(currentView === 'payments' && {
                    backgroundColor: '#e8f5e9',
                  }),
                  '&:hover': {
                    backgroundColor: '#c8e6c9',
                  },
                }}
              >
                <ListItemIcon>
                  <ReceiptIcon sx={{ color: '#2e7d32', fontSize: 32 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Folios de Pago"
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
                    color: '#2e7d32',
                    fontSize: '1.25rem',
                    letterSpacing: 1,
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>
        <Box sx={{ mb: 2, ml: 2 }}>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              fontSize: '1.2rem',
              py: 1,
              px: 2,
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
              color: '#2e7d32',
              justifyContent: 'flex-start',
              whiteSpace: 'nowrap', // Ensure text stays in one line
              minWidth: 0, // Remove any minWidth that could cause wrapping
              width: 'auto', // Let the button size to its content
            }}
          >
            Cerrar Sesión
          </Button>
          <Typography 
            sx={{ 
              color: '#666',
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
              mt: 1
            }}
          >
            Rol: Usuario
          </Typography>
        </Box>
      </Drawer>
      {/* Main Content */}
      {(() => {
        switch (currentView) {
          case 'students':
            return (
              <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 0 }}>
                {/* Remove or reduce the extra Toolbar/margin here */}
                {/* <Toolbar /> */}
                <Box sx={{ mb: 4, mt: 2 }}>
                  {/* Removed Typography components as requested */}
                </Box>
                <StudentsView readOnly={false} />
              </Box>
            );
          case 'payments':
            return (
              <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 0 }}>
                <Box sx={{ mb: 4, mt: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#2e7d32',
                      mb: 1,
                      fontSize: '2rem',
                      textTransform: 'uppercase',
                      fontWeight: 900,
                      fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif"
                    }}
                  >
                    Folios de Pago
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#666',
                      fontSize: '1.2rem',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif"
                    }}
                  >
                    Gestione los folios de pago
                  </Typography>
                </Box>
                <Paper sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Folio</TableCell>
                          <TableCell>Fecha de Creación</TableCell>
                          <TableCell>Mes de Pago</TableCell>
                          <TableCell>Año de Pago</TableCell>
                          <TableCell>Nota</TableCell>
                          <TableCell>Abono</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Apellido Paterno</TableCell>
                          <TableCell>Apellido Materno</TableCell>
                          <TableCell align="center">Acciones</TableCell> {/* This is for the print button */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {folios && folios.length > 0 ? folios.map((folio) => (
                          <TableRow key={folio.id}>
                            <TableCell>{folio.folio}</TableCell>
                            <TableCell>{new Date(folio.fecha_creacion).toLocaleDateString()}</TableCell>
                            <TableCell>{folio.mes_pago}</TableCell>
                            <TableCell>{folio.anio_pago}</TableCell>
                            <TableCell>{folio.nota}</TableCell>
                            <TableCell>{folio.abono}</TableCell>
                            <TableCell>{folio.total}</TableCell>
                            <TableCell>{folio.nombre}</TableCell>
                            <TableCell>{folio.apellido_paterno}</TableCell>
                            <TableCell>{folio.apellido_materno}</TableCell>
                            <TableCell align="center">
                              <IconButton 
                                color="success" 
                                onClick={() => handlePrintFolio(folio)}
                              >
                                <PrintIcon sx={{ color: '#388e3c' }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={11} align="center">
                              No hay folios registrados.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            );
          default:
            return null;
        }
      })()}
    </Box>
  );
};

export default UserView;