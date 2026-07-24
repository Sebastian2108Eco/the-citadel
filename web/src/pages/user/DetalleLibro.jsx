import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './DetalleLibro.css';

const DetalleLibro = () => {
    const { id } = useParams(); 
    console.log("ID recibido:", id); 
    const [libro, setLibro] = useState(null);
    const [esFavorito, setEsFavorito] = useState(false);

    const solicitarPrestamo = () => {
        const idUsuario = localStorage.getItem('userId');

        if (!idUsuario) {
            alert("Debes iniciar sesión para solicitar un préstamo");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/prestamo/solicitar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: idUsuario,
                id_libro: libro.id_libro
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    window.location.reload();
                }
            })
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/libro/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Datos del libro recibidos:", data); 
                setLibro(data);
            });
    }, [id]);

    useEffect(() => {
        // Aquí puedes agregar la verificación de favoritos si lo requieres
    }, []);

    const manejarFavorito = async () => {
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
                setEsFavorito(!esFavorito); 
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

    // Función para abrir el PDF correctamente
    const manejarLeerLibro = () => {
        if (libro && libro.archivo_pdf) {
            const urlCompleta = `${import.meta.env.VITE_API_URL}${libro.archivo_pdf}`;
            window.open(urlCompleta, '_blank');
        } else {
            alert('Este libro aún no tiene un archivo PDF disponible.');
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
                            {/* Botón de Préstamo condicionado */}
                            {libro.disponibilidad === 1 ? (
                                <button className="btn-primary" onClick={solicitarPrestamo}>Solicitar Préstamo</button>
                            ) : (
                                <button className="btn-secondary" disabled>No disponible para préstamo</button>
                            )}

                            {/* Botón de Leer Libro independiente que abre el PDF */}
                            <button className="btn-read" onClick={manejarLeerLibro}>
                                Leer Libro
                            </button>

                            {/* Botón de Favoritos */}
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