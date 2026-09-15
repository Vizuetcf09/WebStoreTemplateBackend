import { Router } from 'express';
import { printfulController } from '../controllers/printfulController.js';
import { verifyAdmin } from '../middlewares/authTokenMiddleware.js';

const printfulRouter = Router();

printfulRouter.get('/status', printfulController.getStatus);
printfulRouter.get('/products', printfulController.getProducts);
printfulRouter.post('/products/import', verifyAdmin, printfulController.importProducts);
printfulRouter.get('/products/sync-all', verifyAdmin, printfulController.syncAllProducts);
printfulRouter.post('/products/sync-all', verifyAdmin, printfulController.syncAllProducts);
printfulRouter.get('/products/:id/sync', verifyAdmin, printfulController.syncProduct);
printfulRouter.post('/products/:id/sync', verifyAdmin, printfulController.syncProduct);
printfulRouter.get('/products/:id', printfulController.getProduct);

printfulRouter.post('/shipping', printfulController.calculateShipping);

printfulRouter.post('/orders', printfulController.createOrder);
printfulRouter.get('/orders/:id', printfulController.getOrder);
printfulRouter.delete('/orders/:id', printfulController.cancelOrder);

export default printfulRouter;
