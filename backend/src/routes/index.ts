import { Router } from 'express'

import adminRouter from './admin.route'
import userRouter from './user.route'

const routers = Router()
routers.use('/user', userRouter)
routers.use('/admin', adminRouter)

export default routers
