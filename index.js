import express from 'express'
import cors from 'cors'

import customersRouter from './modules/customers/routes.js'
import ordersRouter from './modules/orders/routes.js'
import productsRouter from './modules/products/routes.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/', customersRouter)
app.use('/orders', ordersRouter)
app.use('/products', productsRouter)


app.listen(port, () => console.log(`server running on port ${port}!`)) 