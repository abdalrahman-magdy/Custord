import { Router } from "express";
import { signUp, logIn } from "./controllers.js"
const customersRouter = Router()

customersRouter.post('/', logIn)
customersRouter.post('/signup', signUp)

export default customersRouter;