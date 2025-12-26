import express from "express"
import PayPalController from "../controllers/paypalController.ts";

const routes = express.Router();

routes.post('/pay', PayPalController.createOrder)
routes.get('/complete-order', PayPalController.completeOrder)
routes.get('/cancel-order', PayPalController.cancelOrder)

export default routes;