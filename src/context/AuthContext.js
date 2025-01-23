import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); // Pega o email na posição "username"
    const token = localStorage.getItem('authToken');

    if (storedUsername && token) {
      setUser({ username: storedUsername });
    }
  }, []);

  const login = (username, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username); // Mantemos a chave "username" para compatibilidade
    setUser({ username });
    navigate('/home');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
