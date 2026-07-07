// src/services/api.js
const API_URL = 'http://localhost:3000'; // Asegúrate de que este sea el puerto de tu backend

export const obtenerLibros = async () => {
    try {
        const response = await fetch(`${API_URL}/api/libros`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener libros:", error);
        return [];
    }
};