import axios from 'axios';
import { Task, AuthResponse } from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error completo:', error);
            console.error('Datos de error:', error.response.data);
            
            const errorMessage = error.response.data?.message || '';
            console.error('Mensaje de error:', errorMessage);
            
            // Si el mensaje contiene información sobre duplicación
            if (errorMessage.includes('llave duplicada') || 
                errorMessage.includes('viola restricción de unicidad') ||
                errorMessage.includes('Error al registrar el usuario')) {
                
                // Buscar si es un error de email
                if (errorMessage.includes('email')) {
                    const emailMatch = errorMessage.match(/\(email\)=\((.*?)\)/);
                    if (emailMatch) {
                        throw new Error(`El email "${emailMatch[1]}" ya está registrado`);
                    }
                }
                
                // Buscar si es un error de username
                if (errorMessage.includes('username')) {
                    const usernameMatch = errorMessage.match(/\(username\)=\((.*?)\)/);
                    if (usernameMatch) {
                        throw new Error(`El nombre de usuario "${usernameMatch[1]}" ya está registrado`);
                    }
                }
            }
            
            // Si hay un mensaje de error, lo mostramos
            if (errorMessage) {
                throw new Error(errorMessage);
            }
            
            throw new Error('Error en la operación');
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error('Error de red:', error.request);
            throw new Error('Error de conexión con el servidor');
        } else {
            // Algo sucedió al configurar la petición
            console.error('Error:', error.message);
            throw new Error('Error al procesar la petición');
        }
    }
);

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const register = async (
    username: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string
): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', {
        username,
        email,
        password,
        firstname,
        lastname
    });
    return response.data;
};

export const getTasks = async (userId: number): Promise<Task[]> => {
    const response = await api.get(`/tasks?userId=${userId}`);
    return response.data;
};

export const createTask = async (task: Omit<Task, 'id' | 'user'>, userId: number): Promise<Task> => {
    const response = await api.post(`/tasks?userId=${userId}`, task);
    return response.data;
};

export const updateTask = async (id: number, task: Partial<Task>, userId: number): Promise<Task> => {
    const response = await api.put(`/tasks?userId=${userId}`, task);
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
}; 