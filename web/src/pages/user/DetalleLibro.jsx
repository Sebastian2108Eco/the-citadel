import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './DetalleLibro.css';

const DetalleLibro = () => {
    const { id } = useParams(); // El nombre "id" debe coincidir con el de App.jsx
    console.log("ID recibido:", id); // Si esto sale "undefined", ahí está el problema. // Obtiene el ID de la URL
    const [libro, setLibro] = useState(null);
    const [esFavorito, setEsFavorito] = useState(false);
    const solicitarPrestamo = () => {
        // Obtenemos el ID que ya guardaste en el login
        const idUsuario = localStorage.getItem('userId');

        if (!idUsuario) {
            alert("Debes iniciar sesión para solicitar un préstamo");
            return;
        }

        fetch('${import.meta.env.VITE_API_URL}/api/prestamo/solicitar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: idUsuario, // Usamos la variable que acabamos de obtener
                id_libro: libro.id_libro
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    // Esto recarga la página para refrescar los datos desde el servidor
                    window.location.reload();
                }
            })
    };
    // Dentro de tu useEffect, agrega un console.log para ver qué llega:
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/libro/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Datos del libro recibidos:", data); // <--- MIRA ESTO EN LA CONSOLA (F12)
                setLibro(data);
            });
    }, [id]);

    useEffect(() => {
        // Aquí harías un fetch a una ruta nueva: /api/favoritos/check/:id_usuario/:id_libro
        // y si responde true, haces setEsFavorito(true)
    }, []);

    const manejarFavorito = async () => {
        // Obtenemos el id del usuario del localStorage o usamos 1 por defecto
        const idUsuarioActual = localStorage.getItem('id_usuario') || 1;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favoritos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: Number(idUsuarioActual),
                    id_libro: libro.id_libro
                })
            });

            const data = await res.json();

            if (res.ok) {
                setEsFavorito(!esFavorito); // Cambia el estado visual (icono o color)
                if (data.action === 'added') {
                    console.log('Libro agregado a favoritos');
                } else {
                    console.log('Libro eliminado de favoritos');
                }
            } else {
                console.error('Error al actualizar favoritos:', data.error);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    if (!libro) return <p>Cargando detalles...</p>;

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <h2>THE CITADEL</h2>
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/user/dashboard" className="nav-link">Inicio</Link></li>
                    <li className="nav-item"><Link to="/user/catalogo" className="nav-link">Catálogo</Link></li>
                    <li className="nav-item"><Link to="/user/favoritos" className="nav-link">Favoritos</Link></li>
                    <li className="nav-item"><Link to="/user/perfil" className="nav-link">Perfil</Link></li>
                    <button
                        className="nav-link logout-btn"
                        onClick={() => {
                            // Aquí va tu lógica de logout, por ejemplo:
                            localStorage.removeItem('token');
                            window.location.href = '/';
                        }}
                    >
                        Cerrar sesión
                    </button>
                </ul>
            </nav>
            <main className="main-content">


                <div className="detalle-layout">
                    {/* Columna Izquierda: Imagen */}
                    <div className="detalle-imagen">
                        <img src={`${import.meta.env.VITE_API_URL}${libro.portada}`} alt="Portada" />
                    </div>

                    {/* Columna Derecha: Información */}
                    <div className="detalle-info">
                        <div className="header-info">
                            <h1>{libro.titulo}</h1>
                            <p className="subtitle">{libro.nombre_autor || "Sin autor"} • 1954</p>
                            <span className={`status-badge ${libro.disponibilidad ? 'disp' : 'prestado'}`}>
                                {libro.disponibilidad ? 'Disponible' : 'Prestado'}
                            </span>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-box"><span>Categoría</span><strong>{libro.nombre_categoria || "N/A"}</strong></div>
                            <div className="stat-box"><span>Año</span><strong>1954</strong></div>
                            <div className="stat-box"><span>Páginas</span><strong>---</strong></div>
                        </div>

                        <div className="descripcion-box">
                            <h3>DESCRIPCIÓN</h3>
                            <p>{libro.descripcion}</p>
                        </div>

                        <div className="acciones-box">
                            {libro.disponibilidad === 1 ? (
                                <button className="btn-primary" onClick={solicitarPrestamo}>Solicitar Préstamo</button>
                            ) : (
                                <button className="btn-read" onClick={() => { /* tu lógica de PDF */ }}>Leer Libro</button>
                            )}
                            <button className={`btn-fav ${esFavorito ? 'active' : ''}`} onClick={manejarFavorito}>
                                {esFavorito ? '❤️ Quitar de Favoritos' : '🤍 Favoritos'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default DetalleLibro;