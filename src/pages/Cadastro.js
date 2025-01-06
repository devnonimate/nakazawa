import React, { useState } from 'react';
import './Cadastro.css'; // Reutilizando o mesmo CSS com adaptações
import { FaUserAlt, FaLock } from 'react-icons/fa'; // Importando ícones
import { useNavigate } from 'react-router-dom'; // Hook para navegação

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setError('');
        setSuccess('Cadastro realizado com sucesso!');
        setTimeout(() => navigate('/login'), 3000); // Redireciona para a tela de login após 3 segundos
      } else {
        setError(data.message || 'Erro ao realizar cadastro.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setError('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="custom-login-page">
      {/* Título centralizado */}
      <div className="logo"></div>

      {/* Contêiner de cadastro */}
      <div className="center-box">
        <div className="login-box">
          <h2>Cadastro</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <FaUserAlt className="input-icon" />
              <input
                type="email"
                placeholder="E-mail"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div className="input-container">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Repita a senha"
                className="login-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit" className="login-button">
              Cadastrar
            </button>
            <p className="signup-link">
              Já tem uma conta?
              <br />
              <span onClick={() => navigate('/login')} className="clickable">
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
