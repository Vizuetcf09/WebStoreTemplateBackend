# WebStoreTemplateBackend 🛒

🌐 **Available languages:** 

- 🇺🇸 English 
- 🇪🇸 [Español](README.md)

Backend template built in TypeScript for an online store, using an MVC architecture on **Express + MongoDB**.  
Includes product routes/controllers, database configuration, and a clean structure designed to scale into users, authentication, orders, and more.

---

## 📝 About this template

This backend template is designed to provide a clean and scalable starting point for a modern online store using Node.js, TypeScript, and MongoDB.

---

## 📌 Main Features

- Modular MVC-based architecture  
- Full CRUD for products (Create, Read, Update, Delete)
- Preconfigured product routes and controllers  
- MongoDB integration using Mongoose and official driver  
- Fully written in TypeScript  
- Environment variables configuration with dotenv
- CORS support for frontend connections

📋 **Coming Soon:**
- Authentication system (JWT, OAuth)
- User management with roles
- Shopping cart + order management
- Global middlewares for validation and error handling
- Unit and integration tests
- API documentation with Swagger/OpenAPI

---

## 🧰 Tech Stack (current versions)

| Technology        | Current version | Suggested version |
|------------------|-----------------|-------------------|
| **Node.js**      | ^20.0.0         | ^20.0.0           |
| **TypeScript**   | ^5.9.3          | ^5.0.0            |
| **Express**      | ^5.1.0          | ^4.18.0           |
| **MongoDB Driver** | ^7.0.0        | ^5.8.0            |
| **Mongoose**     | ^9.0.0          | ^8.0.0+           |
| **CORS**         | ^2.8.5          | ^2.8.5            |
| **dotenv**       | ^17.2.3         | ^16.0.0           |
| **Nodemon**      | ^3.1.10         | ^3.0.0+ (dev)     |
| **ts-node**      | ^10.9.2         | ^10.9.0+ (dev)    |
| **pnpm**         | ≥ 8.0           | ≥ 8.0             |

---

## 🚀 Installation (local development)

```bash
# Clone the repository
git clone https://github.com/Vizuetcf09/WebStoreTemplateBackend.git
cd WebStoreTemplateBackend

# Install dependencies
pnpm install   # or npm install

# Create .env file (see Environment variables section)
# Edit with your configurations

# Start development server
pnpm dev       # or npm run dev
```

The server will be available at `http://localhost:4000`

---

## 📚 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/products` | Create a new product |
| **GET** | `/api/products` | Get all products |
| **GET** | `/api/products/:id` | Get a product by ID |
| **PUT** | `/api/products/:id` | Update a product |
| **DELETE** | `/api/products/:id` | Delete a product |

**Example POST/PUT request:**
```json
{
  "name": "Gaming Laptop",
  "price": 999.99,
  "description": "High-performance gaming laptop",
  "stock": 10
}
```

---

## ⚙️ Environment variables

Create a **.env** file in the project root:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/YourDatabaseName
```

---

## 📂 Project Structure

```bash
/src
  /config        # Configuration (MongoDB, variables, etc.)
    └─ mongoDBClient.ts
  /controllers   # Business logic (CRUD operations)
    └─ productController.ts
  /models        # Data models and database operations
    └─ productModels.ts
  /routes        # API endpoints
    └─ productRoutes.ts
  /schemas       # Validation schemas
    └─ productSchemas.ts
  /types         # TypeScript types and interfaces
    └─ productTypes.ts
  server.ts      # Application entry point
```

---

## 🧪 Best Practices

* Use TypeScript to prevent errors at compile time
* Maintain clear separation between routes, controllers, and models
* Use middlewares for validation and error handling
* Document new routes in this README
* Add unit and integration tests when possible
* Follow naming conventions (camelCase for variables/functions)
* Validate input data in controllers
* Handle errors consistently

---

## 🔧 How to extend the project

### 1. Add a new module (ex: Orders)

Create the following structure:
```bash
/src
  /controllers/orderController.ts
  /models/orderModels.ts
  /routes/orderRoutes.ts
  /schemas/orderSchemas.ts
  /types/orderTypes.ts
```

### 2. Register new routes in server.ts
```typescript
import orderRoutes from './routes/orderRoutes.ts';
app.use('/api/orders', orderRoutes);
```

### 3. Priority features to add:

- **Authentication (JWT):** Protect your endpoints with JWT tokens
- **Users:** User model with password hashing (bcrypt)
- **Validation:** Implement validation with libraries like Joi or Zod
- **Global Middlewares:** Centralized error handling and authentication
- **Testing:** Tests with Jest or Vitest
- **API Documentation:** Integrate Swagger/OpenAPI

---

## 📄 License

ISC (current) - You can change this license according to your preferences.

---

## 🤝 Contributing

This is a base template. Feel free to modify and adapt it to your needs.

## 📞 Support

To report bugs or suggestions, open an issue in the repository.

---
