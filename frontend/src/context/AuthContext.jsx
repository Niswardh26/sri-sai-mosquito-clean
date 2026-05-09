import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const navigate = useNavigate();

  const loginUser = (authResponse) => {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse));
    setUser(authResponse);
    // Redirect based on role
    if (isAdmin()) {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isAdmin = () => {
    if (!user) return false;
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      return payload.role === 'ADMIN';
    } catch { return false; }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
