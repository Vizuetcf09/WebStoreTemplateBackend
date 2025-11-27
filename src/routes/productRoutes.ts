import express, { Router } from "express";
import ProductController from "../controllers/productController.ts";

const routes: Router = express.Router();

// Product routes

routes.post('/', ProductController.createProduct);
routes.get('/', ProductController.getAll);
routes.get('/:id', ProductController.getOne);
routes.put('/:id', ProductController.updateProduct);
routes.delete('/:id', ProductController.deleteProduct);

export default routes;