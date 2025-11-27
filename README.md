# WebStoreTemplateBackend 🛒

Backend template en TypeScript para una tienda web (Web Store), construido con arquitectura MVC sobre Express + MongoDB.  
Proporciona rutas y controladores para productos, conexión modular a base de datos, y una estructura lista para escalar hacia módulos de usuarios, pedidos, autenticación u otras funcionalidades.  

## 📌 Características principales

- Estructura modular basada en MVC, organizada para escalar fácilmente.  
- Rutas y controladores ya configurados para gestión de productos.  
- Integración con MongoDB, con configuración modular y reutilizable.  
- Uso de TypeScript para tipado fuerte, mayor mantenimiento y robustez.  
- Preparado para agregar funcionalidades como usuarios, pedidos, autenticación, etc.  

## 🧰 Tecnologías / Stack

- Node.js + TypeScript  
- Express (framework web)  
- MongoDB (base de datos NoSQL)  
- dotenv (gestión de variables de entorno)  
- pnpm / npm (gestor de paquetes)  

## 🚀 Instalación y puesta en marcha (desarrollo local)

```bash
# Clonar el repositorio
git clone https://github.com/Vizuetcf09/WebStoreTemplateBackend.git
cd WebStoreTemplateBackend

# Instalar dependencias
pnpm install   # o `npm install`

# Crear archivo .env
# Ejemplo de variables mínimas:
#   PORT=4000
#   MONGODB_URI=mongodb://localhost:27017/nombreDeTuBD

# Iniciar en modo desarrollo
npm run dev    # o pnpm dev
