import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const CustomConversionConfig = ({ selectedEmpresa }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFields, setSelectedFields] = useState([]); // Agora aceita múltiplos campos
  const [fields, setFields] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const campaignFields = [
    { id: 'account_id', description: 'Identificador da conta de anúncios.' },
    { id: 'creation_time', description: 'A data e hora em que a conversão personalizada foi criada.' },
    { id: 'custom_event_type', description: 'O tipo de evento personalizado (por exemplo, "Compra", "Cadastro", etc.' },
    { id: 'default_conversion_value', description: 'O valor padrão atribuído à conversão (como o valor monetário de uma compra).' },
    { id: 'description', description: 'Descrição da conversão personalizada.' },
    { id: 'data_sources', description: 'As fontes de dados associadas à conversão (como o Pixel do Facebook ou eventos offline).' },
    { id: 'first_fired_time', description: 'A primeira vez que o evento personalizado foi acionado.' },
    { id: 'is_archived', description: 'Indica se a conversão personalizada foi arquivada (não ativa).' },
    { id: 'last_fired_time', description: 'A última vez que o evento personalizado foi acionado.' },
    { id: 'name', description: 'O nome da conversão personalizada.' },
    { id: 'pixel', description: 'O ID do pixel do Facebook associado à conversão personalizada.' },
    { id: 'rule', description: 'A regra usada para definir a conversão personalizada (como a URL visitada, a ação realizada, etc.' },
    { id: 'id', description: 'Identificador único da conversão personalizada.' }
  ];

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
      setCampaigns(data.map(campaign => ({
        id: campaign.id,
        name: `${campaign.name} - ${campaign.id}`
      })));
      setResponse(data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFields(campaignFields);
  }, []);

  const handleFieldSelection = (fieldId) => {
    setSelectedFields(prevFields =>
      prevFields.includes(fieldId)
        ? prevFields.filter(id => id !== fieldId) // Remove se já estiver selecionado
        : [...prevFields, fieldId] // Adiciona se não estiver
    );
  };

  const handleGenerate = async () => {
    if (!selectedCampaign || selectedFields.length === 0) {
      setError('Selecione uma campanha e pelo menos um campo.');
      return;
    }

    setLoading(true);
    setError('');

    const storedEmail = localStorage.getItem('username');
    const payload = {
      email: storedEmail,
      empresa: selectedEmpresa,
      campaignId: selectedCampaign,
      fields: selectedFields.join(','), // Junta os campos selecionados separados por vírgula
    };

    try {
      const url = new URL(`${config.API_URL}/api/custom-conversion`);
      url.searchParams.append('email', payload.email);
      url.searchParams.append('nome_empresa', payload.empresa);
      url.searchParams.append('campaignId', payload.campaignId);
      url.searchParams.append('fields', payload.fields);

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
      <h3>Metricas Facebook ADS</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label htmlFor="campaign">Selecione a campanha:</label>
        <select id="campaign" value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}>
          <option value="">Selecione...</option>
          {campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Selecione os campos:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {fields.map(field => (
            <label key={field.id} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                value={field.id}
                checked={selectedFields.includes(field.id)}
                onChange={() => handleFieldSelection(field.id)}
              />
              {field.description}
            </label>
          ))}
        </div>
      </div>

      <button onClick={fetchCampaigns} disabled={loading}>
        {loading ? 'Carregando Campanhas...' : 'Carregar Campanhas'}
      </button>

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

export default CustomConversionConfig;
