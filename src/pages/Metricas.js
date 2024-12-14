import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Select from 'react-select';
import { FaDownload } from 'react-icons/fa'; // Para ícones
import './Metricas.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Metricas = () => {
  const [empresaId, setEmpresaId] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [metricsData, setMetricsData] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState({ facebook: false, google: false, hotmart: false });
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [tokens, setTokens] = useState({ facebook: '', google: '', hotmart: '' });
  const [reportType, setReportType] = useState('simple'); // Tipo de relatório
  const [chartType, setChartType] = useState('bar'); // Tipo de gráfico

  useEffect(() => {
    const storedEmpresas = JSON.parse(localStorage.getItem('empresas')) || [];
    setEmpresas(storedEmpresas);
    const storedTokens = JSON.parse(localStorage.getItem('tokens')) || { facebook: '', google: '', hotmart: '' };
    setTokens(storedTokens);
  }, []);

  useEffect(() => {
    if (empresaId !== null) {
      const empresaEncontrada = empresas.find((empresa) => empresa.id === empresaId);
      if (empresaEncontrada) {
        setEmpresa(empresaEncontrada);
        setMetricsData([
          { name: 'Visitas', data: [500, 600, 700, 800], dates: ['01/01/2023', '02/01/2023', '03/01/2023', '04/01/2023'], platform: 'facebook' },
          { name: 'Conversões', data: [50, 60, 70, 80], dates: ['01/01/2023', '02/01/2023', '03/01/2023', '04/01/2023'], platform: 'google' },
          { name: 'Impressões', data: [3000, 4000, 5000, 6000], dates: ['01/01/2023', '02/01/2023', '03/01/2023', '04/01/2023'], platform: 'hotmart' },
          { name: 'Custo por Clique (CPC)', data: [1.5, 1.2, 1.8, 1.4], dates: ['01/01/2023', '02/01/2023', '03/01/2023', '04/01/2023'], platform: 'facebook' },
        ]);
        setError('');
      } else {
        setEmpresa(null);
        setMetricsData([]);
        setError('Empresa não encontrada!');
      }
    }
  }, [empresaId, empresas]);

  const handleEmpresaChange = (selectedOption) => {
    setEmpresaId(selectedOption ? selectedOption.value : null);
  };

  const handleMetricChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMetrics(prevMetrics =>
      checked ? [...prevMetrics, value] : prevMetrics.filter(metric => metric !== value)
    );
  };

  const handlePlatformChange = (e) => {
    const { name, checked } = e.target;
    setSelectedPlatforms(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dateFrom') {
      setDateFrom(value);
    } else if (name === 'dateTo') {
      setDateTo(value);
    }
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value); // Define o tipo de gráfico
  };

  const filterMetricsByDate = (metrics) => {
    if (!dateFrom || !dateTo) return metrics;
    return metrics.filter((metric) => {
      return metric.dates.some((date) => {
        const metricDate = new Date(date);
        return metricDate >= new Date(dateFrom) && metricDate <= new Date(dateTo);
      });
    });
  };

  const filterMetricsByPlatform = (metrics) => {
    if (!selectedPlatforms.facebook && !selectedPlatforms.google && !selectedPlatforms.hotmart) return [];
    return metrics.filter((metric) => selectedPlatforms[metric.platform]);
  };

  const generateChartData = () => {
    const filteredMetrics = filterMetricsByDate(metricsData);
    const platformFilteredMetrics = filterMetricsByPlatform(filteredMetrics);

    const data = {
      labels: platformFilteredMetrics[0]?.dates || [],
      datasets: selectedMetrics.map((metricName) => {
        const metric = platformFilteredMetrics.find((m) => m.name === metricName);
        return {
          label: metricName,
          data: metric?.data || [],
          fill: false,
          borderColor: platformColor[metric?.platform] || 'rgb(75, 192, 192)',
          backgroundColor: platformColor[metric?.platform] || 'rgb(75, 192, 192)',
          tension: 0.1,
        };
      }),
    };
    return data;
  };

  const renderChart = () => {
    const chartData = generateChartData();

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} />;
      case 'line':
        return <Line data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      case 'horizontalBar':
        return <Bar data={chartData} options={{ indexAxis: 'y' }} />;
      default:
        return <Bar data={chartData} />;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Relatório de Métricas - ${empresa?.nome}`, 20, 10);

    const colorIndexY = 30;
    doc.text('Índice de Cores:', 20, colorIndexY);
    let yOffset = colorIndexY + 10;
    Object.keys(platformColor).forEach((platform, index) => {
      doc.setFillColor(platformColor[platform]);
      doc.rect(20, yOffset, 10, 10, 'F'); // Color box
      doc.text(platform.charAt(0).toUpperCase() + platform.slice(1), 35, yOffset + 8);
      yOffset += 15;
    });

    const chartsContainer = document.getElementById('charts');
    html2canvas(chartsContainer).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, yOffset + 20, 180, 160); // Ajuste da posição Y
      doc.save(`${empresa?.nome}-metricas.pdf`);
    });
  };

  const platformColor = {
    facebook: 'rgb(59, 89, 152)', 
    google: 'rgb(219, 50, 54)',    
    hotmart: 'rgb(255, 138, 0)',   
  };

  return (
    <div className="container">
      <h1 className="header">Análise de Métricas</h1>

      <div className="select-container">
        <label htmlFor="empresaSelect" className="select-label">Escolha a Empresa:</label>
        <Select
          id="empresaSelect"
          options={empresas.map((empresa) => ({ value: empresa.id, label: empresa.nome }))}
          onChange={handleEmpresaChange}
          value={empresa ? { value: empresa.id, label: empresa.nome } : null}
        />
      </div>

      <div className="radio-container">
        <label className="radio-label">Escolha o tipo de relatório:</label>
        <div className="radio-item">
          <input
            type="radio"
            id="simpleReport"
            name="reportType"
            value="simple"
            checked={reportType === 'simple'}
            onChange={handleReportTypeChange}
          />
          <label htmlFor="simpleReport">Relatório Simples</label>
        </div>
        <div className="radio-item">
          <input
            type="radio"
            id="detailedReport"
            name="reportType"
            value="detailed"
            checked={reportType === 'detailed'}
            onChange={handleReportTypeChange}
          />
          <label htmlFor="detailedReport">Relatório Detalhado</label>
        </div>
      </div>

      <div className="chart-type-selector">
        <label className="chart-type-label">Escolha o Tipo de Gráfico:</label>
        <select className="chart-type-select" value={chartType} onChange={(e) => handleChartTypeChange(e)}>
          <option value="bar">Barras Verticais</option>
          <option value="horizontalBar">Barras Horizontais</option>
          <option value="pie">Pizza</option>
          <option value="line">Linha</option>
        </select>
      </div>

      {empresa && (
        <>
          <div className="checkbox-container">
            <label className="checkbox-label">Escolha as plataformas:</label>
            {['facebook', 'google', 'hotmart'].map((platform) => (
              <div key={platform} className="checkbox-item">
                <input
                  type="checkbox"
                  name={platform}
                  checked={selectedPlatforms[platform]}
                  onChange={handlePlatformChange}
                />
                <label htmlFor={platform} className="checkbox-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
              </div>
            ))}
          </div>

          <div className="metrics-container">
            <label className="metrics-label">Escolha as métricas:</label>
            {metricsData.map((metric) => (
              <div key={metric.name} className="checkbox-item">
                <input
                  type="checkbox"
                  id={metric.name}
                  value={metric.name}
                  checked={selectedMetrics.includes(metric.name)}
                  onChange={handleMetricChange}
                />
                <label htmlFor={metric.name} className="checkbox-label">{metric.name}</label>
              </div>
            ))}
          </div>

          <div id="charts" className="chart-container">
            {selectedMetrics.map((metricName) => (
              <div key={metricName} className="chart-wrapper">
                <h3>{metricName} - {empresa.nome}</h3>
                {renderChart()}
              </div>
            ))}
          </div>

          <div className="color-legend">
            <h4>Índice de Cores</h4>
            {Object.keys(platformColor).map((platform) => (
              <div key={platform} className="color-item">
                <div className="color-box" style={{ backgroundColor: platformColor[platform] }}></div>
                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </div>
            ))}
          </div>

          <button onClick={generatePDF} className="generate-pdf-btn">
            <FaDownload /> Gerar PDF
          </button>
        </>
      )}
    </div>
  );
};

export default Metricas;
