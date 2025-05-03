import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { ToastContainer } from 'react-toastify';

// Importar componentes de vistas
import StudentsView from './views/StudentsView';
import PaymentsView from './views/PaymentsView';
import UsersView from './UsersView';

const drawerWidth = 240;

const AdminView = () => {
  const [currentView, setCurrentView] = useState('students');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#2e7d32' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {currentView === 'students' && <StudentsView readOnly={false} />}
        {currentView === 'users' && <UsersView />}
        {currentView === 'payments' && <PaymentsView />}
      </Box>
    </Box>
  );
};

export default AdminView;

