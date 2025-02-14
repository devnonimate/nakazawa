import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const AdSetDetailsConfig = ({ selectedEmpresa }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedFields, setSelectedFields] = useState([]); // Agora aceita múltiplos campos
  const [fields, setFields] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const campaignFields = [
    { id: 'optimization_goal', description: 'Objetivo de otimização do conjunto de anúncios (exemplo: REACH, ENGAGEMENT, CONVERSIONS).' },
    { id: 'updated_time', description: 'Data e hora da última atualização do conjunto de anúncios.' },
    { id: 'billing_event', description: 'Evento de cobrança do conjunto de anúncios (exemplo: IMPRESSIONS, CLICKS).' },
    { id: 'bid_strategy', description: 'Estratégia de lance utilizada (exemplo: LOWEST_COST, TARGET_COST).' },
    { id: 'lifetime_spend_cap', description: 'Limite de gasto vitalício do conjunto de anúncios.' },
    { id: 'daily_spend_cap', description: 'Limite de gasto diário do conjunto de anúncios.' },
    { id: 'learning_stage_info', description: 'Informações sobre o estágio de aprendizado do conjunto de anúncios.' },
    { id: 'effective_status', description: 'Status efetivo do conjunto de anúncios, levando em consideração restrições e condições (exemplo: ACTIVE, PAUSED).' },
    { id: 'lifetime_min_spend_target', description: 'Valor mínimo de gasto vitalício do conjunto de anúncios.' },
    { id: 'destination_type', description: 'Tipo de destino do conjunto de anúncios (exemplo: WEBSITE, APP).' },
    { id: 'bid_adjustments', description: 'Ajustes de lance para diferentes condições.' },
    { id: 'bid_amount', description: 'Valor do lance (caso esteja usando um modelo de lance fixo).' },
    { id: 'id', description: 'ID único do conjunto de anúncios.' },
    { id: 'daily_min_spend_target', description: 'Valor mínimo de gasto diário do conjunto de anúncios.' },
    { id: 'campaign_id', description: 'ID da campanha à qual o conjunto de anúncios pertence.' },
    { id: 'pacing_type', description: 'Tipo de controle de ritmo (exemplo: STANDARD, AGGRESSIVE).' },
    { id: 'created_time', description: 'Data e hora de criação do conjunto de anúncios.' },
    { id: 'attribution_spec', description: 'Especificação de atribuição, que determina como os resultados do anúncio são atribuídos a eventos (exemplo: CLICK_THROUGH, VIEW_THROUGH).' },
    { id: 'issues_info', description: 'Informações sobre quaisquer problemas ou restrições no conjunto de anúncios.' },
    { id: 'lifetime_budget', description: 'Orçamento vitalício do conjunto de anúncios.' },
    { id: 'creative_sequence', description: 'Sequência de criativos a ser usada no conjunto de anúncios.' },
    { id: 'adset_schedule', description: 'Horário e dias da semana em que o conjunto de anúncios está programado para ser exibido.' },
    { id: 'end_time', description: 'Data e hora de término do conjunto de anúncios.' },
    { id: 'daily_budget', description: 'Orçamento diário do conjunto de anúncios.' },
    { id: 'is_dynamic_creative', description: 'Indica se o conjunto de anúncios usa criativos dinâmicos (caso use).' },
    { id: 'start_time', description: 'Data e hora de início do conjunto de anúncios.' },
    { id: 'account_id', description: 'ID da conta de anúncios associada ao conjunto de anúncios.' },
    { id: 'adlabels', description: 'Rótulos de anúncios associados ao conjunto de anúncios.' },
    { id: 'budget_remaining', description: 'Orçamento restante do conjunto de anúncios.' },
    { id: 'promoted_object', description: 'Objetos promovidos no conjunto de anúncios (por exemplo, um link para um site ou aplicativo).' },
    { id: 'name', description: 'Nome do conjunto de anúncios.' },
    { id: 'bid_constraints', description: 'Restrições de lance aplicadas ao conjunto de anúncios.' },
    { id: 'targeting', description: 'Segmentação do conjunto de anúncios, incluindo vários subcampos como localização, interesses, faixa etária, etc.' },
    { id: 'status', description: 'Status do conjunto de anúncios (exemplo: ACTIVE, PAUSED, DELETED).' },
    { id: 'rf_prediction_id', description: 'ID da previsão de alcance e frequência para o conjunto de anúncios.' },
    { id: 'time_based_ad_rotation_id_blocks', description: 'Blocos de rotação de anúncios baseados no tempo para o conjunto de anúncios.' },
    { id: 'time_based_ad_rotation_intervals', description: 'Intervalos de rotação de anúncios baseados no tempo.' },
    { id: 'frequency_control_specs', description: 'Especificações de controle de frequência para o conjunto de anúncios.' },
    { id: 'geo_locations', description: 'Localizações geográficas segmentadas no conjunto de anúncios.' },
    { id: 'keywords', description: 'Palavras-chave segmentadas no conjunto de anúncios.' },
    { id: 'genders', description: 'Gêneros segmentados no conjunto de anúncios.' },
    { id: 'age_min', description: 'Idade mínima segmentada no conjunto de anúncios.' },
    { id: 'age_max', description: 'Idade máxima segmentada no conjunto de anúncios.' },
    { id: 'relationship_statuses', description: 'Status de relacionamento segmentado no conjunto de anúncios.' },
    { id: 'countries', description: 'Países segmentados no conjunto de anúncios.' },
    { id: 'locales', description: 'Localidades segmentadas no conjunto de anúncios.' },
    { id: 'device_platforms', description: 'Plataformas de dispositivos segmentadas no conjunto de anúncios.' },
    { id: 'effective_device_platforms', description: 'Plataformas de dispositivos efetivas no conjunto de anúncios.' },
    { id: 'publisher_platforms', description: 'Plataformas de publicadores segmentadas no conjunto de anúncios.' },
    { id: 'effective_publisher_platforms', description: 'Plataformas de publicadores efetivas no conjunto de anúncios.' },
    { id: 'facebook_positions', description: 'Posições no Facebook segmentadas no conjunto de anúncios.' },
    { id: 'effective_facebook_positions', description: 'Posições efetivas no Facebook segmentadas no conjunto de anúncios.' },
    { id: 'instagram_positions', description: 'Posições no Instagram segmentadas no conjunto de anúncios.' },
    { id: 'effective_instagram_positions', description: 'Posições efetivas no Instagram segmentadas no conjunto de anúncios.' },
    { id: 'audience_network_positions', description: 'Posições na Audience Network segmentadas no conjunto de anúncios.' },
    { id: 'effective_audience_network_positions', description: 'Posições efetivas na Audience Network segmentadas no conjunto de anúncios.' },
    { id: 'messenger_positions', description: 'Posições no Messenger segmentadas no conjunto de anúncios.' },
    { id: 'effective_messenger_positions', description: 'Posições efetivas no Messenger segmentadas no conjunto de anúncios.' },
    { id: 'education_statuses', description: 'Status educacional segmentado no conjunto de anúncios.' },
    { id: 'user_adclusters', description: 'Grupos de anúncios segmentados no conjunto de anúncios.' },
    { id: 'excluded_geo_locations', description: 'Localizações geográficas excluídas do conjunto de anúncios.' },
    { id: 'interested_in', description: 'Interesses segmentados no conjunto de anúncios.' },
    { id: 'interests', description: 'Interesses segmentados no conjunto de anúncios.' },
    { id: 'behaviors', description: 'Comportamentos segmentados no conjunto de anúncios.' },
    { id: 'connections', description: 'Conexões segmentadas no conjunto de anúncios.' },
    { id: 'excluded_connections', description: 'Conexões excluídas do conjunto de anúncios.' },
    { id: 'friends_of_connections', description: 'Amigos de conexões segmentados no conjunto de anúncios.' },
    { id: 'user_os', description: 'Sistemas operacionais segmentados no conjunto de anúncios.' },
    { id: 'user_device', description: 'Dispositivos segmentados no conjunto de anúncios.' },
    { id: 'excluded_user_device', description: 'Dispositivos excluídos do conjunto de anúncios.' },
    { id: 'app_install_state', description: 'Estado de instalação do aplicativo segmentado no conjunto de anúncios.' },
    { id: 'wireless_carrier', description: 'Operadoras de telefonia segmentadas no conjunto de anúncios.' },
    { id: 'site_category', description: 'Categorias de site segmentadas no conjunto de anúncios.' },
    { id: 'college_years', description: 'Anos de faculdade segmentados no conjunto de anúncios.' },
    { id: 'work_employers', description: 'Empregadores segmentados no conjunto de anúncios.' },
    { id: 'work_positions', description: 'Cargos de trabalho segmentados no conjunto de anúncios.' },
    { id: 'education_majors', description: 'Áreas de estudo segmentadas no conjunto de anúncios.' },
    { id: 'life_events', description: 'Eventos de vida segmentados no conjunto de anúncios.' },
    { id: 'politics', description: 'Segmentação política no conjunto de anúncios.' },
    { id: 'income', description: 'Faixa de renda segmentada no conjunto de anúncios.' },
    { id: 'home_type', description: 'Tipo de residência segmentado no conjunto de anúncios.' },
    { id: 'home_value', description: 'Valor de imóvel segmentado no conjunto de anúncios.' },
    { id: 'ethnic_affinity', description: 'Afinidade étnica segmentada no conjunto de anúncios.' },
    { id: 'generation', description: 'Geração segmentada no conjunto de anúncios.' },
    { id: 'household_composition', description: 'Composição de domicílio segmentada no conjunto de anúncios.' },
    { id: 'moms', description: 'Segmentação de mães no conjunto de anúncios.' },
    { id: 'office_type', description: 'Tipo de escritório segmentado no conjunto de anúncios.' },
    { id: 'family_statuses', description: 'Status familiar segmentado no conjunto de anúncios.' },
    { id: 'net_worth', description: 'Valor líquido segmentado no conjunto de anúncios.' },
    { id: 'home_ownership', description: 'Propriedade de imóvel segmentada no conjunto de anúncios.' },
    { id: 'industries', description: 'Indústrias segmentadas no conjunto de anúncios.' },
    { id: 'education_schools', description: 'Escolas segmentadas no conjunto de anúncios.' },
    { id: 'custom_audiences', description: 'Audiências personalizadas no conjunto de anúncios.' },
    { id: 'excluded_custom_audiences', description: 'Audiências personalizadas excluídas do conjunto de anúncios.' },
    { id: 'dynamic_audience_ids', description: 'IDs de audiências dinâmicas no conjunto de anúncios.' },
    { id: 'product_audience_specs', description: 'Especificações de audiência de produto no conjunto de anúncios.' },
    { id: 'excluded_product_audience_specs', description: 'Especificações de audiência de produto excluídas do conjunto de anúncios.' },
    { id: 'flexible_spec', description: 'Especificações flexíveis de segmentação no conjunto de anúncios.' },
    { id: 'exclusions', description: 'Exclusões de segmentação no conjunto de anúncios.' },
    { id: 'excluded_publisher_categories', description: 'Categorias de publicadores excluídas do conjunto de anúncios.' },
    { id: 'excluded_publisher_list_ids', description: 'IDs de listas de publicadores excluídas do conjunto de anúncios.' },
    { id: 'place_page_set_ids', description: 'IDs de conjuntos de páginas de lugares no conjunto de anúncios.' },
    { id: 'targeting_optimization', description: 'Otimização de segmentação no conjunto de anúncios.' },
    { id: 'brand_safety_content_filter_levels', description: 'Níveis de filtro de segurança de marca no conjunto de anúncios.' },
    { id: 'is_whatsapp_destination_ad', description: 'Indica se o conjunto de anúncios é direcionado para o WhatsApp.' },
    { id: 'instream_video_skippable_excluded', description: 'Indica se os vídeos in-stream são puláveis.' },
    { id: 'targeting_relaxation_types', description: 'Tipos de relaxamento de segmentação no conjunto de anúncios.' }
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

export default AdSetDetailsConfig;
