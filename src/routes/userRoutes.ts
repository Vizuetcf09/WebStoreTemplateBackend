import express from 'express';
import UserController from '../controllers/userController.js';

// User routes
const routes = express.Router();

routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.get('/verify-email', UserController.verifyEmail);
routes.post('/verify-email', UserController.verifyEmail);
routes.post('/resend-verification', UserController.resendVerification);

export default routes;
