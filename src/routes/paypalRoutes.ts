import express from "express"
import PayPalController from "../controllers/paypalController.ts"

const routes = express.Router();

routes.post('/create-order', PayPalController.createOrder);
routes.post('/capture-order/:id', PayPalController.captureOrder);

export default routes;