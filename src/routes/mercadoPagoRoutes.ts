import express from 'express';
import MercadoPagoController from '../controllers/mercadoPagoController.js';
import mongoDBMiddleware from '../middlewares/mongoDBMiddleware.js';

const routes = express.Router();

routes.post('/create-preference', mongoDBMiddleware, (req, res) => MercadoPagoController.createPreference(req, res));
routes.get('/payment/:paymentId', (req, res) => MercadoPagoController.getPayment(req, res));

export default routes;