import React, { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';

const Configuracoes = () => {
  const [empresas, setEmpresas] = useState([]);
  const [authenticatedEmpresas, setAuthenticatedEmpresas] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    carregarDados(); // Carregar os dados inicialmente
  }, []);

  const carregarDados = () => {
    const username = localStorage.getItem('username'); // O e-mail do usuário logado

    if (!username) {
      setErrorMessage('Usuário não autenticado. Faça login novamente.');
      return;
    }

    setErrorMessage('Carregando dados...');

    fetch('https://db8a-2804-71d4-6005-50-ce1-e935-e7f5-e9cc.ngrok-free.app/api/consultar-empresa-cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao carregar dados das empresas e clientes');
        }
        return response.json();
      })
      .then((data) => {
        setEmpresas(
          data.map((item) => ({
            id: item.empresa_id,
            nome: item.empresa_nome,
          }))
        );
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(
          'Não foi possível carregar os dados. Tente novamente mais tarde.'
        );
        console.error(error);
      });
  };

  const handleLoginFacebook = (empresaNome) => {
    const email = localStorage.getItem('username'); // O email do usuário logado
  
    if (!email) {
      setErrorMessage('Usuário não autenticado. Faça login novamente.');
      return;
    }
  
    fetch('https://db8a-2804-71d4-6005-50-ce1-e935-e7f5-e9cc.ngrok-free.app/api/login-facebook-marketing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        empresa: empresaNome,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.redirect_url) {
          window.location.href = data.redirect_url; // Redireciona para o Facebook
        } else {
          setErrorMessage(data.message || 'Erro ao autenticar com o Facebook');
        }
      })
      .catch((error) => {
        setErrorMessage('Erro ao iniciar autenticação com o Facebook.');
        console.error(error);
      });
  };
  const handleLogoutFacebook = (empresaNome) => {
  const email = localStorage.getItem('username'); // O email do usuário logado

  if (!email) {
    setErrorMessage('Usuário não autenticado. Faça login novamente.');
    return;
  }

  fetch('https://db8a-2804-71d4-6005-50-ce1-e935-e7f5-e9cc.ngrok-free.app/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      empresa: empresaNome,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setAuthenticatedEmpresas((prev) => ({
          ...prev,
          [empresaNome]: false,
        }));
        setErrorMessage('Logout realizado com sucesso.');
      } else {
        setErrorMessage(data.message || 'Erro ao realizar logout.');
      }
    })
    .catch((error) => {
      setErrorMessage('Erro ao realizar logout com o Facebook.');
      console.error(error);
    });
};

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Configuração de Conexão com Facebook Marketing</h2>
      {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

      <button onClick={carregarDados} style={refreshButtonStyle}>
        <FaSync style={{ marginRight: '10px' }} /> Atualizar Dados
      </button>

      <ul style={empresaListStyle}>
        {empresas.map((empresa) => (
          <li key={empresa.id} style={empresaItemStyle}>
            <span style={empresaNameStyle}>{empresa.nome}</span>
            {authenticatedEmpresas[empresa.nome] ? (
              <div>
                <button style={authenticatedButtonStyle} disabled>
                  Autenticado
                </button>
                <button
                  style={logoutButtonStyle}
                  onClick={() => handleLogoutFacebook(empresa.nome)}
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                style={loginButtonStyle}
                onClick={() => handleLoginFacebook(empresa.nome)}
              >
                Login com Facebook
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Estilos para a página de configurações
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
};

const headerStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const errorStyle = {
  color: '#ff0000',
  fontSize: '14px',
  marginBottom: '20px',
};

const empresaListStyle = {
  listStyleType: 'none',
  padding: 0,
  width: '100%',
};

const empresaItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const empresaNameStyle = {
  fontWeight: 'bold',
  color: '#333',
};

const loginButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#3b5998',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const authenticatedButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'not-allowed',
};

const logoutButtonStyle = {
  marginLeft: '10px',
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const refreshButtonStyle = {
  marginBottom: '20px',
  padding: '10px 20px',
  backgroundColor: '#1e88e5',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

export default Configuracoes;
