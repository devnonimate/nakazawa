import React, { useState, lazy, Suspense } from 'react';
import './HotmartMetricsButton.css';

const metricComponents = {
  'Histórico de Vendas': 'SalesHistoryConfig',
  'Resumo de Vendas': 'SalesSummaryConfig',
  'Vendas do Usuário': 'SalesUsersConfig',
  'Comissões de Vendas': 'SalesComissionsConfig',
  'Repartição do preço de venda': 'SalesPriceDetailsConfig',
  'Inscrições': 'SubscriptionsConfig',
  'Resumo das Assinaturas': 'SubscriptionSummaryConfig',
  'Assinaturas': 'SubscriberConfig',
};

const HotmartMetricsButton = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [Component, setComponent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelectMetric = (metric) => {
    setSelectedMetric(metric);
    setMenuOpen(false);
    
    const componentName = metricComponents[metric];
    if (componentName) {
      const LazyComponent = lazy(() => import(`../components/${componentName}.js`));
      setComponent(() => LazyComponent);
    }
  };

  return (
    <div className="hotmart-container">
      <button className="hotmart-btn" onClick={() => setMenuOpen(!menuOpen)}>
        Hotmart
      </button>
      {menuOpen && (
        <ul className="hotmart-menu">
          {Object.keys(metricComponents).map((metric) => (
            <li key={metric} onClick={() => handleSelectMetric(metric)}>
              {metric}
            </li>
          ))}
        </ul>
      )}
      <div className="metric-component-container">
        {selectedMetric && Component && (
          <Suspense fallback={<p>Carregando...</p>}>
            <Component />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default HotmartMetricsButton;
