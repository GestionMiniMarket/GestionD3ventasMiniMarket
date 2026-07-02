import axios from "axios";

// Leemos la URL de la nube desde el .env
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const register = (data) => {
  return axios.post(`${API_URL}/registro`, data);
};