import { Router } from 'express'

import {
  deleteUser,
  forgotPassword,
  getUser,
  login,
  register,
  resetPassword,
  updateAvatarUser,
  updateUser,
  verifyOTP
} from '~/controllers/user.controller'
import { verifyAccessToken } from '~/middlewares/auth.middleware'
import { uploadAvatarMiddleware } from '~/middlewares/upload.middleware'

const router = Router()

//1. register user
router.post('/register', register)

//2. login user
router.post('/login', login)

// 3. update information user
router.patch('/update_info/:id', updateUser)

//4. delete user [role  : "user" or "business"]
/*
Users or business can only delete their own accounts. if you role is admin, you can delete any user
*/
router.patch('/delete_info/:id', verifyAccessToken, deleteUser)

//6. get user
router.get('/:id', getUser)

//7.log out
router.post('/:id')

//8. update avatar user

router.patch('/update_avatar/:id', uploadAvatarMiddleware.single('avatar'), updateAvatarUser)

//9. handle forgot password
/**
 * mission
 *  - required your email confirm this account was registered
 *  - receive opt from client verify account (opt sent to user with email).
 *    * If true, user create new password
 *    * If false , reject error
 *  -
 */

router.post('/forgot_password', forgotPassword)

router.post('/verify_otp', verifyOTP)
router.post('/reset_password', resetPassword)

export default router
