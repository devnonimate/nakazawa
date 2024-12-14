import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Configuracoes = () => {
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [facebookToken, setFacebookToken] = useState('');
  const [hotmartToken, setHotmartToken] = useState('');
  const [googleToken, setGoogleToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar as empresas do LocalStorage
    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    setEmpresas(empresas);
  }, []);

  const handleEmpresaChange = (empresaId) => {
    const empresa = empresas.find((e) => e.id === empresaId);
    if (empresa) {
      setSelectedEmpresa(empresa);
      // Carregar os tokens salvos (se existirem) para esta empresa
      setFacebookToken(empresa.facebookToken || '');
      setHotmartToken(empresa.hotmartToken || '');
      setGoogleToken(empresa.googleToken || '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedEmpresa) {
      setErrorMessage('Selecione uma empresa para configurar as APIs.');
      return;
    }

    const updatedEmpresas = empresas.map((empresa) => {
      if (empresa.id === selectedEmpresa.id) {
        return {
          ...empresa,
          facebookToken,
          hotmartToken,
          googleToken,
        };
      }
      return empresa;
    });

    localStorage.setItem('empresas', JSON.stringify(updatedEmpresas));
    setEmpresas(updatedEmpresas);
    setErrorMessage('');
    navigate('/home'); // Redireciona para a página principal
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Configuração de Conexão com APIs</h2>
      {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

      <div style={empresaSelectStyle}>
        <label htmlFor="empresaSelect" style={labelStyle}>Selecione uma Empresa</label>
        <select
          id="empresaSelect"
          onChange={(e) => handleEmpresaChange(parseInt(e.target.value))}
          style={selectStyle}
        >
          <option value="">Selecione uma empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nome}
            </option>
          ))}
        </select>
      </div>

      {selectedEmpresa && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="facebookToken" style={labelStyle}>Token do Facebook</label>
            <input
              type="text"
              id="facebookToken"
              value={facebookToken}
              onChange={(e) => setFacebookToken(e.target.value)}
              style={inputStyle}
              placeholder="Digite o token do Facebook"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="hotmartToken" style={labelStyle}>Token do Hotmart</label>
            <input
              type="text"
              id="hotmartToken"
              value={hotmartToken}
              onChange={(e) => setHotmartToken(e.target.value)}
              style={inputStyle}
              placeholder="Digite o token do Hotmart"
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="googleToken" style={labelStyle}>Token do Google Ads</label>
            <input
              type="text"
              id="googleToken"
              value={googleToken}
              onChange={(e) => setGoogleToken(e.target.value)}
              style={inputStyle}
              placeholder="Digite o token do Google Ads"
            />
          </div>

          <button type="submit" style={submitButtonStyle}>Salvar Conexões</button>
        </form>
      )}
    </div>
  );
};

// Estilos para a página de configurações
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 20px',
  maxWidth: '800px',
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
  boxSizing: 'border-box',
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

const empresaSelectStyle = {
  marginBottom: '20px',
  width: '100%',
};

const selectStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxSizing: 'border-box',
};

export default Configuracoes;
