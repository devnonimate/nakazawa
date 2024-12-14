// src/routes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Importe suas páginas
import Dashboard from './pages/Dashboard'; // Outra página de exemplo

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />  {/* Rota para a página de Login */}
      <Route path="/dashboard" element={<Dashboard />} />  {/* Rota para a página Dashboard */}
      {/* Adicione mais rotas aqui conforme necessário */}
    </Routes>
  );
}

export default AppRoutes;
