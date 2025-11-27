import express from 'express';
import 'dotenv/config';
import productRoutes from './routes/productRoutes.ts';
import MongoDBClient from './config/mongoDBClient.ts';

const app: express.Application = express();

app.use(express.json());
app.use('/api/products', productRoutes)

try {
  const PORT = process.env.PORT || 3000;

  await MongoDBClient.connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}.`);
  });

} catch (error) {
  console.error('Error loading environment variables:', error);
}

app.get('/', (req, res) => {
  res.send('Hello, Web Page API!');
});

process.on('SIGINT', async () => {
  await MongoDBClient.disconnectDB();
  process.exit(0);
});

export default app;