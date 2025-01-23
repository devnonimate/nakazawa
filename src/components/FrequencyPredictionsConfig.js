import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const FrequencyPredictionsConfig = ({ selectedEmpresa, email }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [fields, setFields] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');

  const campaignFields = [
    { id: 'external_maximum_impression', description: 'Impressões máximas previstas para a campanha.' },
    { id: 'external_budget', description: 'Orçamento total planejado para a campanha.' },
    { id: 'time_updated', description: 'Última atualização da previsão.' },
    { id: 'pause_periods', description: 'Períodos em que a campanha está pausada.' },
    { id: 'audience_size_lower_bound', description: 'Tamanho mínimo estimado do público-alvo.' },
    { id: 'external_maximum_budget', description: 'Orçamento máximo permitido na previsão.' },
    { id: 'prediction_mode', description: 'Modo da previsão (por exemplo, otimizado para alcance ou frequência).' },
    { id: 'external_maximum_reach', description: 'Alcance máximo estimado para a campanha.' },
    { id: 'holdout_percentage', description: 'Percentual da audiência que será excluído da campanha (holdout).' },
    { id: 'prediction_progress', description: 'Progresso da previsão (percentual concluído).' },
    { id: 'target_spec', description: 'Especificações do público-alvo da campanha.' },
    { id: 'id', description: 'ID da previsão de alcance e frequência.' },
    { id: 'story_event_type', description: 'Tipo de evento da história patrocinada (caso aplicável).' },
    { id: 'audience_size_upper_bound', description: 'Tamanho máximo estimado do público-alvo.' },
    { id: 'external_minimum_reach', description: 'Alcance mínimo esperado da campanha.' },
    { id: 'reservation_status', description: 'Status da reserva da campanha.' },
    { id: 'time_created', description: 'Data e hora de criação da previsão.' },
    { id: 'external_impression', description: 'Impressões reais obtidas até o momento.' },
    { id: 'external_minimum_impression', description: 'Impressões mínimas esperadas para a campanha.' },
    { id: 'expiration_time', description: 'Data de expiração da previsão.' },
    { id: 'external_minimum_budget', description: 'Orçamento mínimo necessário para a campanha.' },
    { id: 'account_id', description: 'ID da conta de anúncios associada.' },
    { id: 'interval_frequency_cap_reset_period', description: 'Período de redefinição do limite de frequência.' },
    { id: 'campaign_time_stop', description: 'Data e hora de término da campanha.' },
    { id: 'destination_id', description: 'ID do destino do anúncio (pode ser um público específico ou um placement).' },
    { id: 'status', description: 'Status atual da previsão.' },
    { id: 'external_reach', description: 'Alcance real obtido até o momento.' },
    { id: 'frequency_cap', description: 'Limite máximo de exibições para um único usuário dentro de um período.' },
    { id: 'campaign_group_id', description: 'ID do grupo de campanhas ao qual essa previsão pertence.' },
    { id: 'campaign_id', description: 'ID da campanha associada à previsão.' },
    { id: 'campaign_time_start', description: 'Data e hora de início da campanha.' },
    { id: 'instagram_destination_id', description: 'ID do destino no Instagram (se aplicável).' },
    { id: 'name', description: 'Nome da previsão.' }
  ];

  useEffect(() => {
    // Carregar os campos da campanha
    setFields(campaignFields);

    // Primeira requisição para obter as campanhas
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/facebook-campanhas`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar campanhas.');
        }

        const data = await response.json();
        // Exemplo de estrutura: [{ id: 'campanha1', name: 'Campanha 1' }, { id: 'campanha2', name: 'Campanha 2' }]
        const campaignOptions = data.map((campaign) => ({
          id: campaign.id,
          name: `${campaign.name} - ${campaign.id}`
        }));
        setCampaigns(campaignOptions);
      } catch (error) {
        console.error('Erro ao carregar campanhas:', error);
        setError('Erro ao carregar campanhas. Tente novamente.');
      }
    };

    fetchCampaigns();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCampaign || !selectedField) {
      setError('Selecione uma campanha e um campo.');
      return;
    }

    setError('');

    try {
      const payload = {
        email: email,
        empresa: selectedEmpresa,
        campaignId: selectedCampaign,
        field: selectedField
      };

      const response = await fetch(`${config.API_URL}/api/frequency-predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar as previsões.');
      }

      const data = await response.json();
      console.log('Previsões de Frequência geradas:', data);
    } catch (error) {
      console.error('Erro ao gerar previsões:', error);
      setError('Erro ao gerar previsões. Tente novamente.');
    }
  };

  return (
    <div>
      <h3>Configurações de Previsões de Frequência</h3>
      <div>
        <label htmlFor="campaign">Selecione a campanha:</label>
        <select
          id="campaign"
          value={selectedCampaign}
          onChange={(e) => setSelectedCampaign(e.target.value)}
        >
          <option value="">Selecione...</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="field">Selecione o campo:</label>
        <select
          id="field"
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
        >
          <option value="">Selecione...</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.description}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleGenerate}>Gerar Previsões</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default FrequencyPredictionsConfig;
