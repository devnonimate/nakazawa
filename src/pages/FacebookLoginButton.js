import React, { useState, useEffect } from 'react';
import config from '../pages/config.js';

const FacebookLoginButton = ({ selectedEmpresa }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEmpresa) {
      checkLoginStatus();
    }
  }, [selectedEmpresa]);

  const checkLoginStatus = async () => {
    const email = localStorage.getItem('username');
    if (!email || !selectedEmpresa) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/check-facebook-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, empresa: selectedEmpresa }),
      });
      
      const data = await response.json();
      setIsLoggedIn(data.loggedIn);
    } catch (error) {
      console.error('Erro ao verificar login:', error);
    }
    setLoading(false);
  };

  const handleLogin = () => {
    window.location.href = `${config.API_URL}/facebook-login?empresa=${encodeURIComponent(selectedEmpresa)}`;
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`facebook-login-btn ${isLoggedIn ? 'logged-in' : 'logged-out'}`}
    >
      {loading ? 'Verificando...' : isLoggedIn ? 'Logado no Facebook' : 'Login com Facebook'}
    </button>
  );
};

export default FacebookLoginButton;
