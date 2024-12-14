import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const tutorialTexts = [
    'Bem-vindo à plataforma! Aqui você pode monitorar métricas importantes de suas empresas.',
    'Acesse as métricas em tempo real e obtenha insights valiosos para a sua empresa.',
    'Cadastre seus clientes, organize suas informações e mantenha tudo centralizado.',
    'Configurações avançadas para personalizar a plataforma de acordo com as suas necessidades.',
    'Navegue facilmente entre as seções e aproveite as ferramentas para otimizar sua gestão.'
  ];

  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit) {
      setIsFirstAccess(true);
      localStorage.setItem('firstVisit', 'false');
    }

    const empresasCadastradas = JSON.parse(localStorage.getItem('empresas')) || [];
    setEmpresas(empresasCadastradas);

    // Troca de textos no carrossel a cada 5 segundos
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % tutorialTexts.length);
    }, 5000); // Troca de texto a cada 5 segundos

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div style={homeContainerStyle}>
      {/* Carrossel de Textos */}
      <div style={carouselContainerStyle}>
        <p style={carouselTextStyle}>{tutorialTexts[currentTextIndex]}</p>
      </div>

      {isFirstAccess ? (
        <div style={introContainerStyle}>
          <h1 style={headingStyle}>Bem-vindo à nossa plataforma!</h1>
          <p style={descriptionStyle}>Explore nossas ferramentas incríveis e comece a otimizar sua gestão agora.</p>
          <Link to="/metricas">
            <button style={plusButtonStyle}>+</button>
          </Link>
        </div>
      ) : (
        <div style={shortcutsContainerStyle}>
          <h2 style={shortcutsHeadingStyle}>Atalhos para Métricas de Empresas</h2>
          <div style={shortcutsStyle}>
            {empresas.length > 0 ? (
              empresas.map((empresa, index) => (
                <Link key={index} to={`/metricas?empresa=${empresa.id}`} style={shortcutStyle}>
                  {empresa.nome}
                </Link>
              ))
            ) : (
              <div style={noEmpresasContainer}>
                <p style={noEmpresasText}>Nenhuma empresa cadastrada.</p>
                <Link to="/cadastro-clientes">
                  <button style={plusButtonStyle}>+</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos para a página
const homeContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  backgroundColor: '#f4f6f9',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: '20px',
};

const carouselContainerStyle = {
  width: '100%',
  maxWidth: '900px',
  backgroundColor: '#ffffff',
  padding: '30px 40px',
  borderRadius: '20px',
  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
  textAlign: 'center',
  position: 'relative',
  top: '0',
  zIndex: 1,
  transform: 'translateY(-40px)',
};

const carouselTextStyle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: '500',
  fontStyle: 'italic',
  textAlign: 'center',
  transition: 'transform 0.3s ease',
};

const introContainerStyle = {
  textAlign: 'center',
  backgroundColor: '#ffffff',
  padding: '40px 50px',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  width: '100%',
};

const headingStyle = {
  color: '#333',
  fontSize: '28px',
  fontWeight: '600',
};

const descriptionStyle = {
  color: '#666',
  fontSize: '16px',
  marginTop: '20px',
  marginBottom: '30px',
};

const plusButtonStyle = {
  marginTop: '20px',
  fontSize: '36px',
  padding: '20px',
  borderRadius: '50%',
  width: '80px',
  height: '80px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  fontWeight: 'bold',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
};

const shortcutsContainerStyle = {
  textAlign: 'center',
  backgroundColor: '#ffffff',
  padding: '30px 40px',
  borderRadius: '20px',
  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '700px',
  marginTop: '30px',
};

const shortcutsHeadingStyle = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  marginBottom: '20px',
};

const shortcutsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  flexWrap: 'wrap',
};

const shortcutStyle = {
  padding: '12px 24px',
  backgroundColor: '#4CAF50',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '25px',
  fontSize: '16px',
  fontWeight: '500',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s, transform 0.2s ease',
  cursor: 'pointer',
  display: 'inline-block',
  margin: '5px',
};

const noEmpresasContainer = {
  textAlign: 'center',
  backgroundColor: '#ffffff',
  padding: '40px 50px',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  width: '100%',
};

const noEmpresasText = {
  fontSize: '18px',
  color: '#888',
  marginBottom: '20px',
};

export default Home;
