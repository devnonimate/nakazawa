import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CadastroClientes = () => {
  const [clienteNome, setClienteNome] = useState('');
  const [empresaNome, setEmpresaNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Recupera o e-mail do usuário logado do localStorage
  const loggedUserEmail = localStorage.getItem('username');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos
    if (!clienteNome || !empresaNome || !telefone) {
      setErrorMessage('Todos os campos são obrigatórios!');
      return;
    }

    if (!/^\d{10,11}$/.test(telefone)) {
      setErrorMessage('Número de telefone inválido. O telefone deve ter 10 ou 11 dígitos.');
      return;
    }

    if (!loggedUserEmail) {
      setErrorMessage('Erro ao recuperar o e-mail do usuário. Faça login novamente.');
      return;
    }

    const dados = {
      email: loggedUserEmail,
      empresa: empresaNome,
      cliente: clienteNome,
      telefone: telefone,
    };

    try {
      const response = await fetch('https://04d2-2804-71d4-6004-82c0-cd50-f9fc-d79e-e2ec.ngrok-free.app/api/cadastrar-empresa-cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar empresa e cliente');
      }

      navigate('/home');
    } catch (error) {
      setErrorMessage(`Erro ao enviar dados: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Cadastro de Empresas e Clientes</h2>
      <p style={styles.description}>
        Cadastre uma empresa e associe clientes a ela. Isso ajuda a organizar os dados e facilitar a gestão das contas conectadas.
      </p>

      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <form onSubmit={handleFormSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="clienteNome" style={styles.label}>Nome do Cliente</label>
          <input
            type="text"
            id="clienteNome"
            value={clienteNome}
            onChange={(e) => setClienteNome(e.target.value)}
            style={styles.input}
            placeholder="Digite o nome do cliente"
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="empresaNome" style={styles.label}>Nome da Empresa</label>
          <input
            type="text"
            id="empresaNome"
            value={empresaNome}
            onChange={(e) => setEmpresaNome(e.target.value)}
            style={styles.input}
            placeholder="Digite o nome da empresa"
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="telefone" style={styles.label}>Número de Telefone</label>
          <input
            type="text"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={styles.input}
            placeholder="Digite o número de telefone"
          />
        </div>

        <button type="submit" style={styles.button}>Cadastrar</button>
      </form>
    </div>
  );
};

// Estilos em objeto
const styles = {
  container: {
    margin: '0 auto',
    maxWidth: '500px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  description: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#555',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    display: 'block',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    alignSelf: 'center',
  },
};

export default CadastroClientes;
