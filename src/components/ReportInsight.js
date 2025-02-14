import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const CampaignReportConfig = ({ selectedEmpresa }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [timeIncrement, setTimeIncrement] = useState('7d');
  const [spend, setSpend] = useState('');
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');
  const [limit, setLimit] = useState('');
  const [campaigns, setCampaigns] = useState([]);
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

  const handleGenerate = async () => {
    if (!selectedCampaign) {
      setError('Selecione uma campanha.');
      return;
    }

    setLoading(true);
    setError('');

    const storedEmail = localStorage.getItem('username');
    const url = new URL(`${config.API_URL}/api/report-insights`);
    url.searchParams.append('email', storedEmail);
    url.searchParams.append('nome_empresa', selectedEmpresa);
    url.searchParams.append('campaignId', selectedCampaign);
    url.searchParams.append('time_increment', timeIncrement);
    url.searchParams.append('spend', spend);
    url.searchParams.append('since', since);
    url.searchParams.append('until', until);
    url.searchParams.append('limit', limit);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao gerar relatório.');
      }

      const data = await response.json();
      console.log('Relatório gerado:', data);
      setResponse(data);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Configurações de Relatório de Campanha</h3>

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
        <label>Time Increment:</label>
        <select value={timeIncrement} onChange={(e) => setTimeIncrement(e.target.value)}>
          <option value="7d">7 Dias</option>
          <option value="30d">30 Dias</option>
          <option value="all_days">Todos os Dias</option>
        </select>
      </div>

      <div>
        <label>Spend:</label>
        <input type="text" value={spend} onChange={(e) => setSpend(e.target.value)} />
      </div>

      <div>
        <label>Since:</label>
        <input type="date" value={since} onChange={(e) => setSince(e.target.value)} />
      </div>

      <div>
        <label>Until:</label>
        <input type="date" value={until} onChange={(e) => setUntil(e.target.value)} />
      </div>

      <div>
        <label>Limit:</label>
        <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} />
      </div>

      <button onClick={fetchCampaigns} disabled={loading}>
        {loading ? 'Carregando Campanhas...' : 'Carregar Campanhas'}
      </button>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Gerando Relatório...' : 'Gerar Relatório'}
      </button>

      {response && (
        <div>
          <h4>Resultado do Relatório:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CampaignReportConfig;
