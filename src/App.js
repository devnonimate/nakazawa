import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login'; // Importando o componente Login
import Header from './components/Header'; // Importando o Header
import Metricas from './pages/Metricas'; // Importando o componente Metricas
import CadastroClientes from './pages/CadastroClientes';
import Configuracoes from './pages/Configuracoes';
import GerenciarEmpresas from './pages/GerenciarEmpresas';
import Home from './pages/Home'; // Importando o componente Home
import EditarEmpresa from './pages/EditarEmpresa'; // Importando o componente EditarEmpresa

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se o usuário está autenticado no localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Conclui o carregamento
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Exibe um carregamento enquanto verifica a autenticação
  }

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} />
    </Router>
  );
};

const AppContent = ({ isAuthenticated }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {/* Renderiza o Header em todas as páginas, exceto na página de login */}
      {!isLoginPage && <Header />}
      <div style={{ padding: !isLoginPage ? '20px' : '0' }}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/gerenciar-empresas"
            element={isAuthenticated ? <GerenciarEmpresas /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/metricas"
            element={isAuthenticated ? <Metricas /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/metricas/:empresaId"
            element={isAuthenticated ? <Metricas /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cadastro-clientes"
            element={isAuthenticated ? <CadastroClientes /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/configuracoes"
            element={isAuthenticated ? <Configuracoes /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/editar-empresa/:id"
            element={isAuthenticated ? <EditarEmpresa /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;