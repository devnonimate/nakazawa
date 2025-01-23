import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Header from './components/Header';
import Metricas from './pages/Metricas';
import CadastroClientes from './pages/CadastroClientes';
import GerenciarEmpresas from './pages/GerenciarEmpresas';
import Home from './pages/Home';
import EditarEmpresa from './pages/EditarEmpresa';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PoliticaDePrivacidade from './pages/PoliticaDePrivacidade';
import TermsOfService from './pages/TermsOfService';
import Cadastro from './pages/Cadastro';
import config from './pages/config.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se o email está salvo no localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      // Verifica com o backend
      const checkAuth = async () => {
        try {
          const response = await fetch(`${config.API_URL}/api/check-auth`, {
            credentials: 'include', // Envia cookies com a requisição
          });
          if (response.ok) {
            setIsAuthenticated(true);
            // Armazena o email no localStorage
            const data = await response.json();
            localStorage.setItem("userEmail", data.email);
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
    }
  }, []);

  const handleLoginSuccess = (email) => {
    setIsAuthenticated(true);
    localStorage.setItem("userEmail", email); // Salva o email no localStorage
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("userEmail"); // Remove o email do localStorage
    fetch(`${config.API_URL}/api/logout`, { credentials: 'include' })
      .catch((err) => console.error('Erro ao deslogar:', err));
  };

  // Enquanto a autenticação não for verificada, exibe um loading
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

  // Se o usuário não estiver autenticado e não estiver nas páginas de login ou política de privacidade, redireciona
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
