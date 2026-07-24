const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    console.log(`Recibí una petición: ${req.method} ${req.url}`);
    next();
});
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // ¡ESTO ES LO MÁS IMPORTANTE!
  }
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});
app.post('/api/login', (req, res) => {
    const { correo, password } = req.body;
    const sql = "SELECT * FROM tb_usuarios WHERE correo = ? AND password = ?";
    
    db.query(sql, [correo, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            // Fallo: credenciales incorrectas
            res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }
    });
});


app.post('/api/libros', upload.fields([{ name: 'portada' }, { name: 'archivo_pdf' }]), (req, res) => {
    const { titulo, isbn, descripcion, anio_publicacion, id_categoria, id_autor } = req.body;
    const portada = req.files['portada'] ? `/uploads/${req.files['portada'][0].filename}` : null;
    const pdf = req.files['archivo_pdf'] ? `/uploads/${req.files['archivo_pdf'][0].filename}` : null;

    const sql = `INSERT INTO tb_libros (titulo, isbn, descripcion, anio_publicacion, portada, archivo_pdf, id_categoria, id_autor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [titulo, isbn, descripcion, anio_publicacion, portada, pdf, id_categoria, id_autor], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Libro guardado" });
    });
});

app.get('/api/libros', (req, res) => {
    const sql = `
        SELECT l.*, a.nombre AS autor, c.nombre_categoria AS categoria 
        FROM tb_libros l
        LEFT JOIN tb_autores a ON l.id_autor = a.id_autor
        LEFT JOIN tb_categorias c ON l.id_categoria = c.id_categoria
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.get('/api/estadisticas', (req, res) => {
    // Esta consulta es la que une todo para tus tarjetas y gráficos
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM tb_libros) AS totalLibros,
            (SELECT COUNT(*) FROM tb_usuarios) AS totalUsuarios,
            (SELECT COUNT(*) FROM tb_prestamos) AS totalPrestamos
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener estadísticas:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(result[0]);
    });
});
app.post('/api/libros', (req, res) => {
    // Recibimos los datos desde el formulario de React
    const {
        titulo, isbn, descripcion, anio_publicacion,
        portada, archivo_pdf, disponibilidad, id_categoria, id_autor
    } = req.body;

    // La consulta incluye todos los campos de tu tabla
    const sql = `INSERT INTO tb_libros 
        (titulo, isbn, descripcion, anio_publicacion, portada, archivo_pdf, disponibilidad, id_categoria, id_autor) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        titulo, isbn, descripcion, anio_publicacion,
        portada, archivo_pdf, disponibilidad, id_categoria, id_autor
    ], (err, result) => {
        if (err) {
            console.error("Error en la inserción:", err);
            return res.status(500).json({ error: "Error al guardar el libro en la base de datos." });
        }
        res.status(200).send("Libro guardado correctamente");
    });
});
// Asegúrate de tener esto en tu server.js
app.get('/api/categorias', (req, res) => {
    db.query("SELECT * FROM tb_categorias", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
app.get('/api/autores', (req, res) => {
    db.query("SELECT * FROM tb_autores", (err, results) => {
        if (err) return res.status(500).send("Error al obtener autores");
        res.json(results);
    });
});
app.delete('/api/libros/:id', (req, res) => {
    const { id } = req.params;

    // Primero, borramos la relación en la tabla intermedia
    db.query("DELETE FROM tb_libros_autores WHERE id_libro = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: "Error borrando relación" });

        // Luego, borramos el libro
        db.query("DELETE FROM tb_libros WHERE id_libro = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: "Error borrando libro" });
            res.json({ message: "Libro eliminado" });
        });
    });
});
// Ruta para actualizar libro
app.put('/api/libros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, anio_publicacion, id_autor } = req.body;

    const sql = "UPDATE tb_libros SET titulo = ?, anio_publicacion = ? WHERE id_libro = ?";
    db.query(sql, [titulo, anio_publicacion, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Si todo sale bien
        res.json({ message: "Actualizado con éxito" });
    });
});
app.get('/api/reportes/totales', (req, res) => {
    // Esta consulta suma los registros de las 3 tablas principales de una sola vez
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM tb_libros) AS totalLibros,
            (SELECT COUNT(*) FROM tb_usuarios) AS totalUsuarios,
            (SELECT COUNT(*) FROM tb_prestamos) AS totalPrestamos
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error en reporte:", err);
            return res.status(500).json({ error: "Error al obtener totales" });
        }
        res.json(result[0]); // Esto devuelve algo como { totalLibros: 2847, ... }
    });
});
app.get('/api/reportes/prestamos-mes', (req, res) => {
    const sql = `
        SELECT 
            MONTHNAME(fecha_prestamo) as mes, 
            COUNT(*) as cantidad 
        FROM tb_prestamos 
        GROUP BY MONTH(fecha_prestamo), MONTHNAME(fecha_prestamo)
        ORDER BY MONTH(fecha_prestamo)
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.get('/api/reportes/libros-por-categoria', (req, res) => {
    db.query("SELECT c.nombre_categoria, COUNT(*) as cantidad FROM tb_libros l JOIN tb_categorias c ON l.id_categoria = c.id_categoria GROUP BY c.nombre_categoria", (err, result) => {
        res.json(result);
    });
});

app.get('/api/reportes/libros-mas-consultados', (req, res) => {
    const sql = `
        SELECT l.titulo, COUNT(*) as total 
        FROM tb_prestamos p 
        JOIN tb_libros l ON p.id_libro = l.id_libro 
        GROUP BY l.titulo 
        ORDER BY total DESC 
        LIMIT 5
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.get('/api/actividad-reciente', (req, res) => {
    // Ajusta los nombres de tablas/columnas según tu base de datos
    const sql = `
        SELECT u.nombre as usuario, l.titulo as libro, p.fecha_prestamo
        FROM tb_prestamos p
        JOIN tb_usuarios u ON p.id_usuario = u.id_usuario
        JOIN tb_libros l ON p.id_libro = l.id_libro
        ORDER BY p.fecha_prestamo DESC
        LIMIT 5
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});



//usuario 
app.get('/api/user/dashboard/:id', (req, res) => {
    const sql = `
        SELECT u.nombre, 
        (SELECT COUNT(*) FROM tb_prestamos WHERE id_usuario = u.id_usuario AND estado = 'activo') as total_prestamos,
        (SELECT MIN(fecha_dev) FROM tb_prestamos WHERE id_usuario = u.id_usuario AND estado = 'activo') as proxima_devolucion
        FROM tb_usuarios u WHERE u.id_usuario = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("ERROR SQL:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json({
            nombre: result[0].nombre,
            total_prestamos: result[0].total_prestamos,
            // Aquí enviamos la fecha con el nombre que el front espera
            proxima_devolucion: result[0].proxima_devolucion
        });
    });
});

app.get('/api/usuario/recientes/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    
    const sql = `
        SELECT l.*, p.fecha_prestamo 
        FROM tb_prestamos p
        JOIN tb_libros l ON p.id_libro = l.id_libro
        WHERE p.id_usuario = ?
        ORDER BY p.fecha_prestamo DESC
        LIMIT 4
    `;

    db.query(sql, [id_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/libros', (req, res) => {
    // Consulta simple para traer todos los libros
    const sql = "SELECT * FROM tb_libros";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener libros:", err);
            return res.status(500).json({ error: "Error al obtener libros" });
        }
        res.json(results);
    });
});
app.get('/api/catalogo', (req, res) => {
    const sql = `
        SELECT l.*, c.nombre_categoria 
        FROM tb_libros l 
        JOIN tb_categorias c ON l.id_categoria = c.id_categoria
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/libro/:id', (req, res) => {
    const sql = `
        SELECT l.*, a.nombre as nombre_autor, c.nombre_categoria 
        FROM tb_libros l
        LEFT JOIN tb_autores a ON l.id_autor = a.id_autor
        LEFT JOIN tb_categorias c ON l.id_categoria = c.id_categoria
        WHERE l.id_libro = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "Libro no encontrado" });
        }
    });
});
// Asegúrate de tener esto en tu server.js
app.post('/api/prestamo/solicitar', (req, res) => {
    const { id_usuario, id_libro } = req.body;

    // 1. Insertamos el préstamo en la tabla tb_prestamos
    const sqlPrestamo = "INSERT INTO tb_prestamos (id_usuario, id_libro, fecha_prestamo) VALUES (?, ?, NOW())";
    
    db.query(sqlPrestamo, [id_usuario, id_libro], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // 2. Actualizamos la disponibilidad del libro a 0 (Prestado/No disponible)
        const sqlUpdateLibro = "UPDATE tb_libros SET disponibilidad = 0 WHERE id_libro = ?";
        db.query(sqlUpdateLibro, [id_libro], (errUpdate) => {
            if (errUpdate) {
                return res.status(500).json({ error: errUpdate.message });
            }

            res.json({ message: '¡Préstamo solicitado con éxito!' });
        });
    });
});
// Ruta para marcar/desmarcar (Alternar)
// Asegúrate de usar app.post, no app.get
// Asegúrate de que esto esté después de app.use(express.json())
app.post('/api/favoritos', (req, res) => {
    console.log("Petición recibida en /api/favoritos"); // <-- Si esto no sale en la terminal, la ruta no está registrada
    const { id_usuario, id_libro } = req.body;

    const checkSql = "SELECT * FROM tb_favoritos WHERE id_usuario = ? AND id_libro = ?";
    db.query(checkSql, [id_usuario, id_libro], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            const deleteSql = "DELETE FROM tb_favoritos WHERE id_usuario = ? AND id_libro = ?";
            db.query(deleteSql, [id_usuario, id_libro], () => res.json({ action: 'removed' }));
        } else {
            const insertSql = "INSERT INTO tb_favoritos (id_usuario, id_libro) VALUES (?, ?)";
            db.query(insertSql, [id_usuario, id_libro], () => res.json({ action: 'added' }));
        }
    });
});
app.get('/api/favoritos/:id_usuario', (req, res) => {
    const sql = `
        SELECT l.* FROM tb_libros l
        INNER JOIN tb_favoritos f ON l.id_libro = f.id_libro
        WHERE f.id_usuario = ?
    `;
    db.query(sql, [req.params.id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
// Obtener perfil del usuario
// Asegúrate de tener esta ruta lista
// Asegúrate de que esta ruta esté escrita ANTES de app.listen(...)
app.get('/api/usuario/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT nombre, correo FROM tb_usuarios WHERE id_usuario = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error en BD:", err);
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(result[0]); // Aquí enviamos los datos en formato JSON
    });
});
// Actualizar perfil
app.put('/api/usuario/:id', (req, res) => {
    const { nombre, correo, password } = req.body;
    let sql = "UPDATE tb_usuarios SET nombre = ?, correo = ? WHERE id_usuario = ?";
    let params = [nombre, correo, req.params.id];

    if (password) {
        sql = "UPDATE tb_usuarios SET nombre = ?, correo = ?, password = ? WHERE id_usuario = ?";
        params = [nombre, correo, password, req.params.id];
    }

    db.query(sql, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Perfil actualizado" });
    });
});
app.listen(5000, () => {
    console.log('Servidor corriendo en puerto 5000');
});