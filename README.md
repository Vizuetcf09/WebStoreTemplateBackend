# 📄 Documentación del Servidor Express con TypeScript y dotenv

Este código implementa un servidor básico utilizando **Express**, con soporte para **variables de entorno** mediante `dotenv`. El servidor expone una única ruta (`/`) que devuelve un mensaje simple.

---

## 🚀 Características principales

* Carga automática de variables de entorno desde un archivo `.env`.
* Configuración de un servidor Express.
* Manejo básico de errores al cargar el puerto.
* Ruta principal (`/`) que responde con "Hello, World!".

---

## 📦 Dependencias utilizadas

* **express**: Framework para crear el servidor web.
* **dotenv**: Permite usar variables de entorno definidas en un archivo `.env`.
* **TypeScript**: Proporciona tipado estático y mejor mantenimiento del código.

---

## 🧩 Explicación del código

### 1. Importaciones

```ts
import express from 'express';
import 'dotenv/config';
```

* Se importa Express.
* `dotenv/config` carga automáticamente las variables definidas en `.env`.

---

### 2. Inicialización de Express

```ts
const app: express.Application = express();
```

Se crea la aplicación principal del servidor usando las definiciones de tipo de Express para mejor soporte en TypeScript.

---

### 3. Configuración del puerto

```ts
const PORT = process.env.PORT || 3000;
```

* Primero intenta usar el puerto definido en el archivo `.env`.
* Si no existe, usa el puerto `3000` por defecto.

---

### 4. Inicio del servidor

```ts
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

Levanta el servidor y muestra un mensaje confirmando la URL donde está activo.

---

### 5. Manejo de errores

```ts
} catch (error) {
  console.error('Error loading environment variables:', error);
}
```

En caso de fallos al cargar dotenv o al configurar el servidor, se captura y muestra el error.

---

### 6. Ruta principal

```ts
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
```

Ruta GET básica que responde con un texto simple.

---

### 7. Exportación

```ts
export default app;
```

Permite reutilizar la aplicación (por ejemplo, para pruebas automáticas).

---

## 📁 Ejemplo del archivo `.env`

```
PORT=4000
```

---

## ▶️ Cómo ejecutar el servidor

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env`:

```bash
echo "PORT=4000" > .env
```

3. Ejecuta el servidor:

```bash
npm run dev
```

O si usas Node directamente:

```bash
node dist/app.js
```
