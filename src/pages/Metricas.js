import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaDownload, FaSync } from 'react-icons/fa';
import './Metricas.css';

const Metricas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  const email = localStorage.getItem('username'); // Obtém o email do usuário

  useEffect(() => {
    // Faz a chamada para o backend para listar as empresas
    const fetchEmpresas = async () => {
      try {
        const response = await fetch('https://db8a-2804-71d4-6005-50-ce1-e935-e7f5-e9cc.ngrok-free.app/list-empresas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
  
        if (!response.ok) {
          throw new Error('Erro ao buscar empresas.');
        }
  
        const data = await response.json();
        
        // Supondo que 'data.empresas' seja um array de nomes das empresas, como ['Empresa A', 'Empresa B']
        setEmpresas(data.empresas.map((empresaNome) => ({
          value: empresaNome,  // Aqui, o valor será o nome da empresa
          label: empresaNome   // O rótulo também será o nome da empresa
        })));
      } catch (err) {
        console.error('Erro ao buscar empresas:', err);
        setError('Não foi possível carregar a lista de empresas.');
      }
    };
  
    fetchEmpresas();
  }, [email]);
  

  const handleEmpresaChange = (selectedOption) => {
    setSelectedEmpresa(selectedOption ? selectedOption.value : null);
  };

  const handleMetricChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMetrics((prevMetrics) =>
      checked ? [...prevMetrics, value] : prevMetrics.filter((metric) => metric !== value)
    );
  };

  const handleGenerateDashboard = async () => {
    if (!selectedEmpresa || selectedMetrics.length === 0) {
      setError('Selecione uma empresa e pelo menos uma métrica.');
      return;
    }

    setError('');
    try {
      // Faz a chamada ao backend para buscar os dados das métricas
      const response = await fetch('https://db8a-2804-71d4-6005-50-ce1-e935-e7f5-e9cc.ngrok-free.app/api/mkt-facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email, // E-mail do usuário do localStorage
          empresa: empresas.find(e => e.value === selectedEmpresa)?.label, // Nome da empresa selecionada
          dados: selectedMetrics, // Métricas selecionadas
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar métricas.');
      }

      const data = await response.json();
      setDashboardData(data); // Atualiza os dados do dashboard
    } catch (err) {
      console.error('Erro ao buscar métricas:', err);
      setError('Erro ao gerar o dashboard. Tente novamente.');
    }
  };

  const handleRefresh = async () => {
    setError('');
    try {
      const response = await fetch('https://db8a-2804-71d4-6005-50-ce1-e935-e7f5-e9cc.ngrok-free.app/list-empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar empresas.');
      }

      const data = await response.json();
      if (data.empresas && Array.isArray(data.empresas)) {
        setEmpresas(data.empresas.map(empresa => ({ value: empresa.id, label: empresa.nome }))); // Atualiza a lista de empresas com o formato correto
      } else {
        throw new Error('Dados de empresas inválidos.');
      }
    } catch (err) {
      console.error('Erro ao buscar empresas:', err);
      setError('Não foi possível atualizar a lista de empresas.');
    }
  };

  return (
    <div className="container">
      <h1 className="header">Facebook Ads - Análise de Métricas</h1>

      {error && <p className="error">{error}</p>}

      {/* Seleção de Empresa */}
      <div className="select-container">
        <label htmlFor="empresaSelect" className="select-label">Escolha a Empresa:</label>
        <Select
          id="empresaSelect"
          options={empresas}
          onChange={handleEmpresaChange}
          value={selectedEmpresa ? { value: selectedEmpresa, label: empresas.find(e => e.value === selectedEmpresa)?.label } : null}
        />
      </div>

      {/* Botão de Refresh */}
      <button onClick={handleRefresh} className="refresh-btn">
        <FaSync /> Atualizar Empresas
      </button>

      {/* Seleção de Métricas */}
      <div className="metrics-container">
        <h3>Escolha as Métricas:</h3>
        {['Impressões', 'Cliques', 'CPC', 'Conversões', 'CPA', 'ROAS'].map((metric) => (
          <div key={metric} className="checkbox-item">
            <input
              type="checkbox"
              id={metric}
              value={metric}
              checked={selectedMetrics.includes(metric)}
              onChange={handleMetricChange}
            />
            <label htmlFor={metric}>{metric}</label>
          </div>
        ))}
      </div>

      {/* Botão para Gerar Dashboard */}
      <button onClick={handleGenerateDashboard} className="generate-dashboard-btn">
        Gerar Dashboard
      </button>

      {/* Espaço para exibir o Dashboard */}
      <div id="dashboard" className="dashboard-container">
        {dashboardData ? (
          <div>
            <h2>Dashboard - {empresas.find(e => e.value === selectedEmpresa)?.label}</h2>
            {/* Exiba os dados do dashboard aqui (gráficos, tabelas, etc.) */}
            <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
          </div>
        ) : (
          <p>O Dashboard será exibido aqui.</p>
        )}
      </div>
    </div>
  );
};

export default Metricas;
