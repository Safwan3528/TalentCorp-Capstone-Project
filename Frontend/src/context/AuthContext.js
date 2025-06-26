import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setUser({ 
        token: storedToken, 
        ...JSON.parse(storedUser) 
      });
    } else if (storedToken) {
      // Fallback for existing tokens without user data
      setUser({ token: storedToken });
    }
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem('token', token);
    
    const userInfo = { token };
    if (userData) {
      userInfo.username = userData.username;
      userInfo.email = userData.email;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
