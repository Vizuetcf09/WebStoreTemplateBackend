import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import productRoutes from './routes/productRoutes.js';
import paypalRoutes from './routes/paypalRoutes.js'
import MongoDBClient from './config/mongoDBClient.js';
import mongoDBMiddleware from './middlewares/mongoDBMiddleware.js';

const app = express();

const allowedOrigins = [
  "https://frontendwebpage.vercel.app",
];

// Global middlewares
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options('*', cors());
// Routes
app.use('/api/products', mongoDBMiddleware, productRoutes);
app.use('/api/paypal', paypalRoutes)

// Server:Only start the server if this file is run directly (local development)
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
  }

  startServer();
};

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Web Page API!');
});

// Graceful shutdown management
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await MongoDBClient.disconnectDB();
  process.exit(0);
});

export default app;
