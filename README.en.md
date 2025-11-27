# WebStoreTemplateBackend 🛒

🌐 **Available languages:** 

- 🇪🇸 [Español](README.md)
- 🇺🇸 English 

Backend template built in TypeScript for an online store, using an MVC architecture on **Express + MongoDB**.  
Includes product routes/controllers, database configuration, and a clean structure designed to scale into users, authentication, orders, and more.

---

## 📝 About this template

This backend template is designed to provide a clean and scalable starting point for a modern online store using Node.js, TypeScript, and MongoDB.

---

## 📌 Main Features

- Modular MVC-based architecture  
- Preconfigured product routes and controllers  
- MongoDB integration using the official driver  
- Fully written in TypeScript  
- Scalable foundation for additional modules (users, auth, orders, etc.)

---

## 🧰 Tech Stack (with suggested versions)

| Technology        | Suggested version |
|------------------|-------------------|
| **Node.js**      | ^20.0.0           |
| **TypeScript**   | ^5.0.0            |
| **Express**      | ^4.18.0           |
| **MongoDB Driver** | ^5.8.0         |
| **dotenv**       | ^16.0.0           |
| **pnpm**         | ≥ 8.0             |
| **npm**          | ≥ 9.0             |

---

## 🚀 Installation (local development)

```bash
# Clone the repository
git clone https://github.com/Vizuetcf09/WebStoreTemplateBackend.git
cd WebStoreTemplateBackend

# Install dependencies
pnpm install   # or npm install

# Start development server
pnpm dev       # or npm run dev
````

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
  /controllers   # Business logic
  /models        # Schemas / data models
  /routes        # API endpoints
  /config        # Configuration (DB, etc.)
  /utils         # Reusable helpers
```

---

## 🧪 Best Practices

* Use TypeScript to improve reliability and maintainability
* Keep routes, controllers, and models clearly separated
* Implement middlewares for validation and error handling
* Add documentation for new routes
* Add tests (Jest / Vitest) for new features

---

## 🔧 How to extend the project

Possible extensions:

* Authentication system (JWT, OAuth)
* User management (roles, permissions)
* Shopping cart + orders module
* Global middlewares (logging, validation, security)
* Unit and integration tests

---

## 📄 License

Include your preferred license (MIT, Apache 2.0, GPL, etc.) or indicate if it's private.

---
