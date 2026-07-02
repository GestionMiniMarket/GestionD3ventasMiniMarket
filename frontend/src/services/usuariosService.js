import axios from "axios";

// Leemos la URL base desde el .env y le agregamos /usuarios
const API_URL = `${import.meta.env.VITE_API_URL}/usuarios`;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getUsuarios = () =>
  axios.get(API_URL, getAuthHeader());

export const getUsuarioById = (id) =>
  axios.get(`${API_URL}/${id}`, getAuthHeader());

export const createUsuario = (data) =>
  axios.post(API_URL, data, getAuthHeader());

export const updateUsuario = (id, data) =>
  axios.put(`${API_URL}/${id}`, data, getAuthHeader());

export const deleteUsuario = (id) =>
  axios.delete(`${API_URL}/${id}`, getAuthHeader());