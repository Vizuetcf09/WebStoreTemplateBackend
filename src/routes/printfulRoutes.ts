import { Router } from 'express';
import { printfulController } from '../controllers/printfulController.js';

const printfulRouter = Router();

// Productos
printfulRouter.get('/products', printfulController.getProducts);
printfulRouter.get('/products/sync-all', printfulController.syncAllProducts);
printfulRouter.post('/products/sync-all', printfulController.syncAllProducts);
printfulRouter.get('/products/:id/sync', printfulController.syncProduct);
printfulRouter.post('/products/:id/sync', printfulController.syncProduct);
printfulRouter.get('/products/:id', printfulController.getProduct);

// Envíos
printfulRouter.post('/shipping', printfulController.calculateShipping);

// Órdenes
printfulRouter.post('/orders', printfulController.createOrder);
printfulRouter.get('/orders/:id', printfulController.getOrder);
printfulRouter.delete('/orders/:id', printfulController.cancelOrder);

export default printfulRouter;