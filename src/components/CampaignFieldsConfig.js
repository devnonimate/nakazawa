import React, { useState, useEffect } from 'react';
import config from '../pages/config.js';

const CampaignFieldsConfig = ({ selectedEmpresa }) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [fields, setFields] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const campaignFields = [
    { id: 'objective', description: 'Objetivo da campanha (exemplo: TRAFFIC, AWARENESS, SALES).' },
  { id: 'name', description: 'Nome da campanha.' },
  { id: 'configured_status', description: 'Status configurado da campanha (exemplo: ACTIVE, PAUSED).' },
  { id: 'effective_status', description: 'Status efetivo da campanha, considerando qualquer restrição ou condição.' },
  { id: 'buying_type', description: 'Tipo de compra (exemplo: AUCTION, FIXED_PRICE).' },
  { id: 'created_time', description: 'Data de criação da campanha.' },
  { id: 'updated_time', description: 'Data de última atualização da campanha.' },
  { id: 'spend_cap', description: 'Limite de gasto da campanha.' },
  { id: 'can_use_spend_cap', description: 'Indica se é possível usar o limite de gasto para a campanha.' },
  { id: 'issues_info', description: 'Informações sobre problemas ou restrições associadas à campanha.' },
  { id: 'special_ad_categories', description: 'Categorias especiais de anúncios (exemplo: POLITICAL, SOCIAL_ISSUES).' }
  ];

  useEffect(() => {
    setFields(campaignFields);
  }, []);

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

  const fetchCampaigns = async () => {
    if (!selectedAccount) {
      setError('Selecione uma conta antes de buscar campanhas.');
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
      // Incluindo email e nome_empresa na URL
      const url = `${config.API_URL}/api/facebook-anuncios?ad_account_id=${selectedAccount}&email=${encodeURIComponent(storedEmail)}&nome_empresa=${encodeURIComponent(selectedEmpresa)}`;
      const response = await fetch(url, { headers: { Accept: 'application/json', 'ngrok-skip-browser-warning': 'true' } });
      if (!response.ok) throw new Error('Erro ao buscar campanhas.');
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleGenerate = async () => {
    if (!selectedCampaign || selectedFields.length === 0) {
      setError('Selecione uma campanha e pelo menos um campo.');
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
      // Incluindo email, nome_empresa e o id da campanha (anuncio) na URL
      const url = `${config.API_URL}/api/campaign-withfields?campaignwithfields=${selectedCampaign}&fields=${selectedFields.join(',')}&email=${encodeURIComponent(storedEmail)}&nome_empresa=${encodeURIComponent(selectedEmpresa)}&anuncio=${encodeURIComponent(selectedCampaign)}`;
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
        <label>Selecione a Campanha:</label>
        <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}>
          <option value=''>Selecione...</option>
          {campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
          ))}
        </select>
        <button onClick={fetchCampaigns} disabled={loading}>Carregar Campanhas</button>
      </div>

      <div>
        <label>Selecione os Campos:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {fields.map(field => (
            <label key={field.id} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type='checkbox'
                value={field.id}
                checked={selectedFields.includes(field.id)}
                onChange={() => setSelectedFields(prev => prev.includes(field.id) ? prev.filter(id => id !== field.id) : [...prev, field.id])}
              />
              {field.description}
            </label>
          ))}
        </div>
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

export default CampaignFieldsConfig;
