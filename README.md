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
- CRUD completo de productos (Create, Read, Update, Delete)
- Rutas y controladores preconfigurados para productos  
- Integración con MongoDB usando Mongoose y el driver oficial  
- Escrito totalmente en TypeScript  
- Configuración de variables de entorno con dotenv
- Soporte CORS para conexiones desde el frontend

📋 **Próximamente:**
- Sistema de autenticación (JWT, OAuth)
- Gestión de usuarios y roles
- Carrito de compras + gestión de pedidos
- Middlewares globales de validación y manejo de errores
- Pruebas unitarias e integración
- Documentación de API con Swagger/OpenAPI

---

## 🧰 Tecnologías / Stack (con versiones actuales)

| Tecnología      | Versión actual  | Versión recomendada |
|----------------|-----------------|----------------------|
| **Node.js**    | ^20.0.0         | ^20.0.0             |
| **TypeScript** | ^5.9.3          | ^5.0.0              |
| **Express**    | ^5.1.0          | ^4.18.0             |
| **MongoDB Driver** | ^7.0.0      | ^5.8.0              |
| **Mongoose**   | ^9.0.0          | ^8.0.0+             |
| **CORS**       | ^2.8.5          | ^2.8.5              |
| **dotenv**     | ^17.2.3         | ^16.0.0             |
| **Nodemon**    | ^3.1.10         | ^3.0.0+ (dev)       |
| **ts-node**    | ^10.9.2         | ^10.9.0+ (dev)      |
| **pnpm**       | ≥ 8.0           | ≥ 8.0               |

---

## 🚀 Instalación (desarrollo local)

```bash
# Clonar el repositorio
git clone https://github.com/Vizuetcf09/WebStoreTemplateBackend.git
cd WebStoreTemplateBackend

# Instalar dependencias
pnpm install   # o npm install

# Crear archivo .env (ver sección Variables de entorno)
# Editar con tus configuraciones

# Iniciar en modo desarrollo
pnpm dev       # o npm run dev
```

El servidor estará disponible en `http://localhost:4000`

---

## 📚 API Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **POST** | `/api/products` | Crear un nuevo producto |
| **GET** | `/api/products` | Obtener todos los productos |
| **GET** | `/api/products/:id` | Obtener un producto por ID |
| **PUT** | `/api/products/:id` | Actualizar un producto |
| **DELETE** | `/api/products/:id` | Eliminar un producto |

**Ejemplo de solicitud POST:**
```json
{
  "name": "Camiseta Básica Negra",
  "description": "Camiseta de algodón 100% premium, cómoda y duradera. Perfecta para uso diario",
  "price": 29.99,
  "category": "Camisetas",
  "stock": 50,
  "imageUrl": "https://example.com/images/camiseta-negra.jpg"
}
```

**Ejemplo de solicitud PUT:**
```json
{
  "name": "Camiseta Premium Negra",
  "description": "Camiseta de algodón 100% premium, cómoda y duradera. Tejido de alta calidad con acabado profesional",
  "price": 34.99,
  "category": "Camisetas Premium",
  "stock": 35,
  "imageUrl": "https://example.com/images/camiseta-premium-negra.jpg"
}
```

**Ejemplos de respuesta:**

GET `/api/products`:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Camiseta Básica Negra",
    "description": "Camiseta de algodón 100% premium, cómoda y duradera. Perfecta para uso diario",
    "price": 29.99,
    "category": "Camisetas",
    "stock": 50,
    "imageUrl": "https://example.com/images/camiseta-negra.jpg",
    "createdAt": "2025-12-23T10:30:00.000Z",
    "updatedAt": "2025-12-23T10:30:00.000Z",
    "__v": 0
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Pantalón Denim Azul",
    "description": "Pantalón denim clásico, cómodo y versátil. Ideal para cualquier ocasión",
    "price": 59.99,
    "category": "Pantalones",
    "stock": 30,
    "imageUrl": "https://example.com/images/pantalon-denim.jpg",
    "createdAt": "2025-12-23T10:32:00.000Z",
    "updatedAt": "2025-12-23T10:32:00.000Z",
    "__v": 0
  }
]
```

GET `/api/products/:id`:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Camiseta Básica Negra",
  "description": "Camiseta de algodón 100% premium, cómoda y duradera. Perfecta para uso diario",
  "price": 29.99,
  "category": "Camisetas",
  "stock": 50,
  "imageUrl": "https://example.com/images/camiseta-negra.jpg",
  "createdAt": "2025-12-23T10:30:00.000Z",
  "updatedAt": "2025-12-23T10:30:00.000Z",
  "__v": 0
}
```

