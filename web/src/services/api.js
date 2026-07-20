// src/services/api.js
const API_URL = 'https://the-citadel-api.onrender.com';

export const obtenerLibros = async () => {
    try {
        const response = await fetch(`${API_URL}/api/libros`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener libros:", error);
        return [];
    }
};