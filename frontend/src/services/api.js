import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const login    = (data)      => API.post('/auth/login', data);
export const register = (data)      => API.post('/auth/register', data);
export const getEnseignants  = ()        => API.get('/enseignants');
export const addEnseignant   = (data)    => API.post('/enseignants', data);
export const updateEnseignant = (id, data) => API.put(`/enseignants/${id}`, data);
export const deleteEnseignant = (id)    => API.delete(`/enseignants/${id}`);
export const getBilan = () => API.get('/enseignants/bilan');