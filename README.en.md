# WebStore Backend API 🛒

🌐 **Available Languages:**  
- 🇺🇸 English  
- 🇪🇸 [Español](README.md)  

A robust and scalable REST API built with **Node.js, Express, and TypeScript** on top of **MongoDB**. This backend serves as the core engine for the **Web Store** E-Commerce platform, delivering secure user authentication, product catalog management, automatic synchronization with **Printful**, and payment processing via **PayPal**.

---

## 📌 Main Features

- 🏗 **Modular MVC Architecture:** Clean separation of routes, controllers, services, and models.
- 📦 **Product CRUD Operations:** Complete catalog management supporting advanced variants (sizes, colors, stock, variant mockups).
- 🔄 **Printful API Synchronization:** Ingest products from Printful into MongoDB (individual or bulk), calculate shipping rates, and submit fulfillment orders.
- 💳 **PayPal Integration:** Complete checkout flow, order capture, and payment redirection.
- 🔐 **Authentication & Security:** User registration and login using **Bcrypt** hashing and **JWT** token generation.
- 🛡 **Data Validation:** Strict payload parsing using **Zod** schemas.
- 🚀 **Serverless Ready:** Pre-configured for **Vercel** serverless deployment with `vercel.json` and persistent MongoDB Atlas connection handling.

---

## 🧰 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ^20.0.0 | JavaScript runtime environment |
| **TypeScript** | ^5.7.3 | Static typing and robust development |
| **Express** | ^4.21.2 | HTTP Web Framework |
| **MongoDB Driver / Mongoose** | ^6.13.0 / ^8.10.0 | NoSQL database driver and ODM |
| **Zod** | ^3.24.2 | Runtime schema validation |
| **JSONWebToken** | ^9.0.2 | JWT-based authentication |
| **BcryptJS** | ^3.0.3 | Password hashing for users |
| **Axios** | ^1.7.9 | HTTP client for Printful and PayPal APIs |
| **CORS / Dotenv** | ^2.8.5 / ^16.4.7 | Cross-origin resource sharing & environment configuration |

---

## ⚙️ Environment Variables (.env)

Create a `.env` file in the root of the `backend/` directory with the following variables:

```env
# Local Server Configuration
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:4200,https://angularwebstore.vercel.app

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/WebStoreDB?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secure_jwt_secret_here

# Printful API Credentials
PRINTFUL_API_KEY=your_printful_api_key
PRINTFUL_STORE_ID=your_printful_store_id

# PayPal API Credentials
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox # 'sandbox' or 'live'
```

---

## 📂 Source Code Structure (`/src`)

```bash
src/
├── config/
│   └── mongoDBClient.ts          # Singleton for connecting/disconnecting MongoDB
├── controllers/
│   ├── paypalController.ts       # PayPal checkout controllers
│   ├── printfulController.ts     # Printful products & order controllers
│   ├── productController.ts      # General product CRUD controllers
│   └── userController.ts         # User registration and login controllers
├── helpers/
│   └── authJWT.ts                # JWT signing and verification helpers
├── middlewares/
│   ├── authTokenMiddleware.ts    # Middleware to protect routes via JWT
│   └── mongoDBMiddleware.ts      # Middleware ensuring active DB connection
├── models/
│   ├── paypalModels.ts           # PayPal order data access
│   ├── printfulModels.ts         # Printful token/credentials data access
│   ├── productModels.ts          # Product data access methods
│   └── userModels.ts             # User data access methods
├── routes/
│   ├── paypalRoutes.ts           # /api/paypal endpoints
│   ├── printfulRoutes.ts         # /api/printful endpoints
│   ├── productRoutes.ts          # /api/products endpoints
│   └── userRoutes.ts             # /api/user endpoints
├── schemas/
│   ├── printfulSchemas.js        # Zod validation for shipping & orders
│   ├── productSchemas.ts         # Mongoose Product & Variant schemas
│   └── userSchemas.ts            # Mongoose User schema
├── services/
│   ├── paypalService.ts          # Direct integration with PayPal REST API
│   └── printfulService.ts        # Printful API service and database sync logic
├── types/                        # TypeScript types and interface definitions
└── server.ts                     # Express app setup and main entry point
```

