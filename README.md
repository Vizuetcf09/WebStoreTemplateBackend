# WebStoreTemplateBackend 🛒

🌐 **Idiomas disponibles:**  
- 🇪🇸 Español
- 🇺🇸 [Inglés](README.en.md)  

Backend template en TypeScript para una tienda web, construido con arquitectura MVC sobre **Express + MongoDB**.  
Incluye rutas y controladores para productos, configuración de base de datos y una estructura lista para escalar.

---

## 📝 Sobre este template

Este backend está diseñado para iniciar rápidamente una tienda web moderna con Node.js, TypeScript y MongoDB.

---

## 📌 Características principales

- Arquitectura modular basada en MVC  
- Rutas y controladores preconfigurados para productos  
- Integración con MongoDB usando el driver oficial  
- Escrito totalmente en TypeScript  
- Preparado para módulos como usuarios, autenticación, pedidos, etc.

---

## 🧰 Tecnologías / Stack (con versiones sugeridas)

| Tecnología      | Versión recomendada |
|----------------|----------------------|
| **Node.js**    | ^20.0.0             |
| **TypeScript** | ^5.0.0              |
| **Express**    | ^4.18.0             |
| **MongoDB Driver** | ^5.8.0         |
| **dotenv**     | ^16.0.0             |
| **pnpm**       | ≥ 8.0               |
| **npm**        | ≥ 9.0               |

---

## 🚀 Instalación (desarrollo local)

```bash
# Clonar el repositorio
git clone https://github.com/Vizuetcf09/WebStoreTemplateBackend.git
cd WebStoreTemplateBackend

# Instalar dependencias
pnpm install   # o npm install

# Iniciar en modo desarrollo
pnpm dev       # o npm run dev
````

---

## ⚙️ Variables de entorno

Crear un archivo **.env** en la raíz:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/NombreDeTuBD
```

---

## 📂 Estructura del proyecto

```bash
/src
  /controllers   # Lógica de negocio
  /models        # Modelos / esquemas de datos
  /routes        # Endpoints de la API
  /config        # Configuraciones (BD, etc.)
  /utils         # Funciones reutilizables
```

---

## 🧪 Buenas prácticas

* Aprovechar TypeScript para prevenir errores
* Separación clara entre rutas, controladores y modelos
* Usar middlewares para validaciones y errores
* Documentar las nuevas rutas
* Agregar pruebas unitarias e integración

---

## 🔧 Cómo extender el proyecto

Puedes añadir:

* Sistema de autenticación (JWT, OAuth)
* Gestión de usuarios con roles
* Carrito de compras + pedidos
* Middlewares globales
* Pruebas automatizadas

---

## 📄 Licencia

Agrega la licencia que prefieras o indica si es un proyecto privado.

---
