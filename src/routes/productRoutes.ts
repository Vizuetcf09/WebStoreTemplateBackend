import express from "express";
import ProductController from "../controllers/productController.js";

const routes = express.Router();

// Product routes

routes.post('/', ProductController.createProduct);
routes.get('/', ProductController.getAll);
routes.get('/:id', ProductController.getOne);
routes.put('/:id', ProductController.updateProduct);
routes.delete('/:id', ProductController.deleteProduct);

export default routes;