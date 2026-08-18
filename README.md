# WebStore Backend API 🛒

🌐 **Idiomas disponibles:**  
- 🇪🇸 Español  
- 🇺🇸 [Inglés](README.en.md)  

REST API robusta y escalable construida con **Node.js, Express y TypeScript** sobre **MongoDB**. Este backend actúa como el motor central para el E-Commerce **Web Store**, proporcionando autenticación segura de usuarios, gestión completa del catálogo de productos, sincronización automática con **Printful** y procesamiento de pagos con **PayPal**.

---

## 📌 Características Principales

- 🏗 **Arquitectura MVC Modular:** Separación clara entre rutas, controladores, servicios y modelos.
- 📦 **CRUD de Productos:** Gestión de catálogo general y variantes avanzadas (tallas, colores, stock, mockups).
- 🔄 **Sincronización Printful API:** Ingesta de productos desde Printful hacia MongoDB (individual o masiva), cotización de envíos y creación de órdenes de impresión.
- 💳 **Integración PayPal:** Flujo completo de checkout, captura de órdenes y redirección de pagos.
- 🔐 **Autenticación & Seguridad:** Registro e inicio de sesión con encriptación **Bcrypt** y emisión de tokens **JWT**.
- 🛡 **Validación de Datos:** Uso de esquemas **Zod** para la validación estricta de payloads.
- 🚀 **Listo para Despliegue Serverless:** Configurado para **Vercel** con `vercel.json` y manejo de conexión persistente a MongoDB Atlas.

---

## 🧰 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | ^20.0.0 | Entorno de ejecución de JavaScript |
| **TypeScript** | ^5.7.3 | Tipado estático y desarrollo robusto |
| **Express** | ^4.21.2 | Framework de servidor HTTP |
| **MongoDB Driver / Mongoose** | ^6.13.0 / ^8.10.0 | ODM y driver de base de datos NoSQL |
| **Zod** | ^3.24.2 | Validación de esquemas en runtime |
| **JSONWebToken** | ^9.0.2 | Autenticación basada en JWT |
| **BcryptJS** | ^3.0.3 | Hashing de contraseñas de usuarios |
| **Axios** | ^1.7.9 | Cliente HTTP para consumir APIs de Printful y PayPal |
| **CORS / Dotenv** | ^2.8.5 / ^16.4.7 | Seguridad de origen cruzado y variables de entorno |

---

## ⚙️ Variables de Entorno (.env)

Crea un archivo `.env` en la raíz de la carpeta `backend/` con las siguientes variables:

```env
# Servidor local
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:4200,https://angularwebstore.vercel.app

# Base de Datos MongoDB Atlas
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/WebStoreDB?retryWrites=true&w=majority

# Autenticación JWT
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui

# Integración Printful
PRINTFUL_API_KEY=tu_api_key_de_printful
PRINTFUL_STORE_ID=tu_store_id_de_printful

# Integración PayPal
PAYPAL_CLIENT_ID=tu_client_id_de_paypal
PAYPAL_CLIENT_SECRET=tu_client_secret_de_paypal
PAYPAL_MODE=sandbox # 'sandbox' o 'live'
```

---

## 📂 Estructura del Código Source (`/src`)

```bash
src/
├── config/
│   └── mongoDBClient.ts          # Singleton de conexión y desconexión a MongoDB
├── controllers/
│   ├── paypalController.ts       # Controladores de checkout de PayPal
│   ├── printfulController.ts     # Controladores para productos y órdenes Printful
│   ├── productController.ts      # Controladores CRUD de productos generales
│   └── userController.ts         # Controladores de registro y login de usuario
├── helpers/
│   └── authJWT.ts                # Funciones auxiliares para firmar/verificar JWT
├── middlewares/
│   ├── authTokenMiddleware.ts    # Middleware para proteger rutas mediante JWT
│   └── mongoDBMiddleware.ts      # Middleware para asegurar conexión a la DB
├── models/
│   ├── paypalModels.ts           # Modelo de órdenes de PayPal
│   ├── printfulModels.ts         # Modelo de tokens/credenciales Printful
│   ├── productModels.ts          # Métodos de acceso a datos para productos
│   └── userModels.ts             # Métodos de acceso a datos para usuarios
├── routes/
│   ├── paypalRoutes.ts           # Endpoints /api/paypal
│   ├── printfulRoutes.ts         # Endpoints /api/printful
│   ├── productRoutes.ts          # Endpoints /api/products
│   └── userRoutes.ts             # Endpoints /api/user
├── schemas/
│   ├── printfulSchemas.js        # Validaciones Zod para envíos y órdenes
│   ├── productSchemas.ts         # Esquemas Mongoose de Producto y Variantes
│   └── userSchemas.ts            # Esquemas Mongoose de Usuario
├── services/
│   ├── paypalService.ts          # Integración directa con la API REST de PayPal
│   └── printfulService.ts        # Servicio para llamadas y sync con Printful API
├── types/                        # Interfaces y tipos TypeScript
└── server.ts                     # Punto de entrada y configuración de Express
```

