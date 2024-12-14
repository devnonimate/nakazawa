import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GerenciarEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate(); // Hook para navegação

  // Carregar empresas do localStorage quando o componente for montado
  useEffect(() => {
    const empresasStored = JSON.parse(localStorage.getItem('empresas')) || [];
    setEmpresas(empresasStored);
  }, []);

  const handleEdit = (empresaId) => {
    // Redireciona para a página de edição da empresa, passando o id pela URL
    navigate(`/editar-empresa/${empresaId}`);
  };

  const handleDelete = (empresaId) => {
    const empresasStored = JSON.parse(localStorage.getItem('empresas')) || [];
    const updatedEmpresas = empresasStored.filter((empresa) => empresa.id !== empresaId);
    localStorage.setItem('empresas', JSON.stringify(updatedEmpresas));
    setEmpresas(updatedEmpresas); // Atualiza o estado para refletir a mudança
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Gerenciamento de Empresas</h2>
      <p style={descriptionStyle}>Aqui você pode editar ou excluir empresas cadastradas.</p>

      {empresas.length === 0 ? (
        <p style={noCompaniesStyle}>Nenhuma empresa cadastrada.</p>
      ) : (
        <div style={companiesListStyle}>
          <ul>
            {empresas.map((empresa) => (
              <li key={empresa.id} style={companyItemStyle}>
                {empresa.nome}
                <button onClick={() => handleEdit(empresa.id)} style={editButtonStyle}>Editar</button>
                <button onClick={() => handleDelete(empresa.id)} style={deleteButtonStyle}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => navigate('/cadastro-clientes')} style={addButtonStyle}>Adicionar Empresa</button>
    </div>
  );
};

// Estilos para a página de gerenciamento
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 20px',
  maxWidth: '800px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
};

const headerStyle = {
  fontSize: '28px',
  color: '#333',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const descriptionStyle = {
  color: '#555',
  fontSize: '16px',
  marginBottom: '30px',
  textAlign: 'center',
};

const noCompaniesStyle = {
  fontSize: '18px',
  color: '#ff0000',
};

const companiesListStyle = {
  width: '100%',
  textAlign: 'center',
};

const companyItemStyle = {
  fontSize: '18px',
  color: '#333',
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const editButtonStyle = {
  padding: '8px 12px',
  fontSize: '14px',
  backgroundColor: '#FFC107',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '10px',
};

const deleteButtonStyle = {
  padding: '8px 12px',
  fontSize: '14px',
  backgroundColor: '#FF5722',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '10px',
};

const addButtonStyle = {
  marginTop: '30px',
  padding: '12px 20px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default GerenciarEmpresas;
