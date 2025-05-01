import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
  // Add Table components here instead of separate import
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
// Group all icon imports
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Component imports
import AddStudentModal from './AddStudentModal';
import CreatePaymentModal from './CreatePaymentModal';
import PaymentsView from './PaymentsView';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import EditStudentModal from './EditStudentModal';
import UsersView from './UsersView';

const drawerWidth = 240;

const AdminView = () => {
  // Add these with other state declarations
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [folios, setFolios] = useState([]); // <-- Add this line
  
  // Add these with other handlers
  const handleOpenEditModal = (student) => {
    setSelectedStudentForEdit(student);
    setOpenEditModal(true);
  };
  
  // Update the handleCloseEditModal function
  const handleCloseEditModal = (wasUpdated = false) => {
    setOpenEditModal(false);
    setSelectedStudentForEdit(null);
    if (wasUpdated) {
      fetchStudents(); // Refresh the list after updating a student
      toast.success('Estudiante actualizado correctamente', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  // Update currentView state to include 'users'
  const [currentView, setCurrentView] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  // Add the payment modal handlers
  const handleOpenPaymentModal = (student) => {
    setSelectedStudent(student);
    setOpenPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
    setSelectedStudent(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/students/all`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setStudents(response.data);
    } catch (error) {
      toast.error('Error al cargar los estudiantes', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Fetch folios from backend
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
      toast.error('Error al cargar los folios', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchFolios(); // <-- Add this line to fetch folios on mount
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchStudents(); // Refresh the list after adding a new student
  };

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
            <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
              Instituto Valle de Chiapas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* <Typography sx={{ fontSize: '1.5rem' }}>
              Bienvenido, {user.username}
            </Typography> */}
            <Button 
              color="inherit" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ fontSize: '1.2rem', py: 1, px: 2 }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            borderRight: 'none'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
          
            <ListItem 
              button 
              selected={currentView === 'students'}
              onClick={() => setCurrentView('students')}
            >
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Estudiantes" />
            </ListItem>
            <ListItem 
              button 
              selected={currentView === 'users'}
              onClick={() => setCurrentView('users')}
            >
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Gestión de Usuarios" />
            </ListItem>
            <ListItem 
              button 
              selected={currentView === 'payments'}
              onClick={() => setCurrentView('payments')}
            >
              <ListItemIcon><ReceiptIcon /></ListItemIcon>
              <ListItemText primary="Folios de Pago" />
            </ListItem>
          </List>
          <Typography 
            sx={{ 
              position: 'absolute', 
              bottom: 16, 
              left: 16, 
              color: '#666',
              fontSize: '1.2rem'
            }}
          >
            Rol: Administrador
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      {(() => {
        switch (currentView) {
          case 'students':
            return (
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ color: '#2e7d32', mb: 1, fontSize: '2rem' }}>
                    Gestión de Estudiantes
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', fontSize: '1.2rem' }}>
                    Administre los estudiantes del instituto
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Lista de Estudiantes</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      size="small"
                      placeholder="Buscar estudiantes..."
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ color: '#666', mr: 1 }} />,
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpenModal}
                      sx={{
                        backgroundColor: '#2e7d32',
                        '&:hover': { backgroundColor: '#1b5e20' }
                      }}
                    >
                      Agregar Estudiante
                    </Button>
                  </Box>
                </Box>

                <Paper sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
                  {students.length === 0 ? (
                    <Typography sx={{ color: '#666', textAlign: 'center', py: 4, fontSize: '1.2rem' }}>
                      No hay estudiantes registrados. Agregue un nuevo estudiante para comenzar.
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido Paterno</TableCell>
                            <TableCell>Apellido Materno</TableCell>
                            <TableCell>Fecha de Nacimiento</TableCell>
                            <TableCell>Nivel Educativo</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Correo Electrónico</TableCell>
                            <TableCell>Tutor</TableCell> {/* Nueva columna */}
                            <TableCell>Número Telefónico Tutor</TableCell> {/* Nueva columna */}
                            <TableCell>Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>{student.nombre}</TableCell>
                              <TableCell>{student.apellido_paterno}</TableCell>
                              <TableCell>{student.apellido_materno}</TableCell>
                              <TableCell>
                                {new Date(student.fecha_nacimiento).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{student.nivel_educativo}</TableCell>
                              <TableCell>{student.telefono}</TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.tutor}</TableCell> {/* Nueva celda */}
                              <TableCell>{student.numero_telefonico_tutor}</TableCell> {/* Nueva celda */}
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleOpenEditModal(student)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton size="small" color="error">
                                    <DeleteIcon />
                                  </IconButton>
                                  <IconButton size="small" color="info">
                                    <VisibilityIcon />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleOpenPaymentModal(student)}
                                  >
                                    <ReceiptIcon />
                                  </IconButton>
                                </Box>
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
          case 'payments':
            return (
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ color: '#2e7d32', mb: 1, fontSize: '2rem' }}>
                    Folios de Pago
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', fontSize: '1.2rem' }}>
                    Administre los folios de pago del instituto
                  </Typography>
                </Box>
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
                          <TableCell>Nombre</TableCell>
                          <TableCell>Apellido Paterno</TableCell>
                          <TableCell>Apellido Materno</TableCell>
                          {/* Add more columns if needed */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {folios && folios.length > 0 ? folios.map((folio) => (
                          <TableRow key={folio.id}>
                            <TableCell>{folio.folio}</TableCell>
                           
                            <TableCell>{folio.mes_pago}</TableCell>
                            <TableCell>{folio.anio_pago}</TableCell>
                            <TableCell>{folio.nota}</TableCell>
                            <TableCell>{folio.abono}</TableCell>
                            <TableCell>{folio.total}</TableCell>
                            <TableCell>{folio.nombre}</TableCell>
                            <TableCell>{folio.apellido_paterno}</TableCell>
                            <TableCell>{folio.apellido_materno}</TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={10} align="center">
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
          case 'users':
            return <UsersView />;
          default:
            return null;
        }
      })()}
      <AddStudentModal 
        open={openModal} 
        onClose={handleCloseModal} 
      />
      <CreatePaymentModal
        open={openPaymentModal}
        onClose={handleClosePaymentModal}
        student={selectedStudent}
      />
      <EditStudentModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        student={selectedStudentForEdit}
      />
    </Box>
  );
};

export default AdminView;