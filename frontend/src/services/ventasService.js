import axios from "axios";

const API_URL = "http://localhost:3000/api/ventas";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const registrarVenta = (data) => {
  return axios.post(API_URL, data, getAuthHeader());
};

export const listarVentas = (fecha = "") => {
  const query = fecha ? `?fecha=${fecha}` : "";
  return axios.get(`${API_URL}${query}`, getAuthHeader());
};

export const getDetalleVenta = (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};