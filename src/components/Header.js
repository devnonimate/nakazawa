import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  // Salva a última página acessada no LocalStorage
  React.useEffect(() => {
    localStorage.setItem('lastVisited', location.pathname);
  }, [location]);

  return (
    <header style={headerStyle}>
      {/* Logo agora é um Link para a página Home */}
      <div style={logoStyle}>
        <Link to="/home" style={linkStyle}>NAKAZAWA</Link>
      </div>
      <nav>
        <ul style={navListStyle}>
          <li style={navItemStyle}>
            <Link to="/home" style={linkStyle}>Home</Link>
          </li>
          <li style={navItemStyle}>
            <Link to="/metricas" style={linkStyle}>Métricas</Link>
          </li>
          <li style={navItemStyle}>
            <Link to="/cadastro-clientes" style={linkStyle}>Cadastro de Clientes</Link>
          </li>
          <li style={navItemStyle}>
            <Link to="/configuracoes" style={linkStyle}>Configurações</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundImage: 'linear-gradient(to right, #364953, #469ff8)', // Degradê do escuro para o azul
  color: 'white',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
};

const navListStyle = {
  listStyleType: 'none',
  display: 'flex',
  gap: '20px',
};

const navItemStyle = {
  margin: '0',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
};

export default Header;
