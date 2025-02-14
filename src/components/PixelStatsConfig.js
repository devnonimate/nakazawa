import React, { useState, useEffect } from 'react';
import config from '../pages/config.js';

const PixelStats = ({ selectedEmpresa }) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedPixel, setSelectedPixel] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [pixels, setPixels] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    const storedEmail = localStorage.getItem('username');
    if (!storedEmail) {
      setError('Email não encontrado no LocalStorage.');
      setLoading(false);
      return;
    }

    try {
      const url = `${config.API_URL}/api/facebook-campanhas?email=${encodeURIComponent(storedEmail)}&nome_empresa=${encodeURIComponent(selectedEmpresa)}`;
      const response = await fetch(url, { headers: { Accept: 'application/json', 'ngrok-skip-browser-warning': 'true' } });
      if (!response.ok) throw new Error('Erro ao buscar contas.');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPixels = async () => {
    if (!selectedAccount) {
      setError('Selecione uma conta antes de buscar o Pixel ID.');
      return;
    }
  
    setLoading(true);
    setError('');
    setResponse(null);
  
    const storedEmail = localStorage.getItem('username');
    if (!storedEmail) {
      setError('Email não encontrado no LocalStorage.');
      setLoading(false);
      return;
    }
  
    try {
      const url = `${config.API_URL}/api/pixel-id?ad_account_id=${selectedAccount}&email=${encodeURIComponent(storedEmail)}&nome_empresa=${encodeURIComponent(selectedEmpresa)}`;
      const response = await fetch(url, { headers: { Accept: 'application/json', 'ngrok-skip-browser-warning': 'true' } });
      if (!response.ok) throw new Error('Erro ao buscar Pixel ID.');
      const data = await response.json();
      setPixels(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPixel) {
      setError('Selecione um Pixel.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    const storedEmail = localStorage.getItem('username');
    if (!storedEmail) {
      setError('Email não encontrado no LocalStorage.');
      setLoading(false);
      return;
    }
  
    try {
      const url = `${config.API_URL}/api/pixelidstats?pixel_id=${selectedPixel}&email=${encodeURIComponent(storedEmail)}&nome_empresa=${encodeURIComponent(selectedEmpresa)}`;
      const response = await fetch(url, { headers: { Accept: 'application/json', 'ngrok-skip-browser-warning': 'true' } });
      if (!response.ok) throw new Error('Erro ao carregar resultados.');
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Configuração de Facebook ADS</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Selecione a Conta:</label>
        <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
          <option value=''>Selecione...</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
        <button onClick={fetchAccounts} disabled={loading}>Carregar Contas</button>
      </div>

      <div>
        <label>Selecione o Pixel:</label>
        <select value={selectedPixel} onChange={(e) => setSelectedPixel(e.target.value)}>
          <option value=''>Selecione...</option>
          {pixels.map(pixel => (
            <option key={pixel.id} value={pixel.id}>{pixel.name}</option>
          ))}
        </select>
        <button onClick={fetchPixels} disabled={loading}>Carregar Pixels</button>
      </div>

      <button onClick={handleGenerate} disabled={loading}>Carregar Resultados</button>

      {response && (
        <div>
          <h4>Resultado:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PixelStats;
