import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Header from './components/Header';
import Metricas from './pages/Metricas';
import CadastroClientes from './pages/CadastroClientes';
import Configuracoes from './pages/Configuracoes';
import GerenciarEmpresas from './pages/GerenciarEmpresas';
import Home from './pages/Home';
import EditarEmpresa from './pages/EditarEmpresa';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PoliticaDePrivacidade from './pages/PoliticaDePrivacidade';
import TermsOfService from './pages/TermsOfService';
import Cadastro from './pages/Cadastro';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica a autenticação através do backend
    const checkAuth = async () => {
      try {
        const response = await fetch('https://04d2-2804-71d4-6004-82c0-cd50-f9fc-d79e-e2ec.ngrok-free.app/api/check-auth', {
          credentials: 'include', // Envia cookies com a requisição
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Remove a autenticação e redireciona para a página de login
    setIsAuthenticated(false);
    fetch('https://04d2-2804-71d4-6004-82c0-cd50-f9fc-d79e-e2ec.ngrok-free.app/api/logout', { credentials: 'include' })
      .catch((err) => console.error('Erro ao deslogar:', err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </Router>
  );
};

const AppContent = ({ isAuthenticated, onLoginSuccess, onLogout }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPrivacyPolicyPage = location.pathname === '/privacy-policy';

  if (!isAuthenticated && !isLoginPage && !isPrivacyPolicyPage) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {!isLoginPage && !isPrivacyPolicyPage && <Header onLogout={onLogout} />}
      <div style={{ padding: !isLoginPage && !isPrivacyPolicyPage ? '20px' : '0' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gerenciar-empresas" element={<GerenciarEmpresas />} />
          <Route path="/metricas" element={<Metricas />} />
          <Route path="/metricas/:empresaId" element={<Metricas />} />
          <Route path="/cadastro-clientes" element={<CadastroClientes />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/editar-empresa/:id" element={<EditarEmpresa />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
