import { Router } from "express";
import { createOrder, avgOrderValue, zeroPurchase, 
        mostItemsOrder, topTenCustomers,atLeastFiveOrders,
        activeCustomersPercentage, earliestOrder} from "./controllers.js";
const ordersRouter = Router();

ordersRouter.post('/addOrder', createOrder)
ordersRouter.get('/getAvgOrder', avgOrderValue)
ordersRouter.get('/zeroOrder', zeroPurchase)
ordersRouter.get('/mostItemsOrdered', mostItemsOrder)
ordersRouter.get('/topCustomers',topTenCustomers)
ordersRouter.get('/atLeastFive',atLeastFiveOrders)
ordersRouter.get('/activePercentage',activeCustomersPercentage)
ordersRouter.get('/earliestOrder',earliestOrder)

export default ordersRouter;