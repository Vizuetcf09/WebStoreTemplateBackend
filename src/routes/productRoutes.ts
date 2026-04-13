import express from 'express';
import ProductController from '../controllers/productController.js';
import { verifyToken } from '../middlewares/authTokenMiddleware.js';

const routes = express.Router();

// Product routes

routes.post('/', verifyToken, ProductController.createProduct); // TODO:private route, requires authentication
routes.get('/', ProductController.getAll);
routes.get('/:id', ProductController.getOne);
routes.put('/:id', verifyToken, ProductController.updateProduct); // TODO:private route, requires authentication
routes.delete('/:id', verifyToken, ProductController.deleteProduct); // TODO:private route, requires authentication

export default routes;