import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminView from './components/AdminView';
import UserView from './components/UserView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminView />
          </ProtectedRoute>
        } />
        <Route path="/user/*" element={
          <ProtectedRoute>
            <UserView />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;