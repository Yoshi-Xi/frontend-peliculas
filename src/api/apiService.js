import axios from 'axios';

const API_URL = 'https://peliculas-backend-n8pt.onrender.com/api';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getGeneros = () => API.get('/generos');
export const getGenero = (id) => API.get(`/generos/${id}`);
export const createGenero = (data) => API.post('/generos', data);
export const updateGenero = (id, data) => API.put(`/generos/${id}`, data);
export const deleteGenero = (id) => API.delete(`/generos/${id}`);

export const getDirectores = () => API.get('/directores');
export const getDirector = (id) => API.get(`/directores/${id}`);
export const createDirector = (data) => API.post('/directores', data);
export const updateDirector = (id, data) => API.put(`/directores/${id}`, data);
export const deleteDirector = (id) => API.delete(`/directores/${id}`);

export const getProductoras = () => API.get('/productoras');
export const getProductora = (id) => API.get(`/productoras/${id}`);
export const createProductora = (data) => API.post('/productoras', data);
export const updateProductora = (id, data) => API.put(`/productoras/${id}`, data);
export const deleteProductora = (id) => API.delete(`/productoras/${id}`);

export const getTipos = () => API.get('/tipos');
export const getTipo = (id) => API.get(`/tipos/${id}`);
export const createTipo = (data) => API.post('/tipos', data);
export const updateTipo = (id, data) => API.put(`/tipos/${id}`, data);
export const deleteTipo = (id) => API.delete(`/tipos/${id}`);

export const getMedia = () => API.get('/media');
export const getMediaItem = (id) => API.get(`/media/${id}`);
export const createMedia = (data) => API.post('/media', data);
export const updateMedia = (id, data) => API.put(`/media/${id}`, data);
export const deleteMedia = (id) => API.delete(`/media/${id}`);