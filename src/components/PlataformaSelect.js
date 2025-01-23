// PlataformaSelect.js
import React from 'react';

const PlataformaSelect = ({ onSelectPlataforma }) => {
  const handlePlataformaChange = (plataforma) => {
    onSelectPlataforma(plataforma);
  };

  return (
    <div className="platform-select-container">
      <h3>Escolha a Plataforma:</h3>
      <button onClick={() => handlePlataformaChange('Facebook')}>Facebook</button>
      <button onClick={() => handlePlataformaChange('Hotmart')}>Hotmart</button>
    </div>
  );
};

export default PlataformaSelect;
