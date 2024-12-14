import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CadastroClientes = () => {
  const [clienteNome, setClienteNome] = useState('');
  const [empresaNome, setEmpresaNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
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

    // Armazenando as empresas no LocalStorage
    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    // Gerar o ID da nova empresa (sequencial, baseado no ID máximo existente)
    const novaEmpresaId = empresas.length > 0 ? Math.max(...empresas.map(emp => emp.id)) + 1 : 1;
    const novaEmpresa = {
      id: novaEmpresaId,
      nome: empresaNome,
    };

    // Gerar o ID do novo cliente (sequencial, baseado no ID máximo existente)
    const novoClienteId = clientes.length > 0 ? Math.max(...clientes.map(cli => cli.id)) + 1 : 1;
    const novoCliente = {
      id: novoClienteId,
      nome: clienteNome,
      empresa: empresaNome,
      telefone: telefone,
    };

    // Adicionando as empresas e clientes ao localStorage
    empresas.push(novaEmpresa);
    clientes.push(novoCliente);

    // Salvando os dados no LocalStorage
    localStorage.setItem('empresas', JSON.stringify(empresas));
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Resetando os campos
    setClienteNome('');
    setEmpresaNome('');
    setTelefone('');
    setErrorMessage('');

    // Navegar para a página de Home
    navigate('/home');
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Cadastro de Empresas e Clientes</h2>
      <p style={descriptionStyle}>Cadastre uma empresa e associe clientes a ela. Isso ajuda a organizar os dados e facilitar a gestão das contas conectadas.</p>

      {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

      <form onSubmit={handleFormSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="clienteNome" style={labelStyle}>Nome do Cliente</label>
          <input
            type="text"
            id="clienteNome"
            value={clienteNome}
            onChange={(e) => setClienteNome(e.target.value)}
            style={inputStyle}
            placeholder="Digite o nome do cliente"
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="empresaNome" style={labelStyle}>Nome da Empresa</label>
          <input
            type="text"
            id="empresaNome"
            value={empresaNome}
            onChange={(e) => setEmpresaNome(e.target.value)}
            style={inputStyle}
            placeholder="Digite o nome da empresa"
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="telefone" style={labelStyle}>Número de Telefone</label>
          <input
            type="text"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={inputStyle}
            placeholder="Digite o número de telefone"
          />
        </div>

        <button type="submit" style={submitButtonStyle}>Cadastrar Cliente e Empresa</button>
      </form>

      <div style={manageButtonContainer}>
        <button onClick={() => navigate('/gerenciar-empresas')} style={manageButtonStyle}>Gerenciar Empresas</button>
      </div>
    </div>
  );
};

// Estilos para a página de cadastro
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 20px',
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
};

const headerStyle = {
  fontSize: '24px',
  color: '#333',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const descriptionStyle = {
  color: '#555',
  fontSize: '16px',
  marginBottom: '30px',
  textAlign: 'center',
};

const formStyle = {
  width: '100%',
};

const inputGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  color: '#333',
  marginBottom: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const errorStyle = {
  color: '#ff0000',
  fontSize: '14px',
  marginBottom: '20px',
  textAlign: 'center',
};

const manageButtonContainer = {
  marginTop: '20px',
};

const manageButtonStyle = {
  padding: '12px 20px',
  fontSize: '16px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default CadastroClientes;
