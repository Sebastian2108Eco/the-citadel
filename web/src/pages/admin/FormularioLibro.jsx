import React, { useState, useEffect } from 'react';
import './FormularioLibro.css';

export const FormularioLibro = ({ onGuardar, libroAEditar, limpiarEdicion }) => {
    const [autores, setAutores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [nuevoLibro, setNuevoLibro] = useState({
        titulo: '',
        isbn: '',
        descripcion: '',
        anio_publicacion: '',
        portada: '',
        archivo_pdf: '',
        disponibilidad: 1,
        id_categoria: '',
        id_autor: ''
    });

    useEffect(() => {
        // Cargar autores
        fetch(`${import.meta.env.VITE_API_URL}/api/autores`)
            .then(res => res.json())
            .then(data => setAutores(data))
            .catch(err => console.error("Error al cargar autores:", err));

        // Cargar categorías
        fetch(`${import.meta.env.VITE_API_URL}/api/categorias`)
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Error al cargar categorías:", err));
    }, []);

    useEffect(() => {
        if (libroAEditar) {
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
            setNuevoLibro({
                titulo: '', isbn: '', descripcion: '', anio_publicacion: '',
                portada: '', archivo_pdf: '', disponibilidad: 1,
                id_categoria: '', id_autor: ''
            });
        }
    }, [libroAEditar]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('titulo', nuevoLibro.titulo);
        formData.append('isbn', nuevoLibro.isbn);
        formData.append('descripcion', nuevoLibro.descripcion);
        formData.append('anio_publicacion', nuevoLibro.anio_publicacion);
        formData.append('disponibilidad', nuevoLibro.disponibilidad);
        formData.append('id_categoria', nuevoLibro.id_categoria);
        formData.append('id_autor', nuevoLibro.id_autor);

        const portadaFile = e.target.portada.files[0];
        const pdfFile = e.target.archivo_pdf.files[0];

        if (portadaFile) formData.append('portada', portadaFile);
        if (pdfFile) formData.append('archivo_pdf', pdfFile);

        const metodo = libroAEditar ? 'PUT' : 'POST';
        const url = libroAEditar
            ? `${import.meta.env.VITE_API_URL}/api/libros/${libroAEditar.id_libro}`
            : `${import.meta.env.VITE_API_URL}/api/libros`;

        try {
            const response = await fetch(url, {
                method: metodo,
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
        <div className="form-wrapper">
            <h2 className="form-title">{libroAEditar ? 'Editar Libro' : 'Nuevo Libro'}</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-grid">
                    <div className="input-group">
                        <label>Título</label>
                        <input
                            type="text"
                            placeholder="Ej. El Hobbit"
                            value={nuevoLibro.titulo}
                            onChange={e => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>ISBN</label>
                        <input
                            type="text"
                            placeholder="Ej. 978-84-450..."
                            value={nuevoLibro.isbn}
                            onChange={e => setNuevoLibro({ ...nuevoLibro, isbn: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Año de Publicación</label>
                        <input
                            type="number"
                            placeholder="Ej. 1954"
                            value={nuevoLibro.anio_publicacion}
                            onChange={e => setNuevoLibro({ ...nuevoLibro, anio_publicacion: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>Autor</label>
                        <select
                            value={nuevoLibro.id_autor}
                            onChange={e => setNuevoLibro({ ...nuevoLibro, id_autor: e.target.value })}
                            required
                        >
                            <option value="">Selecciona un autor</option>
                            {autores.map(a => (
                                <option key={a.id_autor} value={a.id_autor}>{a.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Categoría</label>
                        <select
                            value={nuevoLibro.id_categoria}
                            onChange={e => setNuevoLibro({ ...nuevoLibro, id_categoria: e.target.value })}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map(c => (
                                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Imagen de Portada</label>
                        <input type="file" name="portada" accept="image/*" />
                    </div>

                    <div className="input-group">
                        <label>Archivo PDF del Libro</label>
                        <input type="file" name="archivo_pdf" accept="application/pdf" />
                    </div>

                    <div className="input-group full-width">
                        <label>Descripción</label>
                        <textarea
                            placeholder="Sinopsis o detalles del libro..."
                            value={nuevoLibro.descripcion}
                            onChange={e => setNuevoLibro({ ...nuevoLibro, descripcion: e.target.value })}
                        />
                    </div>
                </div>

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
        </div>
    );
};

export default FormularioLibro;