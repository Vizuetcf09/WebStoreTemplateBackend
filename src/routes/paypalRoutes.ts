import express from "express"
import PayPalController from "../controllers/paypalController.ts";

const routes = express.Router();

routes.post('/pay', (req, res) => PayPalController.createOrder(req, res));
routes.get('/complete-order', (req, res) => PayPalController.completeOrder(req, res));
routes.get('/cancel-order', (req, res) => PayPalController.cancelOrder(req, res));

export default routes;