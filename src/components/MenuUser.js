import React, { useState, useEffect } from "react";
import MenuMetrics from "./MenuMetrics"; // Importe o MenuMetrics.js
import "./MenuUser.css";

const MenuUser = () => {
  const [clientes, setClientes] = useState(JSON.parse(localStorage.getItem("clientes")) || []);
  const [showPopup, setShowPopup] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [showEditForm, setShowEditForm] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null); // Para armazenar o cliente selecionado
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null); // Estado para controlar a empresa selecionada

  // Carregar os dados do cliente ao editar
  useEffect(() => {
    if (showEditForm !== null) {
      const cliente = clientes[showEditForm];
      setNomeEmpresa(cliente.nomeEmpresa);
      setNomeCliente(cliente.nomeCliente);
    }
  }, [showEditForm, clientes]);

  const handleAddClient = () => {
    setShowPopup(true);
  };

  const handleSaveClient = () => {
    const newCliente = { nomeEmpresa, nomeCliente };
    const updatedClientes = [...clientes, newCliente];
    setClientes(updatedClientes);
    localStorage.setItem("clientes", JSON.stringify(updatedClientes));
    setShowPopup(false);
    setNomeEmpresa("");
    setNomeCliente("");
  };

  const handleCancel = () => {
    setShowPopup(false);
    setNomeEmpresa("");
    setNomeCliente("");
  };

  const handleEditClient = (index) => {
    setShowEditForm(index);
  };

  const handleSaveEditedClient = (index) => {
    const updatedClientes = [...clientes];
    updatedClientes[index] = { nomeEmpresa, nomeCliente };
    setClientes(updatedClientes);
    localStorage.setItem("clientes", JSON.stringify(updatedClientes));
    setShowEditForm(null); // Fecha o formulário de edição
    setNomeEmpresa("");
    setNomeCliente("");
  };

  const handleToggleArrow = (index) => {
    if (showEditForm === index) {
      setShowEditForm(null); // Fecha a caixa deslizante
    } else {
      setShowEditForm(index); // Abre a caixa deslizante
    }
  };

  const handleSelectClient = (cliente) => {
    setSelectedCliente(cliente); // Salva o cliente selecionado para chamar o MenuMetrics
    setEmpresaSelecionada(null); // Resetar empresaSelecionada ao selecionar um cliente
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <span>Clientes</span>
      </div>
      <div className="clientes-list">
        {clientes.map((cliente, index) => (
          <div key={index} className="client-item">
            <div className="client-button-container">
              {/* Botão que combina nome e flecha */}
              <button
                className="client-button"
                onClick={() => handleSelectClient(cliente)} // Chama MenuMetrics.js ao clicar no nome
              >
                <span className="client-name">{cliente.nomeCliente}</span>

                {/* Botão da flecha */}
                <span
                  className={`arrow ${showEditForm === index ? "up" : "down"}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique na flecha acione a seleção do cliente
                    handleToggleArrow(index);
                  }}
                >
                  &#9660; {/* ícone de flecha para baixo (V) */}
                </span>
              </button>
            </div>

            <div
              className={`edit-form ${showEditForm === index ? "open" : ""}`}
            >
              <input
                type="text"
                placeholder="Nome da Empresa"
                value={showEditForm === index ? nomeEmpresa : ""}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                className="popup-input"
              />
              <input
                type="text"
                placeholder="Nome do Cliente"
                value={showEditForm === index ? nomeCliente : ""}
                onChange={(e) => setNomeCliente(e.target.value)}
                className="popup-input"
              />
              <div className="popup-buttons">
                <button
                  className="save-button"
                  onClick={() => handleSaveEditedClient(index)}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="add-client">
        <button className="add-button" onClick={handleAddClient}>
          <span className="plus-icon">+</span>
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <input
              type="text"
              placeholder="Nome da Empresa"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              className="popup-input"
            />
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              className="popup-input"
            />
            <div className="popup-buttons">
              <button className="save-button" onClick={handleSaveClient}>
                Salvar
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exibindo MenuMetrics com empresa selecionada */}
      {selectedCliente && empresaSelecionada && (
        <MenuMetrics
          cliente={selectedCliente}
          empresaSelecionada={empresaSelecionada}
          setEmpresaSelecionada={setEmpresaSelecionada}
        />
      )}
    </div>
  );
};

export default MenuUser;
