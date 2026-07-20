import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/cajas`;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const abrirCaja = (monto_inicial) => {
  return axios.post(API_URL + "/abrir", { monto_inicial }, getAuthHeader());
};

export const getResumenCaja = () => {
  return axios.get(API_URL + "/resumen", getAuthHeader());
};

export const registrarEgreso = (data) => {
  return axios.post(API_URL + "/egreso", data, getAuthHeader());
};

export const solicitarCierre = (efectivo_contado) => {
  return axios.put(API_URL + "/solicitar-cierre", { efectivo_contado }, getAuthHeader());
};

export const listarCajas = () => {
  return axios.get(API_URL, getAuthHeader());
};

export const confirmarCierre = (id, observaciones) => {
  return axios.put(`${API_URL}/${id}/confirmar-cierre`, { observaciones }, getAuthHeader());
};