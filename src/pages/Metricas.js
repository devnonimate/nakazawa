import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config.js';
import EmpresaSelect from '../components/EmpresaSelect';
import PlataformaSelect from '../components/PlataformaSelect';
import FacebookLoginButton from '../components/FacebookLoginButton';
import HotmartConfig from '../components/HotmartConfig';
import './Metricas.css';

const hotmartMetrics = [
  { name: 'Histórico de Vendas', component: 'SalesHistoryConfig' },
  { name: 'Resumo de Vendas', component: 'SalesSummaryConfig' },
  { name: 'Vendas do Usuário', component: 'SalesUsersConfig' },
  { name: 'Comissões de Vendas', component: 'SalesComissionsConfig' },
  { name: 'Repartição do Preço de Venda', component: 'SalesPriceDetailsConfig' },
  { name: 'Inscrições', component: 'SubscriptionsConfig' },
  { name: 'Resumo das Assinaturas', component: 'SubscriptionSummaryConfig' },
  { name: 'Assinaturas', component: 'SubscriberConfig' },
];

const facebookMetrics = [
  { name: 'Previsões de Campanhas', component: 'FrequencyPredictionsConfig' },
  { name: 'Lista de Aplicativos que podem ser promovidos', component: 'AdvertisableApplicationConfig' },
  { name: 'Detalhes sobre campanha', component: 'CampaignDetailsConfig' },
  { name: 'Informações detalhadas sobre um Adset', component: 'AdsetDetailsConfig' },
  { name: 'Informação detalhada sobre uma conta de anúncios no Facebook', component: 'AdsAccountConfig' },
  { name: 'Busca de Segmentação Ampla dentro de uma Conta de Anúncios', component: 'TargetingCategoriesConfig' },
  { name: 'Busca informações sobre as conversões personalizadas associadas a uma conta de anúncios no Facebook', component: 'CustomConversionConfig' },
  { name: 'Obtém informações sobre o Pixel do Facebook associado a uma conta de anúncios.', component: 'PixelDetailsConfig' },
  { name: 'Informações sobre grupo de campanhas', component: 'CampaignGroupFieldsConfig' },
  { name: 'Detalhes Profundos sobre as campanhas', component: 'CampaignFieldsConfig' },
  { name: 'Informações sobre um AdSet', component: 'AdsetFieldsConfig' },
  { name: 'Informações detalhadas sobre um anuncio específico', component: 'DetailsAdidConfig' },
  { name: 'Obter dados detalhados de desempenho em uma conta de anúncios do Facebook', component: 'InsightsAdsGroupsConfig' },
  { name: 'Relatório de insights sobre o desempenho de anúncios em uma conta do Facebook durante um intervalo de tempo especificado', component: 'ReportInsight' },
  { name: 'Busca de Interesses', component: 'SearchInterest' },
  { name: 'Estatísticas de desempenho de um Pixel do Facebook', component: 'PixelStatsConfig' },
];

const Metricas = () => {
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [selectedPlataforma, setSelectedPlataforma] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [isFacebookSelected, setIsFacebookSelected] = useState(false);
  const [showHotmartForm, setShowHotmartForm] = useState(false);
  const [hotmartFilters, setHotmartFilters] = useState(null);
  const [dynamicComponent, setDynamicComponent] = useState(null);
  const navigate = useNavigate();
  const email = localStorage.getItem('username');

  useEffect(() => {
    setSelectedPlataforma(null);
    setSelectedMetrics([]);
    setDashboardData(null);
    setShowHotmartForm(false);
    setHotmartFilters(null);
  }, [selectedEmpresa]);

  const handleEmpresaSelect = (empresa) => {
    setSelectedEmpresa(empresa);
    navigate(`/metricas/${encodeURIComponent(empresa)}`);
  };

  const handlePlataformaSelect = (plataforma) => {
    setSelectedPlataforma(plataforma);
    setIsFacebookSelected(plataforma === 'Facebook');
    setShowHotmartForm(plataforma === 'Hotmart');
    setSelectedMetrics([]); // Reset metrics when switching platforms
    setDynamicComponent(null); // Clear previously loaded component
  };

  const handleMetricChange = async (e) => {
    const { value, checked } = e.target;
    setSelectedMetrics((prevMetrics) =>
      checked ? [...prevMetrics, value] : prevMetrics.filter((metric) => metric !== value)
    );

    if (checked) {
      const metric =
        hotmartMetrics.find((m) => m.component === value) || facebookMetrics.find((m) => m.component === value);
      if (metric) {
        try {
          const module = await import(`../components/${metric.component}`);
          setDynamicComponent(() => module.default);
        } catch (err) {
          console.error('Erro ao carregar o componente:', err);
        }
      }
    } else {
      setDynamicComponent(null);
    }
  };

  const handleGenerateDashboard = async () => {
    if (!selectedEmpresa || !selectedPlataforma) {
      setError('Selecione uma empresa e uma plataforma.');
      return;
    }

    if (selectedPlataforma !== 'Hotmart' && selectedMetrics.length === 0) {
      setError('Selecione pelo menos uma métrica.');
      return;
    }

    setError('');
    try {
      const payload = {
        email,
        empresa: selectedEmpresa,
        dados: selectedPlataforma === 'Hotmart' ? hotmartFilters : selectedMetrics,
      };

      const endpoint =
        selectedPlataforma === 'Hotmart'
          ? 'Sales-History'
          : `mkt-${selectedPlataforma.toLowerCase()}`;
      const response = await fetch(`${config.API_URL}/api/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar métricas.');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao gerar o dashboard:', err);
      setError('Erro ao gerar o dashboard. Tente novamente.');
    }
  };

  return (
    <div className="container">
      <h1>Análise de Métricas</h1>

      {error && <p>{error}</p>}

      <EmpresaSelect email={email} onSelectEmpresa={handleEmpresaSelect} />
      <PlataformaSelect onSelectPlataforma={handlePlataformaSelect} />

      {isFacebookSelected && <FacebookLoginButton selectedEmpresa={selectedEmpresa} />}
      {showHotmartForm ? <HotmartConfig selectedEmpresa={selectedEmpresa} showForm={showHotmartForm} /> : <p></p>}

      {selectedPlataforma === 'Hotmart' && (
        <div>
          <h3>Escolha a métrica do Hotmart:</h3>
          {hotmartMetrics.map(({ name, component }) => (
            <div key={component}>
              <input
                type="radio"
                id={component}
                name="hotmart-metric"
                value={component}
                checked={selectedMetrics.includes(component)}
                onChange={handleMetricChange}
              />
              <label htmlFor={component}>{name}</label>
            </div>
          ))}
        </div>
      )}

      {isFacebookSelected && (
        <div>
          <h3>Escolha a métrica do Facebook:</h3>
          {facebookMetrics.map(({ name, component }) => (
            <div key={component}>
              <input
                type="radio"
                id={component}
                name="facebook-metric"
                value={component}
                checked={selectedMetrics.includes(component)}
                onChange={handleMetricChange}
              />
              <label htmlFor={component}>{name}</label>
            </div>
          ))}
        </div>
      )}

      {dashboardData && (
        <div>
          <h2>Dashboard - {selectedEmpresa}</h2>
          <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
        </div>
      )}

      {isFacebookSelected && dynamicComponent && React.createElement(dynamicComponent, { selectedEmpresa, email })}
    </div>
  );
};

export default Metricas;
