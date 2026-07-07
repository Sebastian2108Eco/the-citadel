import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormularioLibro } from './FormularioLibro';
import './GestionLibros.css';

function GestionLibros() {
    const [libros, setLibros] = useState([]);
    const [libroEditando, setLibroEditando] = useState(null);
    const [vista, setVista] = useState('tabla'); // Estado para alternar vistas
    const navigate = useNavigate();

    const cargarLibros = () => {
        fetch('http://localhost:5000/api/libros')
            .then(res => res.json())
            .then(data => setLibros(data))
            .catch(err => console.error("Error al cargar libros:", err));
    };

    const eliminarLibro = (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este libro?")) {
            fetch(`http://localhost:5000/api/libros/${id}`, { method: 'DELETE' })
                .then(() => cargarLibros());
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        cargarLibros();
    }, []);

    // EL RETURN DEBE IR AQUÍ, DENTRO DE LA FUNCIÓN
    return (
        <div className="admin-container">
            {/* Sidebar Integrado */}
            <nav className="admin-sidebar">
                <h2>THE CITADEL</h2>
                <div className="admin-menu">
                    <Link to="/admin/dashboard" className="nav-item">Dashboard</Link>
                    <Link to="/admin/libros" className="nav-item active">Libros</Link>
                    <Link to="/admin/reportes" className="nav-item">Reportes</Link>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </nav>

            {/* Contenido Principal */}
            <main className="gestion-container">
                <div className="admin-header">
                    <h1>{vista === 'tabla' ? 'Gestión de Libros' : (libroEditando ? 'Editar Libro' : 'Nuevo Libro')}</h1>
                    {vista === 'tabla' && (
                        <button className="btn-agregar-flotante" onClick={() => { setLibroEditando(null); setVista('formulario'); }}>
                            + AGREGAR LIBRO
                        </button>
                    )}
                </div>

                {vista === 'formulario' ? (
                    <div className="form-container">
                        <FormularioLibro
                            onGuardar={() => { cargarLibros(); setVista('tabla'); }}
                            libroAEditar={libroEditando}
                            limpiarEdicion={() => { setLibroEditando(null); setVista('tabla'); }}
                        />
                        <button className="btn-cancelar" onClick={() => setVista('tabla')}>Cancelar</button>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="tabla-libros">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Categoría</th>
                                    <th>Año</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(libros) && libros.length > 0 ? (
                                    libros.map(libro => (
                                        <tr key={libro.id_libro}>
                                            <td>#{String(libro.id_libro).padStart(3, '0')}</td>
                                            <td><strong>{libro.titulo}</strong></td>
                                            <td>{libro.autor || "Sin autor"}</td>
                                            <td><span className="badge bg-azul">{libro.categoria || "N/A"}</span></td>
                                            <td>{libro.anio_publicacion}</td>
                                            <td>
                                                <span className={`badge ${libro.disponibilidad === 1 ? 'bg-verde' : 'bg-naranja'}`}>
                                                    {libro.disponibilidad === 1 ? 'Disponible' : 'Prestado'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-accion" onClick={() => { setLibroEditando(libro); setVista('formulario'); }}>✏️</button>
                                                <button className="btn-accion" onClick={() => eliminarLibro(libro.id_libro)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="empty-msg">No hay libros cargados.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
} // <--- AQUÍ SE CIERRA LA FUNCIÓN CORRECTAMENTE

export default GestionLibros;