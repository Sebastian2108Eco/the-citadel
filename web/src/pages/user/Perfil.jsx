import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Perfil.css';

function Perfil() {
    const [usuario, setUsuario] = useState({
        nombre: '',
        correo: '',
        password: ''
    });

    // Obtener ID del usuario (asegúrate de que exista en localStorage al hacer login)
    // En lugar de const idUsuario = 1;
    // Usa esto:
    // Cambia esto en Perfil.jsx
    const idUsuario = localStorage.getItem('userId'); // Ahora busca 'userId'
    useEffect(() => {
        if (!idUsuario) {
            console.error("No hay usuario logueado");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/usuario/${idUsuario}`)
            .then(res => res.json())
            .then(data => setUsuario(data))
            .catch(err => console.error("Error:", err));
    }, [idUsuario]);

    // 2. ACTUALIZAR ESTADO AL ESCRIBIR
    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    // 3. ENVIAR CAMBIOS AL SERVIDOR
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuario/${idUsuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            });

            if (res.ok) {
                alert("Perfil actualizado correctamente");
            } else {
                alert("Error al actualizar");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

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
                <div className="perfil-header">
                    <h1>MI PERFIL</h1>
                    <p>Gestiona tu información personal</p>
                </div>

                {/* Tarjeta superior: Foto y nombre */}
                <div className="perfil-card-user">
                    <div className="avatar-placeholder">LA</div>
                    <div className="user-info">
                        <h3>{usuario.nombre}</h3>
                        <p>{usuario.correo}</p>
                        <span className="badge">Lectora Premium</span>
                    </div>
                </div>

                {/* Formulario */}
                <div className="perfil-card-form">
                    <h3>INFORMACIÓN PERSONAL</h3>
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-group">
                            <label>NOMBRE COMPLETO</label>
                            <input name="nombre" value={usuario.nombre} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>CORREO ELECTRÓNICO</label>
                            <input name="correo" value={usuario.correo} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>NUEVA CONTRASEÑA</label>
                            <input type="password" name="password" placeholder="Dejar en blanco para no cambiar" onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn-update">ACTUALIZAR PERFIL</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Perfil;