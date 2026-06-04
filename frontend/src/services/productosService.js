import axios from "axios";

const API_URL = "http://localhost:3000/api/productos";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProductos = () => {
  return axios.get(API_URL, getAuthHeader());
};

export const createProducto = (data) => {
  return axios.post(API_URL, data, getAuthHeader());
};

export const updateProducto = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
};

export const desactivarProducto = (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};

export const restaurarProducto = (id) => {
  return axios.put(`${API_URL}/${id}/restaurar`, {}, getAuthHeader());
};