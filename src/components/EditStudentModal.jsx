import React, { useState, useEffect } from 'react';
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

const EditStudentModal = ({ open, onClose, student }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_materno: '',
    apellido_paterno: '',
    fecha_nacimiento: '',
    nivel_educativo: '',
    telefono: '',
    email: '',
    tutor: '',
    numero_telefonico_tutor: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        nombre: student.nombre || '',
        apellido_materno: student.apellido_materno || '',
        apellido_paterno: student.apellido_paterno || '',
        fecha_nacimiento: student.fecha_nacimiento?.split('T')[0] || '',
        nivel_educativo: student.nivel_educativo || '',
        telefono: student.telefono || '',
        email: student.email || '',
        tutor: student.tutor || '',
        numero_telefonico_tutor: student.numero_telefonico_tutor || '',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://escuelaback-production.up.railway.app/api/students/update/${student.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 200) {
        onClose(true); // Indicar éxito al cerrar
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Error al actualizar el estudiante', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose(false);
    }
  };

  const nivelesEducativos = [
    'Preescolar',
    'Primaria',
    'Secundaria',
    'Preparatoria',
    'Universidad',
    'Examen',
    'Curso belleza',
    'Constancia'
  ];

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        <Typography component="div" variant="h6">Editar Estudiante</Typography>
        <IconButton
          onClick={handleClose}
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
        <form id="edit-student-form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Apellido Paterno"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Apellido Materno"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Fecha de Nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Nivel Educativo"
            name="nivel_educativo"
            value={formData.nivel_educativo}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            {nivelesEducativos.map((nivel) => (
              <MenuItem key={nivel} value={nivel}>
                {nivel}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Tutor"
            name="tutor"
            value={formData.tutor}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Número Telefónico Tutor"
            name="numero_telefonico_tutor" // <-- updated here
            value={formData.numero_telefonico_tutor} // <-- updated here
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose} 
          sx={{ color: '#666' }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="edit-student-form"
          variant="contained"
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': { backgroundColor: '#1b5e20' }
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudentModal;