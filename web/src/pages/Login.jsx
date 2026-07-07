import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login() {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password })
            });

            const data = await response.json();

            if (data.success) {
                // Guardamos el ID en localStorage bajo la llave 'userId'
                localStorage.setItem('userId', data.user.id_usuario);
                
                // Redirección según rol
                if (data.user.id_rol === 1) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                alert(data.message || "Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error("Error al conectar:", error);
            alert("No se pudo conectar al servidor.");
        }
    };

    return (
        <div className="login-container">
            {/* Lado izquierdo: Branding */}
            <div className="login-left">
                <h1>THE CITADEL</h1>
                <p>CUSTODIOS DEL CONOCIMIENTO</p>
                <p className="frase">"Una biblioteca es el paraíso de los sabios y el refugio de los ignorantes que desean dejar de serlo."</p>
            </div>

            {/* Lado derecho: Formulario */}
            <div className="login-right">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>BIENVENIDO</h2>
                    <p>Sistema de Gestión de Biblioteca Digital</p>
                    
                    <label>USUARIO</label>
                    <input 
                        type="email" 
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)} 
                        placeholder="ejemplo@citadel.com"
                        required
                    />

                    <label>CONTRASEÑA</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="********"
                        required
                    />

                    <button type="submit" className="login-button">
                        INICIAR SESIÓN
                    </button>
                    
                    <a href="/olvide-password" className="olvide-link">¿Olvidé mi contraseña?</a>
                </form>
            </div>
        </div>
    );
}

export default Login;