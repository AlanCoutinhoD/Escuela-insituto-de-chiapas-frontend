import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminView from './components/AdminView';
import ProtectedRoute from './components/ProtectedRoute';
import UserView from './components/UserView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminView />
            </ProtectedRoute>
          } 
        />
       
        <Route 
        path='/user'
         element={
          <UserView/>} 
          />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;