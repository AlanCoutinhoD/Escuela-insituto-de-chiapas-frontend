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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import axios from 'axios';

// Importar componentes modales
import AddStudentModal from '../AddStudentModal';
import EditStudentModal from '../EditStudentModal';
import CreatePaymentModal from '../CreatePaymentModal';

const StudentsView = () => {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Handlers para modales
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchStudents();
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

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
    setSelectedStudent(null);
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
        `${process.env.REACT_APP_API_URL}/students/delete/${studentToDelete.id}`,
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

  // Fetch students from backend
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

  useEffect(() => {
    fetchStudents();
  }, []);

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
                <TableCell>Fecha de Nacimiento</TableCell>
                <TableCell>Nivel Educativo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Correo Electrónico</TableCell>
                <TableCell>Tutor</TableCell>
                <TableCell>Número Telefónico Tutor</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length > 0 ? students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.nombre}</TableCell>
                  <TableCell>{student.apellido_paterno}</TableCell>
                  <TableCell>{student.apellido_materno}</TableCell>
                  <TableCell>
                    {student.fecha_nacimiento ? new Date(student.fecha_nacimiento).toLocaleDateString() : ''}
                  </TableCell>
                  <TableCell>{student.nivel_educativo}</TableCell>
                  <TableCell>{student.telefono}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.tutor}</TableCell>
                  <TableCell>{student.numero_telefonico_tutor}</TableCell>
                  <TableCell align="center">
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
                    No hay estudiantes registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modales */}
      <AddStudentModal open={openModal} handleClose={handleCloseModal} />
      
      <EditStudentModal 
        open={openEditModal} 
        handleClose={handleCloseEditModal} 
        student={selectedStudentForEdit} 
      />
      
      <CreatePaymentModal 
        open={openPaymentModal} 
        handleClose={handleClosePaymentModal} 
        student={selectedStudent} 
      />

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