import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/reportes`;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDashboardReporte = () => {
  return axios.get(`${API_URL}/dashboard`, getAuthHeader());
};

export const getVentasDiarias = (fecha = "") => {
  const query = fecha ? `?fecha=${fecha}` : "";
  return axios.get(`${API_URL}/ventas/diarias${query}`, getAuthHeader());
};

export const getVentasSemanales = () => {
  return axios.get(`${API_URL}/ventas/semanales`, getAuthHeader());
};

export const getVentasMensuales = (mes, anio) => {
  return axios.get(`${API_URL}/ventas/mensuales?mes=${mes}&anio=${anio}`, getAuthHeader());
};

export const getProductosMasVendidos = () => {
  return axios.get(`${API_URL}/productos/mas-vendidos`, getAuthHeader());
};

export const getProductosBajaRotacion = () => {
  return axios.get(`${API_URL}/productos/baja-rotacion`, getAuthHeader());
};

export const getEgresosPorCaja = (id) => {
  return axios.get(`${API_URL}/cajas/${id}/egresos`, getAuthHeader());
};