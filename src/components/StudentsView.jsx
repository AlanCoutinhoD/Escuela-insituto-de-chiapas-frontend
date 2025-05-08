import React, { useState, useEffect } from 'react';
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
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import axios from 'axios';
import EditStudentModal from './EditStudentModal';
import CreatePaymentModal from './CreatePaymentModal';
import AddIcon from '@mui/icons-material/Add';
import AddStudentModal from './AddStudentModal';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

const StudentsView = ({ readOnly }) => {
  const [students, setStudents] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [searchType, setSearchType] = useState('nombre');

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://escuelaback-production.up.railway.app/api/students/all`,
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

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = (wasAdded = false) => {
    console.log('Cerrando modal de agregar estudiante', wasAdded);
    setOpenAddModal(false);
    if (wasAdded) {
      // Refresh the student list if a student was added
      fetchStudents();
    }
  };

  // Filter students by search
  const filteredStudents = students.filter(
    (student) =>
      student.nombre.toLowerCase().includes(search.toLowerCase()) ||
      student.apellido_paterno.toLowerCase().includes(search.toLowerCase()) ||
      student.apellido_materno.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = async () => {
    if (!search) {
      fetchStudents();
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://escuelaback-production.up.railway.app/api/students/search?${searchType}=${encodeURIComponent(search)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setStudents(response.data);
    } catch (error) {
      toast.error('Error al buscar estudiantes', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Allow pressing Enter to search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#2e7d32', mb: 1 }}>
          Lista de Estudiantes
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Consulte y gestione la información de los estudiantes
        </Typography>
      </Box>

      {/* Add Student Button (only if not readOnly) */}
      {!readOnly && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
            sx={{
              backgroundColor: '#2e7d32',
              '&:hover': { backgroundColor: '#1b5e20' }
            }}
          >
            Agregar Estudiante
          </Button>
        </Box>
      )}

      {/* Search bar with type selector */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          label="Buscar por"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          size="small"
          sx={{ width: 170 }}
        >
          <MenuItem value="nombre">Nombre</MenuItem>
          <MenuItem value="apellido_paterno">Apellido Paterno</MenuItem>
          <MenuItem value="apellido_materno">Apellido Materno</MenuItem>
          <MenuItem value="nivel_educativo">Nivel Educativo</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </TextField>
        <TextField
          size="small"
          placeholder={`Buscar estudiantes...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666', mr: 1 }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />
        <Button
          variant="outlined"
          onClick={handleSearch}
          sx={{
            borderColor: '#2e7d32',
            color: '#2e7d32',
            '&:hover': { borderColor: '#1b5e20', backgroundColor: '#f1f8e9' }
          }}
        >
          Buscar
        </Button>
      </Box>

      <Paper sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
        {students.length === 0 ? (
          <Typography sx={{ color: '#666', textAlign: 'center', py: 4 }}>
            No hay estudiantes registrados.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
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
                {filteredStudents.map((student) => (
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
                      <Box sx={{ display: 'flex' }}>
                        {!readOnly && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenEditModal(student)}
                            sx={{ color: '#2196f3' }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenPaymentModal(student)}
                          sx={{ color: '#4caf50' }}
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

      {/* Modals */}
      {openEditModal && (
        <EditStudentModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          student={selectedStudentForEdit}
        />
      )}

      {openPaymentModal && (
        <CreatePaymentModal
          open={openPaymentModal}
          onClose={handleClosePaymentModal}
          student={selectedStudent}
        />
      )}

      {openAddModal && (
        <AddStudentModal
          open={openAddModal}
          onClose={handleCloseAddModal}
        />
      )}
    </Box>
  );
};

export default StudentsView;