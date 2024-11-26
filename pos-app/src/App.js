import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/Login/Signup/Signup';
import Pos from './pos';
import PrivateRoute from './components/common/PrivateRoute';
import StoreNameSetup from './components/StoreNameSetup/StoreNameSetup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Signup />} />
        <Route 
          path="/pos" 
          element={
            <PrivateRoute>
              <Pos />
            </PrivateRoute>
          } 
        />
        <Route path="/store-name-setup" element={<StoreNameSetup />} />
      </Routes>
    </Router>
  );
}

export default App; 