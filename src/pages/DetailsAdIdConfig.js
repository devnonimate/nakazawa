import React, { useState, useEffect } from 'react';
import config from '../pages/config.js';

const AdsetFieldsConfig = ({ selectedEmpresa }) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedAdset, setSelectedAdset] = useState(''); // Mantém o estado do adset
  const [selectedCampaignStatus, setSelectedCampaignStatus] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [adsets, setAdsets] = useState([]);
  const [fields, setFields] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const campaignFields = [
    { id: 'created_time', description: 'Data e hora de criação do conjunto de anúncios.' },
    { id: 'effective_status', description: 'Status efetivo do conjunto de anúncios, considerando restrições ou outras condições.' },
    { id: 'id', description: 'ID único do conjunto de anúncios.' },
    { id: 'name', description: 'Nome do conjunto de anúncios.' },
    { id: 'recommendations', description: 'Recomendações do sistema para melhorar o desempenho do conjunto de anúncios.' },
    { id: 'status', description: 'Status configurado do conjunto de anúncios (exemplo: ACTIVE, PAUSED, DELETED).' }
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
      const url = `${config.API_URL}/api/facebook-adsets?ad_account_id=${selectedAccount}&email=${encodeURIComponent(storedEmail)}&nome_empresa=${encodeURIComponent(selectedEmpresa)}`;
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

  const fetchAdsets = async () => {
    if (!selectedCampaign) {
      setError('Selecione uma campanha antes de buscar adsets.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = `${config.API_URL}/api/facebook-adsets?campaign_id=${selectedCampaign}`;
      const response = await fetch(url, { headers: { Accept: 'application/json', 'ngrok-skip-browser-warning': 'true' } });
      if (!response.ok) throw new Error('Erro ao buscar adsets.');
      const data = await response.json();
      setAdsets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Configuração de Aplicativos Anunciáveis</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Campo para selecionar o Adset, acima dos outros campos */}
      <div>
        <label>Selecione o Adset:</label>
        <select value={selectedAdset} onChange={(e) => setSelectedAdset(e.target.value)}>
          <option value=''>Selecione...</option>
          {adsets.map(adset => (
            <option key={adset.id} value={adset.id}>{adset.name}</option>
          ))}
        </select>
        <button onClick={fetchAdsets} disabled={loading}>Carregar Adsets</button>
      </div>

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
            <option key={campaign.id} value={campaign.id}>{campaign.name} ({campaign.status})</option>
          ))}
        </select>
        <button onClick={fetchCampaigns} disabled={loading}>Carregar Campanhas</button>
      </div>
    </div>
  );
};

export default AdsetFieldsConfig;
