import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config';

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

  const navigate = useNavigate();

  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit) {
      setIsFirstAccess(true);
      localStorage.setItem('firstVisit', 'false');
    }

    // Simulando uma chamada ao backend para buscar empresas
    const fetchEmpresas = async () => {
      try {
        const response = await fetch(`${config.API_URL}/list-empresas`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: localStorage.getItem('username') }),
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar empresas.');
        }

        const data = await response.json();
        // Assegura que a resposta tenha o formato correto
        setEmpresas(data.empresas || []);
      } catch (err) {
        console.error('Erro ao buscar empresas:', err);
      }
    };

    fetchEmpresas();

    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % tutorialTexts.length);
    }, 5000);

    return () => clearInterval(textInterval);
  }, [tutorialTexts.length]);

  const handleButtonClick = (empresaNome) => {
    // Corrige a navegação para incluir o nome da empresa na URL
    navigate(`/metricas/${encodeURIComponent(empresaNome)}`);
  };

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
        </div>
      ) : (
        <div style={shortcutsContainerStyle}>
          <h2 style={shortcutsHeadingStyle}>Atalhos para Métricas de Empresas</h2>
          <div style={shortcutsStyle}>
            {empresas.length > 0 ? (
              empresas.map((empresa, index) => (
                <button
                  key={index}
                  style={shortcutButtonStyle}
                  onClick={() => handleButtonClick(empresa)} // Passa o nome diretamente
                >
                  {empresa}
                </button>
              ))
            ) : (
              <p style={noEmpresasText}>Nenhuma empresa cadastrada.</p>
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
};

const carouselTextStyle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: '500',
  fontStyle: 'italic',
  textAlign: 'center',
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

const shortcutButtonStyle = {
  padding: '15px 30px',
  backgroundColor: '#4CAF50',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '15px',
  fontSize: '16px',
  fontWeight: '500',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s, transform 0.2s ease',
  border: 'none',
  cursor: 'pointer',
  margin: '5px',
};

const noEmpresasText = {
  fontSize: '18px',
  color: '#888',
  marginTop: '20px',
};

export default Home;
