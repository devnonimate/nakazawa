import React, { useState } from "react";
import config from '../pages/config.js'; // Caminho correto para o arquivo de configuração

const SalesPriceDetailsConfig = ({ selectedEmpresa }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parâmetros do endpoint
  const parameters = {
    General: [
      { key: "max_results", label: "Máximo de itens por página", example: "50" },
      { key: "page_token", label: "Token de paginação", example: "eyJ..." },
    ],
    Filters: [
      { key: "product_id", label: "ID do Produto", example: "1234567" },
      { key: "sales_source", label: "Código SRC", example: "campaignname" },
    ],
    Buyer: [
      { key: "buyer_name", label: "Nome do Comprador", example: "João Silva" },
      { key: "buyer_email", label: "Email do Comprador", example: "joao.silva@example.com" },
    ],
    Transaction: [
      { key: "transaction", label: "Código de Transação", example: "HP17715690036014" },
      { key: "transaction_status", label: "Status da Transação", example: "APPROVED" },
      { key: "payment_type", label: "Tipo de Pagamento", example: "PIX" },
    ],
    Additional: [
      { key: "offer_code", label: "Código da Oferta", example: "OFFER2023" },
      { key: "commission_as", label: "Comissão Como", example: "AFFILIATE" },
    ],
  };

  const handleChange = (key, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setError(null);

    const email = localStorage.getItem("username"); // Obtendo o email do LocalStorage

    // Garantir que max_results seja um número inteiro
    if (selectedOptions.max_results) {
      selectedOptions.max_results = parseInt(selectedOptions.max_results, 10);
    }

    // Converter datas para milissegundos (se existirem)
    let args = { ...selectedOptions };

    if (args.start_date) {
      args.start_date = convertToTimestamp(args.start_date, args.start_time);
      delete args.start_time; // Remover a hora extra da URL
    }

    if (args.end_date) {
      args.end_date = convertToTimestamp(args.end_date, args.end_time);
      delete args.end_time; // Remover a hora extra da URL
    }

    // Construção da URL
    const params = new URLSearchParams({
      email,
      empresa: selectedEmpresa,
      ...args,
    });

    const url = `${config.API_URL}/api/sales-price-details?${params.toString()}`;

    console.log("URL da requisição:", url);

    fetch(url, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setResponse(data);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Função para converter datas e horas em milissegundos
  const convertToTimestamp = (date, time) => {
    if (!date) return null; // Retorna null se não houver data

    let dateTimeString = time ? `${date}T${time}:00Z` : `${date}T00:00:00Z`;
    let inputDate = new Date(dateTimeString);
    let now = new Date();

    return now.getTime() - inputDate.getTime();
  };

  return (
    <div>
      <h2>Configuração do Histórico de Vendas</h2>
      {Object.entries(parameters).map(([category, params]) => (
        <div key={category} style={{ marginBottom: "20px" }}>
          <h3>{category}</h3>
          {params.map(({ key, label, example }) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <label htmlFor={key}>
                <strong>{label}:</strong>
              </label>
              <input
                id={key}
                type="text"
                placeholder={example}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
              />
            </div>
          ))}
        </div>
      ))}
      
      {/* Seletor de Data e Hora */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Filtros de Data</h3>
        <label><strong>Data de Início:</strong></label>
        <input type="date" onChange={(e) => handleChange("start_date", e.target.value)} />
        <input type="time" onChange={(e) => handleChange("start_time", e.target.value)} placeholder="HH:MM" />
        
        <label><strong>Data de Término:</strong></label>
        <input type="date" onChange={(e) => handleChange("end_date", e.target.value)} />
        <input type="time" onChange={(e) => handleChange("end_time", e.target.value)} placeholder="HH:MM" />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Carregando..." : "Aplicar Filtros"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>URL da Requisição</h3>
        <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
          {`${config.API_URL}/api/history-sales?${new URLSearchParams({
            email: localStorage.getItem("username"),
            empresa: selectedEmpresa,
            ...selectedOptions,
          }).toString()}`}
        </pre>
      </div>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Resposta do Servidor</h3>
          <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <strong>Erro:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default SalesPriceDetailsConfig;
