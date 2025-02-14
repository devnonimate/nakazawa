import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const AdsAccountConfig = ({ selectedEmpresa }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFields, setSelectedFields] = useState([]); // Agora aceita múltiplos campos
  const [fields, setFields] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const campaignFields = [
    { id: 'id', description: 'ID único do anúncio.' },
    { id: 'name', description: 'Nome do anúncio.' },
    { id: 'bid_amount', description: 'Valor do lance associado ao anúncio.' },
    { id: 'adset_id', description: 'ID do conjunto de anúncios ao qual o anúncio pertence.' },
    { id: 'creative', description: 'Detalhes do criativo do anúncio, incluindo IDs e URLs de mídias associadas.' },
    { id: 'effective_instagram_story_id', description: 'ID do Story no Instagram associado ao criativo (se aplicável).' },
    { id: 'effective_instagram_media_id', description: 'ID da mídia do Instagram associada ao criativo (se aplicável).' },
    { id: 'instagram_permalink_url', description: 'URL permanente do anúncio no Instagram.' },
    { id: 'status', description: 'Status do anúncio (exemplo: ACTIVE, PAUSED).' },
    { id: 'effective_status', description: 'Status efetivo do anúncio, considerando todas as condições e restrições.' },
    { id: 'created_time', description: 'Data e hora em que o anúncio foi criado.' },
    { id: 'updated_time', description: 'Data e hora da última atualização do anúncio.' },
    { id: 'tracking_specs', description: 'Especificações de rastreamento para o anúncio (exemplo: URLs de rastreamento).' },
    { id: 'conversion_specs', description: 'Especificações de conversão associadas ao anúncio.' },
    { id: 'ad_review_feedback', description: 'Feedback da revisão do anúncio, indicando se o anúncio foi aprovado ou reprovado, e o motivo se houver.' },
    { id: 'adlabels', description: 'Rótulos do anúncio, que são usados para organizar anúncios em grupos.' },
    { id: 'issues_info', description: 'Informações sobre quaisquer problemas ou restrições associadas ao anúncio.' },
    { id: 'conversion_domain', description: 'Domínio de conversão associado ao anúncio, usado para rastrear conversões.' },
    { id: 'campaign_id', description: 'ID da campanha à qual o anúncio pertence.' }
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
      const url = new URL(`${config.API_URL}/api/ads-account`);
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

export default AdsAccountConfig;
