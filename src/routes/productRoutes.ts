import express, { Router } from "express";
import ProductController from "../controllers/productController.ts";

const routes: Router = express.Router();

routes.get('/', ProductController.getAllProducts);
routes.get('/:id', ProductController.getOneProduct);
routes.post('/', ProductController.createProduct);
routes.put('/:id', ProductController.updateProduct);
routes.delete('/:id', ProductController.deleteProduct);

export default routes;