---

## 📚 API Endpoints Specification

### 1. 📦 Products (`/api/products`)

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| **GET** | `/api/products` | Public | Retrieve all products in MongoDB |
| **GET** | `/api/products/:id` | Public | Retrieve a single product by MongoDB `_id` |
| **POST** | `/api/products` | 🔒 Requires JWT | Create a new product manually |
| **PUT** | `/api/products/:id` | 🔒 Requires JWT | Update an existing product |
| **DELETE** | `/api/products/:id` | 🔒 Requires JWT | Delete a product by ID |

#### Example Payload POST `/api/products`:
```json
{
  "name": "Web Store Hoodie",
  "description": "Premium cotton hoodie with high quality front graphic",
  "price": 45.99,
  "category": "Hoodies",
  "stock": 25,
  "imageUrl": "https://example.com/images/hoodie-black.jpg",
  "variants": [
    {
      "variantId": 10201,
      "name": "Black / M",
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

### 2. 🔐 Authentication & Users (`/api/user`)

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| **POST** | `/api/user/register` | Public | Register a new user in the system |
| **POST** | `/api/user/login` | Public | Authenticate a user and return a Bearer JWT |

#### Example POST `/api/user/register`:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### Response POST `/api/user/login` (200 OK):
```json
{
  "message": "Login successful",
  "userId": "65cb7891f2e10a8b94123456",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. 👕 Printful Integration (`/api/printful`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/printful/products` | Fetch products directly from Printful API |
| **GET** | `/api/printful/products/:id` | Get details and variants of a specific Printful product |
| **POST** | `/api/printful/products/:id/sync` | Sync a Printful product and its variants into MongoDB |
| **POST** | `/api/printful/products/sync-all` | Bulk sync all Printful store products to MongoDB |
| **POST** | `/api/printful/shipping` | Calculate shipping cost estimates for recipient address |
| **POST** | `/api/printful/orders` | Submit a print fulfillment order to Printful |
| **GET** | `/api/printful/orders/:id` | Fetch Printful order status by ID |
| **DELETE** | `/api/printful/orders/:id` | Cancel a Printful fulfillment order |

---

### 4. 💳 PayPal Payments (`/api/paypal`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/paypal/create-order` | Create a PayPal order and return approval redirection URL |
| **GET** | `/api/paypal/complete-order` | Capture payment after user approval and redirect to Frontend (`/checkout/success`) |
| **GET** | `/api/paypal/cancel-order` | Handle buyer cancellation and redirect to Frontend (`/checkout/cancel`) |

---

## 🗄 Database Schemas (Mongoose)

### Product Schema (`ProductSchema`)
```typescript
{
  printfulId?: number,       // Printful Product ID
  externalId?: string,       // External reference ID
  name: string,             // Product display name
  description: string,      // Detailed product description
  price: number,            // Base retail price
  category: string,         // Category name
  stock: number,            // General stock quantity
  imageUrl: string,         // Main image URL
  variants: [               // List of Printful product variants
    {
      variantId: number,    // Printful variant ID
      externalId?: string,
      name?: string,        // e.g. "White / M"
      size?: string,        // e.g. "M"
      color?: string,       // e.g. "White"
      price: number,        // Specific variant price
      inStock: boolean,     // Stock availability
      previewUrl?: string   // Specific variant mockup image URL
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment on Vercel (Serverless)

The project includes `vercel.json` configured to compile TypeScript and execute `dist/server.js` as a Vercel Serverless Function.

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

Deploying via Vercel CLI:
```bash
pnpm build
vercel --prod
```

---

## 📄 License

This project is licensed under the **ISC License**.
