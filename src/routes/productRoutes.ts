import express, { Router } from "express";
import productController from "../controllers/productController.ts";

const routes: Router = express.Router();

routes.get('/', productController.getAllProducts);
routes.get('/:id', productController.getOneProduct);
routes.post('/', productController.createProduct);
routes.put('/:id', productController.updateProduct);
routes.delete('/:id', productController.deleteProduct);

export default routes;