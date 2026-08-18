import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import productRoutes from './routes/productRoutes.js';
import paypalRoutes from './routes/paypalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import printfulRoutes from './routes/printfulRoutes.js';
import MongoDBClient from './config/mongoDBClient.js';
import mongoDBMiddleware from './middlewares/mongoDBMiddleware.js';

const app = express();

// Global middlewares
app.use(express.json());

// Cors allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.trim().replace(/\/$/, '');
      const isAllowed = allowedOrigins.includes(cleanOrigin);
      const isLocal = cleanOrigin.includes('localhost') || cleanOrigin.includes('127.0.0.1');

      if (isAllowed || isLocal) {
        return callback(null, true);
      } else {
        console.error(`CORS Bloqueado. Origen recibido: "${cleanOrigin}"`);
        console.error(`Orígenes permitidos:`, allowedOrigins);
        return callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);
app.options('*', cors());

// Routes
app.use('/api/products', mongoDBMiddleware, productRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/user', userRoutes);
app.use('/api/printful', printfulRoutes);

// Test & Healthcheck Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Web Page API!');
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Server local
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      const PORT = process.env.PORT || 3000;
      await MongoDBClient.connectDB();

      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Error loading environment variables:', error);
    }
  };

  startServer();
}

// Graceful shutdown management
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await MongoDBClient.disconnectDB();
  process.exit(0);
});

export default app;