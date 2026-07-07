import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Catalogo.css';


const Catalogo = () => {
    const navigate = useNavigate();
    const [libros, setLibros] = useState([]);
    const [categorias, setCategorias] = useState(['Todas']);
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        // Solo un fetch es necesario
        fetch('http://localhost:5000/api/catalogo')
            .then(res => res.json())
            .then(data => {
                setLibros(data);
                const catsUnicas = ['Todas', ...new Set(data.map(l => l.nombre_categoria))];
                setCategorias(catsUnicas);
            })
            .catch(err => console.error("Error cargando:", err));
    }, []);

    const librosFiltrados = libros.filter(libro => {
        // Usamos ?. (optional chaining) y || '' (valor por defecto)
        const titulo = (libro.titulo || '').toLowerCase();
        const autor = (libro.autor || '').toLowerCase();
        const busquedaLower = busqueda.toLowerCase();

        const coincideBusqueda = titulo.includes(busquedaLower) || autor.includes(busquedaLower);
        const coincideCategoria = categoriaActiva === 'Todas' || libro.nombre_categoria === categoriaActiva;

        return coincideBusqueda && coincideCategoria;
    });

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <h2>THE CITADEL</h2>
                <ul className="nav-list">
                    <li className="nav-item"><Link to="/user/dashboard" className="nav-link">Inicio</Link></li>
                    <li className="nav-item"><Link to="/user/catalogo" className="nav-link">Catálogo</Link></li>
                    <li className="nav-item"><Link to="/user/favoritos" className="nav-link">Favoritos</Link></li>
                    <li className="nav-item"><Link to="/user/perfil" className="nav-link">Perfil</Link></li>
                    <li className="nav-item">
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
                    </li>
                </ul>
            </nav>

            <main className="main-content">
                <h1>CATÁLOGO</h1>

                <input
                    type="text"
                    placeholder="Buscar por título o autor..."
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-bar"
                />

                <div className="category-container">
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoriaActiva(cat)}
                            className={`category-btn ${categoriaActiva === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="books-grid">
                    {librosFiltrados.map(libro => (
                        <div key={libro.id_libro} className="book-card">
                            <img
                                src={`http://localhost:5000${libro.portada}`}
                                alt={libro.titulo}
                                className="book-img"
                                onError={(e) => {
                                    // En lugar de ocultar, ponemos una imagen de respaldo
                                    e.target.src = '/images/no-image.jpg';
                                }}
                            />
                            <h3>{libro.titulo}</h3>
                            <p className="author-text">{libro.autor}</p>
                            <div className="card-footer">
                                <button className="view-btn" onClick={() => navigate(`/user/detalle/${libro.id_libro}`)}>Ver detalle</button>
                                <button className="fav-btn" onClick={() => console.log("Favorito:", libro.id_libro)}>❤️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Catalogo;