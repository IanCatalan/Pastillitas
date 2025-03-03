# Scraping de Medicamentos - Backend Centrado en Datos

Este proyecto es un scraper que extrae información sobre medicamentos desde varias farmacias conocidas, almacenándola en una base de datos PostgreSQL. La prioridad del desarrollo estuvo en el backend y en la estructuración de los datos, por lo que la interfaz no es el foco principal.

## 🚀 Tecnologías utilizadas

- **Node.js** con **Express** para la API.
- **PostgreSQL** como base de datos.
- **Crawlee** para la extracción de datos.
- **Sequelize** y **Sequelize-CLI** para la gestión de la base de datos.
- **Fuse.js** para la búsqueda eficiente de medicamentos.
- **React** y **React-DOM** para una interfaz básica.
- **CORS** para manejo de solicitudes entre dominios.

## 🔍 Cómo funciona

- El scraper se encarga de recorrer los sitios web de diferentes farmacias, usando los sitemaps,  y extraer información como nombre, precio, url y tienda.
- Los datos se almacenan en PostgreSQL utilizando **Sequelize** como ORM.
- Se expone una API con Express para acceder a la información recolectada.
- **Fuse.js** permite realizar búsquedas rápidas y eficientes en los datos.
- La interfaz con **React** es simple y funcional, pero no es el foco del proyecto.

## 📌 Notas importantes

- **Este proyecto está centrado en el backend**, por lo que la interfaz es básica.
- Si decides probarlo en producción, revisa las políticas de scraping de cada sitio y respeta los términos de uso.
- Puedes ampliar el proyecto agregando más fuentes o mejorando la estructura de datos.

## 💡 Posibles mejoras

- Implementar autenticación para el acceso a los datos.
- Mejorar la detección y actualización de precios en tiempo real.
- Crear una interfaz más atractiva y detallada para visualizar la información.
- Mejorar la eficiencia en la extracción de datos.

