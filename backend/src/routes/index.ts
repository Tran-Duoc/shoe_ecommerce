import { Router } from 'express'

import userRouter from './user.route'

const routers = Router()
routers.use('/user', userRouter)

export default routers
