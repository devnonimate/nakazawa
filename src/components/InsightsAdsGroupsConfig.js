import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../pages/config.js';

const InsightsAdsGroupsConfig = ({ selectedEmpresa }) => {
  const [selectedFields, setSelectedFields] = useState([]); // Agora aceita múltiplos campos
  const [fields, setFields] = useState([]); // Campos de dados
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  // Definindo os campos disponíveis (sem a parte de campanhas do Facebook)
  const campaignFields = [
    { id: 'date_start', description: 'Data de início do período de análise dos dados.' },
    { id: 'date_stop', description: 'Data de término do período de análise dos dados.' },
    { id: 'account_id', description: 'ID da conta de anúncios.' },
    { id: 'account_name', description: 'Nome da conta de anúncios.' },
    { id: 'ad_id', description: 'ID do anúncio específico.' },
    { id: 'ad_name', description: 'Nome do anúncio específico.' },
    { id: 'adset_id', description: 'ID do conjunto de anúncios ao qual o anúncio pertence.' },
    { id: 'adset_name', description: 'Nome do conjunto de anúncios ao qual o anúncio pertence.' },
    { id: 'actions', description: 'Ações realizadas pelos usuários como resultado da exibição do anúncio.' },
    { id: 'unique_actions', description: 'Ações únicas realizadas pelos usuários em resposta ao anúncio.' },
    { id: 'action_values', description: 'Valores atribuídos às ações realizadas pelos usuários.' },
    { id: 'impressions', description: 'Número de vezes que o anúncio foi exibido.' },
    { id: 'clicks', description: 'Número de cliques realizados no anúncio.' },
    { id: 'unique_clicks', description: 'Número de cliques únicos realizados no anúncio.' },
    { id: 'spend', description: 'Gasto total com o anúncio.' },
    { id: 'frequency', description: 'Número médio de vezes que um usuário viu o anúncio.' },
    { id: 'inline_link_clicks', description: 'Número de cliques em links dentro do anúncio.' },
    { id: 'inline_post_engagement', description: 'Número de interações com o post (comentários, curtidas, compartilhamentos).' },
    { id: 'reach', description: 'Número de pessoas únicas que viram o anúncio.' },
    { id: 'website_ctr', description: 'Taxa de cliques no site (CTR) gerada pelo anúncio.' },
    { id: 'video_thruplay_watched_actions', description: 'Ações realizadas após o término completo do vídeo.' },
    { id: 'video_avg_time_watched_actions', description: 'Ações realizadas com base no tempo médio assistido do vídeo.' },
    { id: 'video_p25_watched_actions', description: 'Ações realizadas após 25% do vídeo ser assistido.' },
    { id: 'video_p50_watched_actions', description: 'Ações realizadas após 50% do vídeo ser assistido.' },
    { id: 'video_p75_watched_actions', description: 'Ações realizadas após 75% do vídeo ser assistido.' },
    { id: 'video_p95_watched_actions', description: 'Ações realizadas após 95% do vídeo ser assistido.' },
    { id: 'video_p100_watched_actions', description: 'Ações realizadas após 100% do vídeo ser assistido.' },
    { id: 'video_30_sec_watched_actions', description: 'Ações realizadas após 30 segundos de vídeo assistido.' },
    { id: 'video_play_actions', description: 'Ações realizadas após o início de reprodução do vídeo.' },
    { id: 'video_continuous_2_sec_watched_actions', description: 'Ações realizadas após o vídeo ser assistido por 2 segundos consecutivos.' },
    { id: 'unique_video_continuous_2_sec_watched_actions', description: 'Ações realizadas por usuários únicos após o vídeo ser assistido por 2 segundos consecutivos.' },
    { id: 'estimated_ad_recallers', description: 'Estimativa do número de pessoas que se lembram de ter visto o anúncio.' },
    { id: 'estimated_ad_recall_rate', description: 'Taxa estimada de pessoas que se lembram de ter visto o anúncio.' },
    { id: 'unique_outbound_clicks', description: 'Número de cliques únicos em links que levam para fora da plataforma.' },
    { id: 'outbound_clicks', description: 'Número total de cliques em links externos ao Facebook.' },
    { id: 'conversions', description: 'Número de conversões geradas pelo anúncio.' },
    { id: 'conversion_values', description: 'Valores monetários atribuídos às conversões realizadas.' },
    { id: 'social_spend', description: 'Gasto associado a interações sociais com o anúncio.' }
  ];

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
    if (selectedFields.length === 0) {
      setError('Selecione pelo menos um campo.');
      return;
    }

    setLoading(true);
    setError('');

    const storedEmail = localStorage.getItem('username');
    const payload = {
      email: storedEmail,
      empresa: selectedEmpresa,
      fields: selectedFields.join(','), // Junta os campos selecionados separados por vírgula
    };

    try {
      const url = new URL(`${config.API_URL}/api/insightsads`);
      url.searchParams.append('email', payload.email);
      url.searchParams.append('nome_empresa', payload.empresa);
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

export default InsightsAdsGroupsConfig;
