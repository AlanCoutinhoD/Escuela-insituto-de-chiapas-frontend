import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || !user.role) {
    return <Navigate to="/" />;
  }

  const path = window.location.pathname;
  
  // Strict role-based access control
  if (path.startsWith('/admin') && user.role !== 'admin') {
    return <Navigate to="/user" />;
  }
  if (path.startsWith('/user') && user.role !== 'user') {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;