import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const register = (data) => {
  return axios.post(`${API_URL}/registro`, data);
};