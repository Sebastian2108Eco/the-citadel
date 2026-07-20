import React, { useState, useEffect, useRef } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Link, useNavigate } from 'react-router-dom';


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Reportes = () => {
    const reportRef = useRef(); // Referencia para el PDF
    const [statsPrestamos, setStatsPrestamos] = useState([]);
    const [statsCategorias, setStatsCategorias] = useState([]);
    const [librosPopulares, setLibrosPopulares] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/reportes/prestamos-mes`).then(res => res.json()).then(setStatsPrestamos);
        fetch(`${import.meta.env.VITE_API_URL}/api/reportes/libros-por-categoria`).then(res => res.json()).then(setStatsCategorias);
        fetch(`${import.meta.env.VITE_API_URL}/api/reportes/libros-mas-consultados`).then(res => res.json()).then(setLibrosPopulares);
    }, []);

    // Función para exportar a PDF
    const exportarPDF = () => {
        const input = reportRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save('Reporte_Citadel.pdf');
        });
    };

    const dataBar = {
        labels: statsPrestamos.map(i => i.mes),
        datasets: [{ label: 'Préstamos', data: statsPrestamos.map(i => i.cantidad), backgroundColor: '#1b263b' }]
    };

    const dataPie = {
        labels: statsCategorias.map(i => i.nombre_categoria),
        datasets: [{ data: statsCategorias.map(i => i.cantidad), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }]
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    return (
        <div className="admin-container">
            {/* Sidebar Integrado */}
            <nav className="admin-sidebar">
                <h2>THE CITADEL</h2>
                <div className="admin-menu">
                    <Link to="/admin/dashboard" className="nav-item">Dashboard</Link>
                    <Link to="/admin/libros" className="nav-item">Libros</Link>
                    <Link to="/admin/reportes" className="nav-item active">Reportes</Link>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </nav>

            {/* Contenido Principal de Reportes */}
            <main className="gestion-container">
                <div className="admin-header">
                    <h1>Reportes y Estadísticas</h1>
                    <button onClick={exportarPDF} className="btn-exportar">
                        📥 Descargar PDF
                    </button>
                </div>

                <div ref={reportRef} className="report-content">
                    {/* Gráficas */}
                    <div className="charts-row">
                        <div className="chart-box">
                            <Bar data={dataBar} />
                        </div>
                        <div className="chart-box">
                            <Pie
                                data={dataPie}
                                options={{ maintainAspectRatio: false }} // Esto le da libertad total al CSS para controlar el tamaño
                            />                        </div>
                    </div>

                    {/* Lista de Populares */}
                    <div className="popular-books-list">
                        <h3>Libros más consultados</h3>
                        <ul>
                            {librosPopulares.map((libro, index) => (
                                <li key={index}>
                                    <span>{libro.titulo}</span>
                                    <strong>{libro.total} préstamos</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reportes;