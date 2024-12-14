import React, { useState } from 'react';
import './MenuMetrics.css';
import FacebookAds from './FacebookAds'; // Componente para Facebook Ads
import GoogleAds from './GoogleAds'; // Componente para Google Ads
import Hotmart from './Hotmart'; // Componente para Hotmart

const MenuMetrics = ({ cliente, empresaSelecionada, setEmpresaSelecionada }) => {
  const [currentComponent, setCurrentComponent] = useState(null); // Componente inicial vazio

  const handleMenuUserClick = (empresa) => {
    // Altera o nome da empresa e exibe o componente correspondente
    setEmpresaSelecionada(empresa);

    if (empresa === 'Facebook') {
      setCurrentComponent(<FacebookAds cliente={cliente} />);
    } else if (empresa === 'Google') {
      setCurrentComponent(<GoogleAds cliente={cliente} />);
    } else if (empresa === 'Hotmart') {
      setCurrentComponent(<Hotmart cliente={cliente} />);
    }
  };

  return (
    <div>
      {/* MenuMetrics */}
      {empresaSelecionada && (
        <div className="metrics-container">
          <div className="metrics-box">
            <div className="metrics-header">
              <h2>{empresaSelecionada}</h2> {/* Título baseado na empresa */}
            </div>
            <div className="metrics-buttons">
              <button
                className="metrics-button"
                onClick={() => handleMenuUserClick('Facebook')}
              >
                Facebook
              </button>
              <button
                className="metrics-button"
                onClick={() => handleMenuUserClick('Google')}
              >
                Google
              </button>
              <button
                className="metrics-button"
                onClick={() => handleMenuUserClick('Hotmart')}
              >
                Hotmart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exibe o componente correspondente após o clique */}
      {currentComponent}
    </div>
  );
};

export default MenuMetrics;
