import React, { useState } from "react";

const SalesHistoryConfig = ({ selectedEmpresa, email }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [response, setResponse] = useState(null); // Estado para armazenar a resposta do backend
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [error, setError] = useState(null); // Estado para tratar erros

  const parameters = {
    General: [
      { key: "max_results", label: "Máximo de itens por página", example: "max_results=50" },
      { key: "page_token", label: "Token de paginação", example: "page_token=eyJ..." },
    ],
    Filters: [
      { key: "product_id", label: "ID do Produto", example: "product_id=1234567" },
      { key: "start_date", label: "Data de Início", example: "start_date=1617753600000" },
      { key: "end_date", label: "Data de Término", example: "end_date=1618411200000" },
      { key: "sales_source", label: "Código SRC", example: "sales_source=campaignname" },
    ],
    Buyer: [
      { key: "buyer_name", label: "Nome do Comprador", example: "buyer_name=João Silva" },
      { key: "buyer_email", label: "Email do Comprador", example: "buyer_email=joao.silva@example.com" },
    ],
    Transaction: [
      { key: "transaction", label: "Código de Transação", example: "transaction=HP17715690036014" },
      { key: "transaction_status", label: "Status da Transação", example: "transaction_status=APPROVED" },
      { key: "payment_type", label: "Tipo de Pagamento", example: "payment_type=PIX" },
    ],
    Additional: [
      { key: "offer_code", label: "Código da Oferta", example: "offer_code=OFFER2023" },
      { key: "commission_as", label: "Comissão Como", example: "commission_as=AFFILIATE" },
    ],
  };

  const handleChange = (category, key, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setError(null);

    const payload = {
      empresa: selectedEmpresa,
      email,
      filtros: selectedOptions,
    };

    fetch("/api/sales-history", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
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
                onChange={(e) => handleChange(category, key, e.target.value)}
                style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
              />
            </div>
          ))}
        </div>
      ))}
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

      {/* Exibição da resposta */}
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Resposta do Servidor</h3>
          <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {/* Exibição de erro */}
      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <strong>Erro:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default SalesHistoryConfig;
