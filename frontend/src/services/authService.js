import { useState, useEffect } from 'react';
import api from './api';

const API_URL = '/users/';

// Register user service
const register = async (userData) => {
  const response = await api.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user service
const login = async (userData) => {
  const response = await api.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user service
const logout = () => {
  localStorage.removeItem('user');
};

// Custom hook for managing authentication state
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const authLogin = (userData) => {
    setUser(userData);
  };
  
  const authLogout = () => {
    logout();
    setUser(null);
  };

  return { user, isLoading, login: authLogin, logout: authLogout };
};

export { register, login, logout, useAuth };