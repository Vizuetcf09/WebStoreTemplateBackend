import express from 'express';
import ProductController from '../controllers/productController.js';
import { verifyAdmin } from '../middlewares/authTokenMiddleware.js';

const routes = express.Router();

routes.post('/', verifyAdmin, ProductController.createProduct);
routes.get('/', ProductController.getAll);
routes.get('/manage', verifyAdmin, ProductController.getManage);
routes.get('/:id', ProductController.getOne);
routes.put('/:id', verifyAdmin, ProductController.updateProduct);
routes.delete('/:id', verifyAdmin, ProductController.deleteProduct);

export default routes;
