import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div style={{ width: '250px', backgroundColor: '#1a2333', color: 'white', height: '100vh', padding: '20px' }}>
            <h2>THE CITADEL</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Link to="/admin/dashboard" style={{ color: 'white' }}>Dashboard</Link>
                <Link to="/admin/libros" style={{ color: 'white' }}>Gestión de Libros</Link>
                <Link to="/admin/reportes" style={{ color: 'white' }}>Reportes</Link>
            </nav>
        </div>
    );
}
export default Sidebar;