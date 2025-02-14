import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const CampaignDetailsConfig = ({ selectedEmpresa }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFields, setSelectedFields] = useState([]); // Agora aceita múltiplos campos
  const [fields, setFields] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const campaignFields = [
    { id: 'id', description: 'ID da campanha.' },
    { id: 'name', description: 'Nome da campanha.' },
    { id: 'objective', description: 'Objetivo da campanha (exemplo: TRAFFIC, AWARENESS, SALES).' },
    { id: 'account_id', description: 'ID da conta de anúncios associada.' },
    { id: 'buying_type', description: 'Tipo de compra (exemplo: AUCTION, FIXED_PRICE).' },
    { id: 'daily_budget', description: 'Orçamento diário da campanha.' },
    { id: 'lifetime_budget', description: 'Orçamento total da campanha.' },
    { id: 'spend_cap', description: 'Limite de gasto da campanha.' },
    { id: 'bid_strategy', description: 'Estratégia de lances (exemplo: LOWEST_COST, TARGET_COST).' },
    { id: 'pacing_type', description: 'Tipo de aceleração de gasto (exemplo: STANDARD, AGGRESSIVE).' },
    { id: 'status', description: 'Status da campanha (exemplo: ACTIVE, PAUSED, DELETED).' },
    { id: 'effective_status', description: 'Status efetivo da campanha, considerando restrições e condições.' },
    { id: 'promoted_object', description: 'Objeto promovido pela campanha (exemplo: site, app).' },
    { id: 'recommendations', description: 'Recomendações do sistema para melhorar a campanha.' },
    { id: 'start_time', description: 'Data e hora de início da campanha.' },
    { id: 'stop_time', description: 'Data e hora de término da campanha.' },
    { id: 'created_time', description: 'Data de criação da campanha.' },
    { id: 'updated_time', description: 'Data de última atualização da campanha.' },
    { id: 'adlabels', description: 'Rótulos aplicados à campanha.' },
    { id: 'issues_info', description: 'Informações sobre problemas com a campanha (exemplo: erros).' },
    { id: 'special_ad_categories', description: 'Categorias especiais de anúncios (exemplo: POLITICAL).' },
    { id: 'special_ad_category_country', description: 'País associado a categorias especiais de anúncios.' },
    { id: 'smart_promotion_type', description: 'Tipo de promoção inteligente (exemplo: EVENTS, PRODUCTS).' },
    { id: 'is_skadnetwork_attribution', description: 'Indica se a atribuição é feita via SKAdNetwork para campanhas de iOS.' }
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
      const url = new URL(`${config.API_URL}/api/campaign-details`);
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

export default CampaignDetailsConfig;
