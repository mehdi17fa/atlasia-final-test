import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const verifySession = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('accessToken');

      if (storedUser && storedToken) {
        try {
          // Validate token with the backend
          const response = await axios.get(`${API_BASE}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          // If token is valid, set user
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (err) {
          console.error('Token validation failed:', err);
          // Clear invalid session
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
          setToken(null);
        }
      } else {
        // No user or token in localStorage
        setUser(null);
        setToken(null);
      }
      setIsLoading(false); // Done verifying
    };

    verifySession();
  }, []);

  const login = (userData, jwtToken) => {
    console.log("🔄 AuthContext login called with:", { userData, token: jwtToken ? "EXISTS" : "MISSING" });
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', jwtToken);
    console.log("✅ Tokens stored in localStorage");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};