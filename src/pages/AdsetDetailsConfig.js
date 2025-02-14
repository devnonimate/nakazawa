import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const AdsetDetailsConfig = ({ selectedEmpresa }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFields, setSelectedFields] = useState([]); // Agora aceita múltiplos campos
  const [fields, setFields] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const campaignFields = [
    { id: 'external_maximum_impression', description: 'Impressões máximas previstas para a campanha.' },
    { id: 'external_budget', description: 'Orçamento total planejado para a campanha.' },
    { id: 'time_updated', description: 'Última atualização da previsão.' },
    { id: 'pause_periods', description: 'Períodos em que a campanha está pausada.' },
    { id: 'audience_size_lower_bound', description: 'Tamanho mínimo estimado do público-alvo.' },
    { id: 'external_maximum_budget', description: 'Orçamento máximo permitido na previsão.' },
    { id: 'prediction_mode', description: 'Modo da previsão (por exemplo, otimizado para alcance ou frequência).' },
    { id: 'external_maximum_reach', description: 'Alcance máximo estimado para a campanha.' }
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
      const url = new URL(`${config.API_URL}/api/adset-details`);
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
        throw new Error(data.error || 'Erro ao gerar previsões.');
      }

      const data = await response.json();
      console.log('Previsões de Frequência geradas:', data);
      setResponse(data);
    } catch (error) {
      console.error('Erro ao gerar previsões:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Configurações de Previsões de Frequência</h3>

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
        {loading ? 'Gerando Previsões...' : 'Gerar Previsões'}
      </button>

      {response && (
        <div>
          <h4>Resultado das Previsões de Frequência:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdsetDetailsConfig;
