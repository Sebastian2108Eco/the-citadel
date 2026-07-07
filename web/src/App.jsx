import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import DashboardUser from './pages/user/DashboardUser';
import Catalogo from './pages/user/Catalogo';
import GestionLibros from './pages/admin/GestionLibros';
import Reportes from './pages/admin/Reportes';
import DetalleLibro from './pages/user/DetalleLibro';// <--- Asegúrate de importar tu componente
import Favoritos from './pages/user/Favoritos';
import Perfil from './pages/user/Perfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/libros" element={<GestionLibros />} />
        <Route path="/admin/reportes" element={<Reportes />} />

        <Route path="/user/dashboard" element={<DashboardUser />} />
        <Route path="/user/catalogo" element={<Catalogo />} />
        <Route path="/user/favoritos" element={<Favoritos />} />
        <Route path="/user/detalle/:id" element={<DetalleLibro />} />
        <Route path="/user/perfil" element={<Perfil />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;