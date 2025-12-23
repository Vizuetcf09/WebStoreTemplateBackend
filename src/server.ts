import express from 'express';
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import productRoutes from './routes/productRoutes.ts';
import MongoDBClient from './config/mongoDBClient.ts';
import paypalRoutes from './routes/paypalRoutes.ts'

const app = express();

// Middleware:Connect to MongoDB before processing requests
app.use(async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
  try {
    await MongoDBClient.connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Global middlewares
app.use(express.json());
app.use(cors({ origin: '*' }));
// Routes
app.use('/api/products', productRoutes);
app.use('/api/paypal', paypalRoutes);

// Server:Only start the server if this file is run directly (local development)
if (process.env.NODE_ENV !== 'production') {
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

// Test Rouet
app.get('/', (req: ExpressRequest, res: ExpressResponse) => {
  res.send('Hello, Web Page API!');
});

// Graceful shutdown management
process.on('SIGINT', async () => {
  await MongoDBClient.disconnectDB();
  process.exit(0);
});

export default app;