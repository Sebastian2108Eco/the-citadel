THE CITADEL: Sistema Web de Gestión de Biblioteca Digital
Introducción y Visión del Proyecto
The Citadel es una plataforma web desarrollada para la modernización de los procesos de gestión bibliotecaria. Su propósito fundamental es centralizar la administración de catálogos, el control de préstamos y el historial de usuarios en un entorno digital, eliminando la dependencia de procesos manuales. El sistema está diseñado para ser una herramienta eficiente, intuitiva y rápida, garantizando un acceso fluido a la información bibliográfica desde cualquier navegador moderno.

Objetivos
Objetivo General
Desarrollar un sistema web de biblioteca digital que permita la gestión integral de libros, usuarios y préstamos, optimizando el control administrativo y facilitando el acceso a la información bibliográfica a través de una arquitectura tecnológica escalable.

Objetivos Específicos
Diseñar una interfaz amigable que proporcione una experiencia de usuario optimizada para distintos perfiles (usuarios y administradores).

Implementar un sistema de autenticación seguro que gestione el acceso y permisos basados en roles definidos.

Habilitar la administración completa del catálogo mediante operaciones CRUD (Crear, Leer, Actualizar, Borrar).

Facilitar el flujo completo de préstamos y devoluciones, asegurando la integridad de los datos en tiempo real.

Optimizar la estructura de la base de datos para asegurar una organización eficiente de la información y rapidez en las consultas.

Alcance del Proyecto
Funcionalidades Incluidas
Registro, autenticación e inicio de sesión de usuarios.

Módulo de gestión de usuarios con privilegios de administrador.

Visualización y búsqueda avanzada de libros mediante filtros por título, autor o categoría.

Proceso de solicitud y control de préstamos, incluyendo fechas de entrega y devolución.

Administración de catálogos de libros y autores.

Registro de favoritos e historial detallado de lectura por usuario.

Funcionalidades Excluidas
Integración con servicios externos de bibliotecas o APIs de terceros.

Implementación de pasarelas de pago o sistemas de membresías.

Visualización interna de archivos PDF o lectura directa de eBooks.

Desarrollo de aplicaciones móviles nativas.

Sistemas de control de activos físicos mediante tecnología RFID.

Arquitectura Técnica y Datos
Tecnologías Implementadas
Frontend: React, Vite para la construcción de interfaces dinámicas.

Backend: Node.js, Express para la lógica de servidor.

Base de Datos: MySQL para el almacenamiento relacional de información.

Control de Versiones: Git y GitHub para el seguimiento del ciclo de vida del desarrollo.

Diseño de Base de Datos
El esquema de datos está fundamentado en una arquitectura relacional normalizada. Las tablas principales incluyen:

Entidades Principales: tb_libros, tb_autores, tb_categorias, tb_usuarios y tb_roles.

Tablas de Relación: tb_libros_autores (para relaciones muchos a muchos), tb_prestamos, tb_favoritos y tb_historial_lectura.
Este diseño asegura la integridad referencial y permite consultas complejas entre entidades, optimizando la recuperación de datos mediante el uso de JOINs.

Beneficios del Sistema
Eficiencia Operativa: Reducción drástica en tiempos de gestión mediante la automatización de procesos manuales.

Integridad de Información: Mejor organización y centralización de la información bibliográfica.

Accesibilidad: Disponibilidad del catálogo en todo momento y desde cualquier dispositivo.

Control: Monitoreo preciso del inventario y del ciclo de vida de los préstamos.

Proyecto desarrollado como parte de la formación académica en la Universidad Tecnológica de Nezahualcóyotl.
