import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditarEmpresa = () => {
  const { id } = useParams(); // Obtém o id da empresa da URL
  const [empresaNome, setEmpresaNome] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Busca a empresa pelo id armazenado no LocalStorage
    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    const empresa = empresas.find((empresa) => empresa.id === parseInt(id));

    if (empresa) {
      setEmpresaNome(empresa.nome);
      setClienteNome(empresa.clienteNome || ''); // Definindo nome do cliente caso exista
    } else {
      setErrorMessage('Empresa não encontrada!');
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!empresaNome || !clienteNome) {
      setErrorMessage('Nome da empresa e nome do cliente são obrigatórios!');
      return;
    }

    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    const empresaIndex = empresas.findIndex((empresa) => empresa.id === parseInt(id));

    if (empresaIndex !== -1) {
      empresas[empresaIndex].nome = empresaNome;
      empresas[empresaIndex].clienteNome = clienteNome;
      localStorage.setItem('empresas', JSON.stringify(empresas));
      navigate('/gerenciar-empresas');
    } else {
      setErrorMessage('Erro ao editar a empresa.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Editar Empresa</h2>
      {errorMessage && <div style={errorStyle}>{errorMessage}</div>}
      <form onSubmit={handleSubmit} style={formStyle}>
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
        <button type="submit" style={submitButtonStyle}>Salvar Alterações</button>
      </form>
    </div>
  );
};

// Estilos para a página de edição de empresa
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
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxSizing: 'border-box', // Garante que a largura dos inputs sejam ajustadas corretamente
};

const submitButtonStyle = {
  width: '100%',
  padding: '14px',
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

export default EditarEmpresa;
