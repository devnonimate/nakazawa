import React, { useState, useEffect } from 'react';
import './Login.css';
import config from './config';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const texts = [
    'Analise suas métricas com qualidade\nusando a nossa ferramenta.',
    'Obtenha insights valiosos\nsobre suas campanhas.',
    'Escolha quais métricas deseja ver\nsem que você fique perdido.',
  ];

  useEffect(() => {
    // Verificar se o usuário já está autenticado no localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      onLoginSuccess(); // Atualiza o estado de login
    }

    const interval = setInterval(() => {
      if (deleting) {
        setCurrentText((prev) => prev.slice(0, -1));
        if (currentText.length === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        setCurrentText(texts[index].slice(0, currentText.length + 1));
        if (currentText.length === texts[index].length) {
          setDeleting(true);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentText, deleting, index, texts, onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.API_URL}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userEmail', data.email); // Armazena o email do usuário
        localStorage.setItem('username', username);   // Armazena o nome de usuário
        onLoginSuccess(); // Atualiza o estado de autenticação
        navigate('/home'); // Redireciona para a página home
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar ao servidor!');
    }
  };

  return (
    <div className="custom-login-page">
      <div className="logo">NAKAZAWA</div>
      <div className="right-side">
        <div className="typewriter">
          {currentText}
          <span className="cursor">|</span>
        </div>
      </div>
      <div className="left-side">
        <div className="login-box">
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <FaUserAlt className="input-icon" />
              <input
                type="text"
                placeholder="Usuário"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Senha"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" className="login-button">Entrar</button>
            <p className="signup-link">
              Não tem uma conta?
              <br />
              <span onClick={() => navigate('/cadastro')} className="clickable">
                Cadastre-se
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
