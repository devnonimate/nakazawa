// EmpresaSelect.js
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import config from '../pages/config';

const EmpresaSelect = ({ email, onSelectEmpresa }) => {
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await fetch(`${config.API_URL}/list-empresas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar empresas.');
        }

        const data = await response.json();
        setEmpresas(
          data.empresas.map((empresaNome) => ({
            value: empresaNome,
            label: empresaNome,
          }))
        );
      } catch (err) {
        console.error('Erro ao buscar empresas:', err);
        setError('Não foi possível carregar a lista de empresas.');
      }
    };

    fetchEmpresas();
  }, [email]);

  const handleEmpresaChange = (selectedOption) => {
    if (selectedOption) {
      onSelectEmpresa(selectedOption.value);
    }
  };

  return (
    <div className="select-container">
      {error && <p className="error">{error}</p>}
      <label htmlFor="empresaSelect" className="select-label">Escolha a Empresa:</label>
      <Select
        id="empresaSelect"
        options={empresas}
        onChange={handleEmpresaChange}
        defaultValue={null}
      />
    </div>
  );
};

export default EmpresaSelect;
