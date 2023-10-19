import { Router } from 'express'

import { getPendingProduct, getUsersPublic } from '~/controllers/admin.controller'

import { verifyAccessToken } from '../middlewares/auth.middleware'

const router = Router()

//1. get all user
router.get('/users_public', verifyAccessToken, getUsersPublic)

//2. checking product valid before public on website
router.get('/checking_pending', verifyAccessToken, getPendingProduct)

//3. handle pending
router.post('/accept_pending_product/:id', verifyAccessToken)

//4. block user
router.post('/block_user/:id')

export default router
