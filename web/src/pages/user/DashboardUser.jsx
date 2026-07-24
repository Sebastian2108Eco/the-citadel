import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DashboardaUser.css'; 

const DashboardUser = () => {
    const [info, setInfo] = useState({ nombre: 'Usuario', total_prestamos: 0, proxima_devolucion: null });
    const [libros, setLibros] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId') || localStorage.getItem('id_usuario');

        // Cargar datos del usuario
        if (userId) {
            fetch(`${import.meta.env.VITE_API_URL}/api/user/dashboard/${userId}`)
                .then(res => res.json())
                .then(setInfo)
                .catch(err => console.error("Error al cargar info de usuario:", err));
        }

        // Cargar libros recientes (Corregido con backticks)
        fetch(`${import.meta.env.VITE_API_URL}/api/libros/recientes`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setLibros(data);
                }
            })
            .catch(err => console.error("Error al cargar libros recientes:", err));
    }, []);

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
                            localStorage.removeItem('userId'); 
                            localStorage.removeItem('id_usuario'); 
                            window.location.href = '/'; 
                        }}
                    >
                        Cerrar sesión
                    </button>
                </ul>
            </nav>

            <main className="main-content">
                <div className="welcome-card">
                    <h1>Bienvenida, {info ? info.nombre : 'Cargando...'}</h1>
                    <p>Tienes {info.total_prestamos} libros en préstamo. {info.proxima_devolucion && `Próxima devolución: ${new Date(info.proxima_devolucion).toLocaleDateString()}`}</p>
                    <Link to="/user/catalogo"><button className="explore-btn">Explorar Catálogo</button></Link>
                </div>

                <h3>Libros Recientes</h3>
                <div className="books-grid">
                    {libros.map(libro => (
                        <div key={libro.id_libro} className="book-card">
                            <Link to={`/user/detalle/${libro.id_libro}`}>
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${libro.portada}`}
                                    alt={libro.titulo}
                                    className="book-img"
                                    onError={(e) => {
                                        e.target.src = '/images/no-image.jpg';
                                    }}
                                />
                            </Link>
                            <h4>{libro.titulo}</h4>
                            <span className={`status-tag ${libro.disponibilidad ? 'available' : 'borrowed'}`}>
                                {libro.disponibilidad ? 'Disponible' : 'Prestado'}
                            </span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DashboardUser;