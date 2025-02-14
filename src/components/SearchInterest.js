import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const SearchinterestConfig = ({ selectedEmpresa }) => {
  const [adinterest, setAdinterest] = useState('');
  const [locale, setLocale] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    const storedEmail = localStorage.getItem('username');
    if (!storedEmail) {
      setError('Email não encontrado no LocalStorage.');
      setLoading(false);
      return;
    }

    if (!selectedEmpresa) {
      setError('Nome da empresa não selecionado.');
      setLoading(false);
      return;
    }

    try {
      const url = `${config.API_URL}/api/facebook-campanhas?email=${encodeURIComponent(storedEmail)}&nome_empresa=${encodeURIComponent(selectedEmpresa)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar campanhas.');
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!adinterest || !locale) {
      setError('Preencha os campos de Ad Interest e Locale.');
      return;
    }

    setLoading(true);
    setError('');

    const storedEmail = localStorage.getItem('username');
    const payload = {
      email: storedEmail,
      empresa: selectedEmpresa,
      adinterest: adinterest,
      locale: locale,
    };

    try {
      const url = new URL(`${config.API_URL}/api/ads-account`);
      url.searchParams.append('email', payload.email);
      url.searchParams.append('nome_empresa', payload.empresa);
      url.searchParams.append('adinterest', payload.adinterest); // Passa adinterest
      url.searchParams.append('locale', payload.locale); // Passa locale

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao Carregar Resultados.');
      }

      const data = await response.json();
      console.log('Resultados Carregados:', data);
      setResponse(data);
    } catch (error) {
      console.error('Erro ao Carregar Resultados:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Configuração de Anúncios Facebook</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label htmlFor="adinterest">Ad Interest:</label>
        <input
          id="adinterest"
          type="text"
          value={adinterest}
          onChange={(e) => setAdinterest(e.target.value)}
          placeholder="Insira Ad Interest"
        />
      </div>

      <div>
        <label htmlFor="locale">Locale:</label>
        <input
          id="locale"
          type="text"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          placeholder="Insira o Locale"
        />
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Carregando Resultados...' : 'Carregar Resultados'}
      </button>

      {response && (
        <div>
          <h4>Resultado:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SearchinterestConfig;
