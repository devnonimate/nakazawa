import React, { useState, useEffect } from 'react';
import './Login.css'; // Certifique-se de ter um arquivo CSS para o estilo
import { FaUserAlt, FaLock } from 'react-icons/fa'; // Importando ícones
import { useNavigate } from 'react-router-dom'; // Importando useNavigate para navegação

const Login = () => {
  const [currentText, setCurrentText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook de navegação

  const texts = [
    'Analise suas métricas com qualidade\nusando a nossa ferramenta.',
    'Obtenha insights valiosos\nsobre suas campanhas.',
    'Escolha quais métricas deseja ver\nsem que você fique perdido.',
  ];

  useEffect(() => {
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
  }, [currentText, deleting, index, texts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validação de login
    if (username === 'admin' && password === '12345') {
      setError('');
      localStorage.setItem('user', username); // Salva a autenticação no localStorage
      window.location.reload(); // Recarrega a página para redirecionar automaticamente
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="custom-login-page">
      {/* Topo esquerdo com o título Nakazawa */}
      <div className="logo">NAKAZAWA</div>

      {/* Lado direito (Centro) com o efeito typewriter */}
      <div className="right-side">
        <div className="typewriter">
          {currentText}
          <span className="cursor">|</span>
        </div>
      </div>

      {/* Lado esquerdo (Centro) com o formulário de login */}
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
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
