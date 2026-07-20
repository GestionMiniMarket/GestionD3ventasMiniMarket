import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/categorias`;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCategorias = () => {
  return axios.get(API_URL, getAuthHeader());
};

export const createCategoria = (data) => {
  return axios.post(API_URL, data, getAuthHeader());
};

export const updateCategoria = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
};

export const deleteCategoria = (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};