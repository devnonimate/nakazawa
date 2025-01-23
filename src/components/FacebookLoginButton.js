import React, { useState, useEffect } from 'react';
import config from '../pages/config.js';

const FacebookLoginButton = ({ selectedEmpresa }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedEmpresa) {
      checkLoginStatus();
    }
  }, [selectedEmpresa]);

  const checkLoginStatus = async () => {
    const email = localStorage.getItem('username');
    if (!email || !selectedEmpresa) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.API_URL}/check-facebook-login`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, empresa: selectedEmpresa }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      setIsLoggedIn(data.loggedIn);
    } catch (error) {
      console.error('Erro ao verificar login:', error);
      setError('Erro ao verificar login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Abre o link em uma nova aba
    const newWindow = window.open(`${config.API_URL}/facebook-login?empresa=${encodeURIComponent(selectedEmpresa)}`, '_blank');

    // Ouve a resposta da nova aba
    const interval = setInterval(() => {
      // Verifica se a aba foi fechada (caso o processo tenha terminado e a aba tenha sido fechada)
      if (newWindow.closed) {
        clearInterval(interval);
        // Aqui você pode adicionar a lógica para atualizar o estado da página original
        checkLoginStatus();  // Verifica novamente se o login foi realizado
      }
    }, 1000);  // Verifica a cada 1 segundo se a nova aba foi fechada
  };

  const handleLogout = async () => {
    const email = localStorage.getItem('username');
    if (!email || !selectedEmpresa) return;

    setLoading(true);
    setError(null);

    try {
      // Envia a requisição para apagar o token do banco de dados
      const response = await fetch(`${config.API_URL}/logout-facebook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, empresa: selectedEmpresa }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Após o logout, atualiza o estado para "Login no Facebook"
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setError('Erro ao tentar fazer logout. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="error-message">{error}</p>}
      <div className="login-container">
        <button
          onClick={handleLogin}
          disabled={loading || isLoggedIn}
          className={`facebook-login-btn ${isLoggedIn ? 'logged-in' : 'logged-out'}`}
        >
          {loading ? 'Verificando...' : isLoggedIn ? 'Logado no Facebook' : 'Login com Facebook'}
        </button>
        
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="logout-btn"
            disabled={loading}
          >
            X
          </button>
        )}
      </div>
    </div>
  );
};

export default FacebookLoginButton;
