import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/inventario`;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getInventario = () => {
  return axios.get(API_URL, getAuthHeader());
};

export const agregarStock = (id, cantidad) => {
  return axios.put(`${API_URL}/${id}/agregar-stock`, { cantidad }, getAuthHeader());
};

export const ajustarStock = (id, data) => {
  return axios.put(`${API_URL}/${id}/ajustar-stock`, data, getAuthHeader());
};

export const getStockBajoInventario = () => {
  return axios.get(`${API_URL}/stock-bajo`, getAuthHeader());
};