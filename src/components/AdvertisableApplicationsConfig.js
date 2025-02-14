import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const AdvertisableApplicationsConfig = ({ selectedEmpresa }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFields, setSelectedFields] = useState([]); // Agora aceita múltiplos campos
  const [fields, setFields] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const campaignFields = [
    { id: 'id', description: 'ID do aplicativo no Facebook.' },
    { id: 'name', description: 'Nome do aplicativo.' },
    { id: 'app_install_tracked', description: 'Indica se as instalações do aplicativo estão sendo rastreadas pelo Facebook Ads.' },
    { id: 'app_name', description: 'Nome do aplicativo na loja de aplicativos.' },
    { id: 'app_type', description: 'Tipo do aplicativo (exemplo: GAME, UTILITY, SOCIAL).' },
    { id: 'category', description: 'Categoria do aplicativo (exemplo: Jogos, Entretenimento).' },
    { id: 'icon_url', description: 'URL do ícone do aplicativo.' },
    { id: 'ipad_app_store_id', description: 'ID do aplicativo na App Store para iPad.' },
    { id: 'iphone_app_store_id', description: 'ID do aplicativo na App Store para iPhone.' },
    { id: 'link', description: 'Link para o aplicativo no Facebook.' },
    { id: 'mobile_web_url', description: 'URL da versão web móvel do aplicativo.' },
    { id: 'object_store_urls', description: 'Links diretos para a página do aplicativo nas lojas (App Store/Google Play).' },
    { id: 'supported_platforms', description: 'Plataformas suportadas (exemplo: ANDROID, IOS, WEB).' },
    { id: 'website_url', description: 'URL do site oficial do aplicativo.' },
    { id: 'photo_url', description: 'URL da foto de capa do aplicativo.' },
    { id: 'advertisable_app_events', description: 'Eventos de aplicativo que podem ser usados em campanhas (exemplo: INSTALL, PURCHASE).'}
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
      const url = new URL(`${config.API_URL}/api/advertisable-applications`);
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
        throw new Error(data.error || 'Erro ao carregar Métricas.');
      }

      const data = await response.json();
      console.log('Métricas carregadas:', data);
      setResponse(data);
    } catch (error) {
      console.error('Erro ao carregar Métricas:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Métricas Facebook ADS</h3>

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
        {loading ? 'Carregando Métricas...' : 'Carregar Métricas'}
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

export default AdvertisableApplicationsConfig;
