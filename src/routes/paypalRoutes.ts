import express from "express"

const routes = express.Router();

routes.post('/create-order')
routes.post('/capture-order/:id');

export default routes;