---

## 📚 Especificación de Endpoints de la API

### 1. 📦 Productos (`/api/products`)

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| **GET** | `/api/products` | Pública | Obtiene la lista completa de productos en MongoDB |
| **GET** | `/api/products/:id` | Pública | Obtiene un producto por su `_id` de MongoDB |
| **POST** | `/api/products` | 🔒 Requiere JWT | Crea un nuevo producto manualmente |
| **PUT** | `/api/products/:id` | 🔒 Requiere JWT | Actualiza la información de un producto existente |
| **DELETE** | `/api/products/:id` | 🔒 Requiere JWT | Elimina un producto por ID |

#### Ejemplo Payload POST `/api/products`:
```json
{
  "name": "Sudadera Hoodie Web Store",
  "description": "Sudadera de algodón con gorro y estampado frontal de alta calidad",
  "price": 45.99,
  "category": "Sudaderas",
  "stock": 25,
  "imageUrl": "https://example.com/images/hoodie-black.jpg",
  "variants": [
    {
      "variantId": 10201,
      "name": "Negro / M",
      "size": "M",
      "color": "Black",
      "price": 45.99,
      "inStock": true,
      "previewUrl": "https://example.com/images/hoodie-black-m.jpg"
    }
  ]
}
```

---

### 2. 🔐 Autenticación y Usuarios (`/api/user`)

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| **POST** | `/api/user/register` | Pública | Registra un nuevo usuario en el sistema |
| **POST** | `/api/user/login` | Pública | Autentica a un usuario y genera un Bearer JWT |

#### Ejemplo POST `/api/user/register`:
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "PasswordSeguro123"
}
```

#### Respuesta POST `/api/user/login` (200 OK):
```json
{
  "message": "Login successful",
  "userId": "65cb7891f2e10a8b94123456",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. 👕 Integración Printful (`/api/printful`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/printful/products` | Lista los productos directamente desde la API de Printful |
| **GET** | `/api/printful/products/:id` | Obtiene los detalles y variantes de un producto Printful |
| **POST** | `/api/printful/products/:id/sync` | Sincroniza un producto de Printful con MongoDB con sus variantes y precios |
| **POST** | `/api/printful/products/sync-all` | Sincronización masiva de todos los productos de Printful a MongoDB |
| **POST** | `/api/printful/shipping` | Calcula el costo estimado de envío para una lista de productos y dirección |
| **POST** | `/api/printful/orders` | Crea una orden de impresión en Printful |
| **GET** | `/api/printful/orders/:id` | Obtiene el estado de una orden en Printful |
| **DELETE** | `/api/printful/orders/:id` | Cancela una orden de Printful |

#### Ejemplo POST `/api/printful/shipping`:
```json
{
  "to": {
    "name": "Cliente Ejemplo",
    "address1": "Av. Insurgentes Sur 123",
    "city": "Ciudad de México",
    "state_code": "CMX",
    "country_code": "MX",
    "zip": "03100",
    "email": "cliente@example.com"
  },
  "items": [
    {
      "variant_id": 10201,
      "quantity": 1
    }
  ]
}
```

---

### 4. 💳 Pagos PayPal (`/api/paypal`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **POST** | `/api/paypal/create-order` | Crea una orden en PayPal y genera el enlace de aprobación |
| **GET** | `/api/paypal/complete-order` | Captura el pago tras ser aprobado por el comprador y redirige al Frontend (`/checkout/success`) |
| **GET** | `/api/paypal/cancel-order` | Maneja la cancelación por parte del usuario y redirige a (`/checkout/cancel`) |

#### Ejemplo POST `/api/paypal/create-order`:
```json
{
  "productName": "Sudadera Hoodie Web Store",
  "productPrice": 45.99,
  "currency": "USD"
}
```

---

## 🗄 Esquema de Base de Datos (Mongoose)

### Esquema de Producto (`ProductSchema`)
```typescript
{
  printfulId?: number,       // ID del producto en Printful
  externalId?: string,       // ID externo
  name: string,             // Nombre del producto
  description: string,      // Descripción detallada
  price: number,            // Precio base de venta
  category: string,         // Categoría
  stock: number,            // Stock disponible
  imageUrl: string,         // Imagen principal
  variants: [               // Lista de variantes de Printful
    {
      variantId: number,    // ID numérico de variante Printful
      externalId?: string,
      name?: string,        // Ej: "Blanco / M"
      size?: string,        // Ej: "M"
      color?: string,       // Ej: "White"
      price: number,        // Precio específico de la variante
      inStock: boolean,     // Estado del inventario
      previewUrl?: string   // URL del mockup específico
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Despliegue en Vercel (Serverless)

El proyecto incluye el archivo `vercel.json` configurado para compilar la aplicación TypeScript e invocar `dist/server.js` como una función Serverless.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

Para desplegar manualmente usando Vercel CLI:
```bash
pnpm build
vercel --prod
```

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **ISC**.
