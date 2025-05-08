import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper 
} from '@mui/material';
import { data, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://escuelaback-production.up.railway.app/api/users/login`, credentials);
      
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Redirecting user with role:', user.role);
        
        // Use window.location for a hard redirect instead of navigate
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else if (user.role === 'user') {
          window.location.href = '/user';
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        toast.error('Credenciales incorrectas', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error('Error en el servidor', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        pt: 8
      }}
    >
      <ToastContainer />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}
        >
          {/* School Logo */}
          <img
            src="/images/logo.png"
            alt="Instituto Valle de Chiapas Logo"
            style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 16 }}
          />
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ color: '#2e7d32', fontSize: '2rem', fontWeight: 'bold' }}
          >
            IVC
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ color: '#2e7d32', mt: 2 }}
          >
            Instituto Valle de Chiapas
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ color: '#666' }}
          >
            Sistema de Gestión Educativa
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            backgroundColor: 'white'
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, color: '#2e7d32' }}>
            Iniciar Sesión
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            Ingrese sus credenciales para acceder al sistema
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Ingrese su nombre de usuario"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20'
                }
              }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Paper>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 4 }}
        >
          © 2025 Instituto Valle de Chiapas, SC
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;