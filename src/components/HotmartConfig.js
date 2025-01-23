import React, { useState, useEffect } from 'react';

const HotmartConfig = ({ selectedEmpresa, showForm }) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [showToken, setShowToken] = useState(false); // Estado para controlar a visibilidade do token

  useEffect(() => {
    const storedEmail = localStorage.getItem('username');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async () => {
    if (!clientId || !clientSecret || !token) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/registro-hotmart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          empresa: selectedEmpresa,
          client_id: clientId,
          client_secret: clientSecret,
          token,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar configurações do Hotmart.');
      }

      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar com o servidor.');
    }
  };
  console.log('showForm:', showForm);

  return (
    showForm && (
      <div className="hotmart-config">
        <h3>Configuração Hotmart</h3>
        <input
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
        />
        <div className="token-input">
          <input
            type={showToken ? 'text' : 'password'} // Alterna entre 'text' e 'password'
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={() => setShowToken(!showToken)}>
            {showToken ? 'Esconder' : 'Mostrar'} Token
          </button>
        </div>
        <button onClick={handleSubmit}>Salvar</button>
      </div>
    )
  );
};

export default HotmartConfig;