POST `/api/products` (Respuesta - 201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Camiseta Básica Negra",
  "description": "Camiseta de algodón 100% premium, cómoda y duradera. Perfecta para uso diario",
  "price": 29.99,
  "category": "Camisetas",
  "stock": 50,
  "imageUrl": "https://example.com/images/camiseta-negra.jpg",
  "createdAt": "2025-12-23T10:35:00.000Z",
  "updatedAt": "2025-12-23T10:35:00.000Z",
  "__v": 0
}
```

PUT `/api/products/:id` (Respuesta - 200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Camiseta Premium Negra",
  "description": "Camiseta de algodón 100% premium, cómoda y duradera. Tejido de alta calidad con acabado profesional",
  "price": 34.99,
  "category": "Camisetas Premium",
  "stock": 35,
  "imageUrl": "https://example.com/images/camiseta-premium-negra.jpg",
  "createdAt": "2025-12-23T10:30:00.000Z",
  "updatedAt": "2025-12-23T10:35:30.000Z",
  "__v": 0
}
```

DELETE `/api/products/:id` (Respuesta - 200 OK):
```json
{
  "message": "Producto eliminado correctamente",
  "_id": "507f1f77bcf86cd799439011"
}
```

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
  /config        # Configuraciones (MongoDB, variables, etc.)
    └─ mongoDBClient.ts
  /controllers   # Lógica de negocio (CRUD operations)
    └─ productController.ts
  /models        # Modelos de datos y operaciones con BD
    └─ productModels.ts
  /routes        # Endpoints de la API
    └─ productRoutes.ts
  /schemas       # Esquemas de validación
    └─ productSchemas.ts
  /types         # TypeScript types e interfaces
    └─ productTypes.ts
  server.ts      # Entrada principal de la aplicación
```

---

## 🧪 Buenas prácticas

* Aprovecha TypeScript para prevenir errores en tiempo de compilación
* Mantén la separación clara entre rutas, controladores y modelos
* Usa middlewares para validaciones y manejo de errores
* Documenta las nuevas rutas en este README
* Agrega pruebas unitarias e integración cuando sea posible
* Sigue las convenciones de nombres (camelCase para variables/funciones)
* Valida los datos de entrada en los controllers
* Maneja los errores de forma consistente

---

## 🔧 Cómo extender el proyecto

### 1. Agregar un nuevo módulo (ej: Orders)

Crea la siguiente estructura:
```bash
/src
  /controllers/orderController.ts
  /models/orderModels.ts
  /routes/orderRoutes.ts
  /schemas/orderSchemas.ts
  /types/orderTypes.ts
```

### 2. Registrar las nuevas rutas en server.ts
```typescript
import orderRoutes from './routes/orderRoutes.ts';
app.use('/api/orders', orderRoutes);
```

### 3. Funcionalidades prioritarias para agregar:

- **Autenticación (JWT):** Protege tus endpoints con tokens JWT
- **Usuarios:** Modelo de usuarios con hashing de contraseñas (bcrypt)
- **Validación:** Implementa validaciones con bibliotecas como Joi o Zod
- **Middlewares globales:** Manejo centralizado de errores y autenticación
- **Testing:** Pruebas con Jest o Vitest
- **Documentación API:** Integra Swagger/OpenAPI

---

## 📄 Licencia

ISC (actual) - Puedes cambiar esta licencia según tus preferencias.

---

## 🤝 Contribuciones

Este es un template base. Siéntete libre de modificarlo y adaptarlo a tus necesidades.

## 📞 Soporte

Para reportar bugs o sugerencias, abre un issue en el repositorio.

---
