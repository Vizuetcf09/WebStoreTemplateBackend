import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import productRoutes from './routes/productRoutes.js';
import paypalRoutes from './routes/paypalRoutes.js'
import MongoDBClient from './config/mongoDBClient.js';
import mongoDBMiddleware from './middlewares/mongoDBMiddleware.js';

const app = express();

// Global middlewares
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(mongoDBMiddleware);
// Routes
app.use('/api/products', productRoutes);
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
  await MongoDBClient.disconnectDB();
  process.exit(0);
});

export default app;
