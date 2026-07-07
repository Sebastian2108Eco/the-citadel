import { useState, useEffect } from 'react';
import './FormularioLibro.css';
import { Link, useNavigate } from 'react-router-dom';


export const FormularioLibro = ({ onGuardar, libroAEditar, limpiarEdicion }) => {
    const [autores, setAutores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    // Asegúrate de que esto sea así, sin que falte ningún campo:
    const [nuevoLibro, setNuevoLibro] = useState({
        titulo: '',
        isbn: '',
        descripcion: '',
        anio_publicacion: '',
        portada: '',
        archivo_pdf: '',
        disponibilidad: 1,
        id_categoria: '', // Si estos están vacíos, ponle '' no undefined
        id_autor: ''
    });
    // Cargar autores
    useEffect(() => {
        // Cargar autores
        fetch('http://localhost:5000/api/autores')
            .then(res => res.json())
            .then(data => setAutores(data));

        // Cargar categorías
        fetch('http://localhost:5000/api/categorias') // Asegúrate que este endpoint exista en tu server.js
            .then(res => res.json())
            .then(data => setCategorias(data));
    }, []);

    // Si viene libroAEditar, rellenamos el formulario
    useEffect(() => {
        if (libroAEditar) {
            // Si hay un libro, llenamos el formulario con sus datos
            setNuevoLibro({
                titulo: libroAEditar.titulo || '',
                isbn: libroAEditar.isbn || '',
                descripcion: libroAEditar.descripcion || '',
                anio_publicacion: libroAEditar.anio_publicacion || '',
                portada: libroAEditar.portada || '',
                archivo_pdf: libroAEditar.archivo_pdf || '',
                disponibilidad: libroAEditar.disponibilidad ?? 1,
                id_categoria: libroAEditar.id_categoria || '',
                id_autor: libroAEditar.id_autor || ''
            });
        } else {
            // Si no, limpiamos el formulario
            setNuevoLibro({
                titulo: '', isbn: '', descripcion: '', anio_publicacion: '',
                portada: '', archivo_pdf: '', disponibilidad: 1,
                id_categoria: '', id_autor: ''
            });
        }
    }, [libroAEditar]); // Este efecto corre cada vez que el libro a editar cambia

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Creamos un FormData para poder enviar archivos (imágenes y PDFs)
        const formData = new FormData();

        // Agregamos todos los campos de texto
        formData.append('titulo', nuevoLibro.titulo);
        formData.append('isbn', nuevoLibro.isbn);
        formData.append('descripcion', nuevoLibro.descripcion);
        formData.append('anio_publicacion', nuevoLibro.anio_publicacion);
        formData.append('disponibilidad', nuevoLibro.disponibilidad);
        formData.append('id_categoria', nuevoLibro.id_categoria);
        formData.append('id_autor', nuevoLibro.id_autor);

        // Agregamos los archivos (buscamos los inputs por su nombre)
        // Asegúrate de que tus inputs en el form tengan name="portada" y name="archivo_pdf"
        const portadaFile = e.target.portada.files[0];
        const pdfFile = e.target.archivo_pdf.files[0];

        if (portadaFile) formData.append('portada', portadaFile);
        if (pdfFile) formData.append('archivo_pdf', pdfFile);

        const metodo = libroAEditar ? 'PUT' : 'POST';
        const url = libroAEditar
            ? `http://localhost:5000/api/libros/${libroAEditar.id_libro}`
            : 'http://localhost:5000/api/libros';

        try {
            const response = await fetch(url, {
                method: metodo,
                // ¡IMPORTANTE!: No ponemos 'Content-Type': 'application/json' 
                // El navegador detecta automáticamente el FormData y pone los headers correctos
                body: formData
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            onGuardar();

            setNuevoLibro({
                titulo: '', isbn: '', descripcion: '', anio_publicacion: '',
                portada: '', archivo_pdf: '', disponibilidad: 1,
                id_categoria: '', id_autor: ''
            });

            if (limpiarEdicion) limpiarEdicion();
            alert("Libro guardado con éxito");

        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al guardar. Revisa la consola del servidor.");
        }
    };
    return (
        <form onSubmit={handleSubmit} className="form-container">
            <input
                placeholder="Título"
                value={nuevoLibro.titulo}
                onChange={e => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
            />
            <input
                placeholder="ISBN"
                value={nuevoLibro.isbn}
                onChange={e => setNuevoLibro({ ...nuevoLibro, isbn: e.target.value })}
            />
            <input
                placeholder="Año"
                value={nuevoLibro.anio_publicacion}
                onChange={e => setNuevoLibro({ ...nuevoLibro, anio_publicacion: e.target.value })}
            />

            <select
                value={nuevoLibro.id_autor}
                onChange={e => setNuevoLibro({ ...nuevoLibro, id_autor: e.target.value })}
            >
                <option value="">Selecciona un autor</option>
                {autores.map(a => (
                    <option key={a.id_autor} value={a.id_autor}>{a.nombre}</option>
                ))}
            </select>

            <select
                value={nuevoLibro.id_categoria}
                onChange={e => setNuevoLibro({ ...nuevoLibro, id_categoria: e.target.value })}
            >
                <option value="">Selecciona una categoría</option>
                {categorias.map(c => (
                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
                ))}
            </select>

            <div className="file-input-group">
                <label>Portada:</label>
                <input type="file" name="portada" accept="image/*" />
            </div>

            <textarea
                className="full-width"
                placeholder="Descripción"
                value={nuevoLibro.descripcion}
                onChange={e => setNuevoLibro({ ...nuevoLibro, descripcion: e.target.value })}
            />

            {/* Contenedor de botones para que se alineen bien */}
            <div className="form-actions">
                <button type="submit" className="btn-guardar">
                    {libroAEditar ? 'Actualizar Libro' : 'Guardar Libro'}
                </button>

                {libroAEditar && (
                    <button type="button" onClick={limpiarEdicion} className="btn-cancelar">
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};
export default FormularioLibro;