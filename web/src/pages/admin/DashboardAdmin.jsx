import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2'; // O 'Bar' si prefieres barras
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './DashboardAdmin.css'


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardAdmin = () => {
    const [stats, setStats] = useState({ totalUsuarios: 0, totalLibros: 0, totalPrestamos: 0 });
    const [actividad, setActividad] = useState([]);
    const handleLogout = () => {
        localStorage.removeItem('token'); // Borra el token si lo usas
        window.location.href = '/';   // Redirige al login
    };
    useEffect(() => {
        fetch('http://localhost:5000/api/estadisticas')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error stats:", err));

        fetch('http://localhost:5000/api/actividad-reciente')
            .then(res => res.json())
            .then(data => setActividad(data))
            .catch(err => console.error("Error actividad:", err));
    }, []);
    return (
        <div className="admin-container">
            <nav className="admin-sidebar">
                <h2>THE CITADEL</h2>
                <div className="admin-menu">
                    <Link to="/admin/dashboard" className="nav-item active">Dashboard</Link>
                    <Link to="/admin/libros" className="nav-item">Libros</Link>
                    <Link to="/admin/reportes" className="nav-item">Reportes</Link>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </nav>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>PANEL ADMINISTRATIVO</h1>
                    <p>Resumen general del sistema</p>
                </header>

                {/* Tarjetas de estadísticas */}
                <section className="stats-grid">
                    <div className="stat-card"><h3>Usuarios</h3><p>{stats.totalUsuarios}</p></div>
                    <div className="stat-card"><h3>Libros</h3><p>{stats.totalLibros}</p></div>
                    <div className="stat-card"><h3>Préstamos</h3><p>{stats.totalPrestamos}</p></div>
                </section>

                {/* Actividad Reciente */}
                <section className="activity-card">
                    <h3>ACTIVIDAD RECIENTE</h3>
                    {actividad.length > 0 ? actividad.map((item, index) => (
                        <div key={index} className="activity-item">
                            <span><strong>{item.usuario}</strong> solicitó préstamo de <em>"{item.libro}"</em></span>
                            <small>hace poco</small>
                        </div>
                    )) : <p>No hay actividad reciente.</p>}
                </section>
            </main>
        </div>
    );
};

const cardStyle = { padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '150px' };

export default DashboardAdmin;