import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';// Para navegar al detalle
import './Favoritos.css';

function Favoritos() {
    const [libros, setLibros] = useState([]);
    const navigate = useNavigate();
    const idUsuario = 1; // Aquí deberás poner el ID de tu usuario logueado

    const cargarFavoritos = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/favoritos/${idUsuario}`)
            .then(res => res.json())
            .then(data => setLibros(data))
            .catch(err => console.error("Error al cargar favoritos:", err));
    };

    useEffect(() => {
        cargarFavoritos();
    }, []);

    const eliminarFavorito = async (idLibro) => {
        // Reutilizamos tu lógica de POST para alternar (al enviar el mismo ID, lo elimina)
        await fetch('${import.meta.env.VITE_API_URL}/api/favoritos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: idUsuario, id_libro: idLibro })
        });
        cargarFavoritos(); // Recargamos la lista
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar consistente */}
            <nav className="sidebar">
                <h2>THE CITADEL</h2>
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/user/dashboard" className="nav-link">Inicio</Link></li>
                    <li className="nav-item"><Link to="/user/catalogo" className="nav-link">Catálogo</Link></li>
                    <li className="nav-item"><Link to="/user/favoritos" className="nav-link">Favoritos</Link></li>
                    <li className="nav-item"><Link to="/user/perfil" className="nav-link">Perfil</Link></li>
                </ul>
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
            </nav>

            <main className="main-content">
                <div className="favoritos-header">
                    <h1>Mis Favoritos</h1>
                    <p className="subtitle">{libros.length} libros guardados en tu biblioteca personal</p>
                </div>

                <div className="grid-libros">
                    {libros.map(libro => (
                        <div key={libro.id_libro} className="tarjeta-libro">
                            <img src={`${import.meta.env.VITE_API_URL}${libro.portada}`} alt={libro.titulo} className="libro-img" />
                            <h3>{libro.titulo}</h3>
                            <p className="autor-text">{libro.autor}</p>

                            <div className="acciones">
                                <button className="btn-detalle" onClick={() => navigate(`/user/detalle/${libro.id_libro}`)}>Ver detalle</button>
                                <button className="btn-eliminar" onClick={() => eliminarFavorito(libro.id_libro)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Favoritos;