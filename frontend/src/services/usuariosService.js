import axios from "axios";

const API_URL = "http://localhost:3000/api/usuarios";

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