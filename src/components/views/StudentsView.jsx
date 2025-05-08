import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

// Importar componentes modales
import AddStudentModal from '../AddStudentModal';
import EditStudentModal from '../EditStudentModal';
import CreatePaymentModal from '../CreatePaymentModal';

const StudentsView = ({ readOnly, nivelEducativo }) => {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  
  // Estados para el buscador
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('nombre');
  const [isSearching, setIsSearching] = useState(false);

  // Handlers para modales
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = (wasAdded = false) => {
    setOpenModal(false);
    if (wasAdded) {
      fetchStudents();
      toast.success('Estudiante agregado correctamente', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudentForEdit(student);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = (wasUpdated = false) => {
    setOpenEditModal(false);
    setSelectedStudentForEdit(null);
    if (wasUpdated) {
      fetchStudents();
      toast.success('Estudiante actualizado correctamente', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleOpenPaymentModal = (student) => {
    setSelectedStudent(student);
    setOpenPaymentModal(true);
  };

  const handleClosePaymentModal = (wasCreated = false) => {
    setOpenPaymentModal(false);
    setSelectedStudent(null);
    if (wasCreated) {
      fetchStudents();
      toast.success('Folio de pago generado correctamente', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleOpenDeleteDialog = (student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://escuelaback-production.up.railway.app/api/students/delete/${studentToDelete.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success('Estudiante eliminado correctamente', {
        position: "top-right",
        autoClose: 3000,
      });
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error) {
      toast.error('Error al eliminar estudiante', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Función para buscar estudiantes
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchStudents();
      return;
    }
    
    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://escuelaback-production.up.railway.app/api/students/search?${searchType}=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setStudents(response.data);
      if (response.data.length === 0) {
        toast.info('No se encontraron estudiantes con ese criterio', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Error al buscar estudiantes', {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error al buscar estudiantes:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    fetchStudents();
  };

  // Fetch students from backend
  // Modificar fetchStudents para usar el nivelEducativo si está presente
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `https://escuelaback-production.up.railway.app/api/students/all`;
      
      // Si hay un nivel educativo seleccionado, usar la URL de búsqueda
      if (nivelEducativo) {
        url = `https://escuelaback-production.up.railway.app/api/students/search?nivel_educativo=${encodeURIComponent(nivelEducativo)}`;
      }
      
      const response = await axios.get(
        url,
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

  // Actualizar estudiantes cuando cambie el nivelEducativo
  useEffect(() => {
    fetchStudents();
  }, [nivelEducativo]);

  return (
    <>
      <Paper sx={{ p: { xs: 1, sm: 3 }, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ mb: 3 }}>
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
            Gestión de Estudiantes
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
            Administre los estudiantes del instituto
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#888',
              fontSize: '1rem',
              textTransform: 'uppercase',
              fontWeight: 500,
              fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif"
            }}
          >
            Lista de Estudiantes
          </Typography>
        </Box>

        {/* Buscador de estudiantes */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="search-type-label">Buscar por</InputLabel>
            <Select
              labelId="search-type-label"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              label="Buscar por"
              size="small"
            >
              <MenuItem value="nombre">Nombre</MenuItem>
              <MenuItem value="apellido_paterno">Apellido Paterno</MenuItem>
              <MenuItem value="apellido_materno">Apellido Materno</MenuItem>
              <MenuItem value="nivel_educativo">Nivel Educativo</MenuItem>
              <MenuItem value="email">Correo Electrónico</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Buscar estudiante"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ flexGrow: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={handleSearch}
                    edge="end"
                    size="small"
                    disabled={isSearching}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido Paterno</TableCell>
                <TableCell>Apellido Materno</TableCell>
                <TableCell>Nivel Educativo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tutor</TableCell>
                <TableCell>Día de Pago</TableCell>
                <TableCell>Monto Mensual</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length > 0 ? students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.nombre}</TableCell>
                  <TableCell>{student.apellido_paterno}</TableCell>
                  <TableCell>{student.apellido_materno}</TableCell>
                  <TableCell>{student.nivel_educativo}</TableCell>
                  <TableCell>{student.telefono}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.tutor}</TableCell>
                  <TableCell>{student.dia_pago || '-'}</TableCell>
                  <TableCell>
                    {student.monto_mensual 
                      ? `$${parseFloat(student.monto_mensual).toFixed(2)}` 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenEditModal(student)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOpenDeleteDialog(student)}
                      >
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
              )) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {isSearching ? 'Buscando estudiantes...' : 'No hay estudiantes registrados.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modales */}
      {openModal && (
        <AddStudentModal 
          open={openModal} 
          onClose={handleCloseModal} 
        />
      )}
      
      {openEditModal && selectedStudentForEdit && (
        <EditStudentModal 
          open={openEditModal} 
          onClose={handleCloseEditModal} 
          student={selectedStudentForEdit} 
        />
      )}
      
      {openPaymentModal && selectedStudent && (
        <CreatePaymentModal 
          open={openPaymentModal} 
          onClose={handleClosePaymentModal} 
          student={selectedStudent} 
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro que deseas eliminar al estudiante <b>{studentToDelete?.nombre} {studentToDelete?.apellido_paterno}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteStudent} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentsView;