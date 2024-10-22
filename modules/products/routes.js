import { Router } from "express";
import {getRevByCat, addProduct, soldFromEach } from "./controllers.js"

const productsRouter = Router()

productsRouter.post('/products', addProduct)
productsRouter.get('/revenues-by-category', getRevByCat);
productsRouter.get('/sold-from-each', soldFromEach);


export default productsRouter;