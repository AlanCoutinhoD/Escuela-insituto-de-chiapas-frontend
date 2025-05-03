import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddStudentModal = ({ open, onClose }) => {
  const initialFormState = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    nivel_educativo: '',
    telefono: '',
    email: '',
    tutor: '',
    numero_telefonico_tutor: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reiniciar el formulario cuando se abre el modal
  useEffect(() => {
    if (open) {
      setFormData(initialFormState);
      setIsSubmitting(false);
    }
  }, [open]);

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
      const response = await axios.post(
        `https://escuelaback-production.up.railway.app/api/students/create`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 201) {
        toast.success('Estudiante agregado correctamente', {
          position: "top-right",
          autoClose: 3000,
        });
        // Reiniciar el formulario
        setFormData(initialFormState);
        // Cerrar el modal inmediatamente después de éxito
        onClose(true);
      }
    } catch (error) {
      console.error('Error al agregar estudiante:', error);
      toast.error('Error al agregar estudiante', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar el cierre del modal
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(initialFormState);
      onClose(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'white' }}>
        Agregar Nuevo Estudiante
        <IconButton
          aria-label="close"
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
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Complete el formulario para registrar un nuevo estudiante en el sistema.
        </Typography>
        <form id="add-student-form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del estudiante"
            sx={{ mb: 2 }}
            required
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            label="Apellido Paterno"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            placeholder="Apellido paterno"
            sx={{ mb: 2 }}
            required
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            label="Apellido Materno"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            placeholder="Apellido materno"
            sx={{ mb: 2 }}
            required
            disabled={isSubmitting}
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
            required
            disabled={isSubmitting}
          />
          <FormControl fullWidth sx={{ mb: 2 }} disabled={isSubmitting}>
            <InputLabel>Nivel Educativo</InputLabel>
            <Select
              name="nivel_educativo"
              value={formData.nivel_educativo}
              onChange={handleChange}
              label="Nivel Educativo"
              required
            >
              <MenuItem value="Primaria">Primaria</MenuItem>
              <MenuItem value="Secundaria">Secundaria</MenuItem>
              <MenuItem value="Preparatoria">Preparatoria</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            sx={{ mb: 2 }}
            required
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Número telefónico"
            sx={{ mb: 2 }}
            required
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            label="Nombre del Tutor"
            name="tutor"
            value={formData.tutor}
            onChange={handleChange}
            placeholder="Nombre completo del tutor"
            sx={{ mb: 2 }}
            required
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            label="Teléfono del Tutor"
            name="numero_telefonico_tutor"
            value={formData.numero_telefonico_tutor}
            onChange={handleChange}
            placeholder="Número telefónico del tutor"
            sx={{ mb: 2 }}
            required
            disabled={isSubmitting}
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
          form="add-student-form"
          variant="contained"
          sx={{
            backgroundColor: '#2e7d32',
            '&:hover': { backgroundColor: '#1b5e20' }
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Estudiante'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentModal;