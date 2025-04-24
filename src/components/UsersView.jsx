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
  Chip,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const UsersView = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/all`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar los usuarios', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          color: '#1a237e',
          backgroundColor: '#e8eaf6'
        };
      case 'user':
        return {
          color: '#1b5e20',
          backgroundColor: '#e8f5e9'
        };
      default:
        return {
          color: '#424242',
          backgroundColor: '#f5f5f5'
        };
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#2e7d32', mb: 1 }}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Administre los usuarios y sus roles en el sistema
        </Typography>
      </Box>

      <Paper sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
        {users.length === 0 ? (
          <Typography sx={{ color: '#666', textAlign: 'center', py: 4 }}>
            No hay usuarios registrados.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role.toUpperCase()}
                        sx={{
                          ...getRoleColor(user.role),
                          fontWeight: 500
                        }}
                      />
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
};

export default UsersView;