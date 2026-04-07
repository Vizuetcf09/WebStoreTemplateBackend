import express from 'express';
import UserController from '../controllers/userController.js';


// User routes

const routes = express.Router();

routes.post('/register', UserController.register);

export default routes;