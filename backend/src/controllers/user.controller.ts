import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { SentMessageInfo } from 'nodemailer'

import cloudinary from '~/configs/cloudinary.config'
import { mailOptions, transporterMailer } from '~/configs/nodeMailer.config'
import { compareOTP, generateOTP, remoteOTP, storageTemp } from '~/configs/opt.config'
import ApiError from '~/handlers/error.handler'
import { comparePassword, generateAccessToken, generateRefreshToken, hashPassword } from '~/libs/utils'
import {
  createUser,
  deleteUserFromDb,
  exitUser,
  saveRefreshToken,
  updateAvatar,
  updateUserInfo
} from '~/services/user.service'
import { loginValidation, registerUserValidate } from '~/validations/user.validate'

const TIME_OUT_OPT = 60 // 60s
const MAIL_PROCESS = process.env.NAME_EMAIL_PROCESS as string
const PASSWORD_PROCESS = process.env.PASSWORD_PROCESS as string

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    // checking validation data error
    const { error } = registerUserValidate(req.body)
    if (error) throw new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message)

    //checking exit user in database
    const user = await exitUser({ email: email })
    console.log(user)
    if (user) throw new ApiError(StatusCodes.CONFLICT, 'User is exit!, Please choose other account')

    const newUser = await createUser(req.body)
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'user created successfully!',
      data: newUser
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    // checking valid field login
    const { error: errorValid } = loginValidation(req.body)
    if (errorValid) throw new ApiError(StatusCodes.BAD_REQUEST, errorValid.details[0].message)

    // checking user have in database
    const isUser = await exitUser({ email: email })
    if (!isUser) throw new ApiError(StatusCodes.NOT_FOUND, "User does't exit")
    const validPassword = await comparePassword(req.body.password, isUser.password)

    if (!validPassword) throw new ApiError(StatusCodes.BAD_REQUEST, 'Something wrong')

    const payload = { _id: isUser._id, role: isUser.role }

    const { password, ...other } = isUser.toObject()
    const access_token = generateAccessToken(payload)
    const refresh_token = generateRefreshToken(payload)

    await saveRefreshToken({
      user_id: isUser._id,
      refresh_token: refresh_token
    })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successfully',
      data: { ...other, access_token }
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const isUser = await exitUser({ _id: id, is_active: 1 })
    if (!isUser) throw new ApiError(StatusCodes.NOT_FOUND, "user does't exit ")

    const { password, ...other } = isUser.toObject()

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'get user is successfully',
      data: other
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    const { _id: userId } = req.user
    const currentIdUser = req.params.id
    if (currentIdUser !== userId)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You do not have permission to remove this user.')

    await deleteUserFromDb(userId)

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Delete user is successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params

    const isUser = await exitUser({ _id: userId })
    if (!isUser) throw new ApiError(StatusCodes.NOT_FOUND, "User does't exit")

    updateUserInfo(isUser._id, { ...req.body })
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Update user is successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const updateAvatarUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params
    const isUser = await exitUser({ _id: userId })
    if (!isUser) throw new ApiError(StatusCodes.NOT_FOUND, "User does't exit")
    if (isUser.avatar) {
      await cloudinary.uploader.destroy(`shose-ecomerce/avatar/${userId}/${userId}`)
    }

    const result = await cloudinary.uploader.upload(req.file?.path as string, {
      resource_type: 'image',
      public_id: `shose-ecomerce/avatar/${userId}/${userId}`
    })
    updateAvatar(isUser._id, { avatar: result.secure_url })
    return res.json({
      success: true,
      message: 'Update avatar successfully',
      imagePath: result.secure_url
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email: userEmail } = req.body

    const OTP = generateOTP(TIME_OUT_OPT)
    storageTemp(userEmail, OTP)
    const isUser = await exitUser({ email: userEmail })
    if (!isUser) throw new ApiError(StatusCodes.NOT_FOUND, "User does't exit!")

    const transporter = transporterMailer(MAIL_PROCESS, PASSWORD_PROCESS)

    const options = mailOptions({
      from: MAIL_PROCESS,
      to: userEmail,
      subject: 'OTP for Password Reset',
      text: `Your OTP for password reset is: ${OTP}`
    })

    transporter.sendMail(options, (err: Error | null, _info: SentMessageInfo) => {
      if (err) throw new ApiError(StatusCodes.FORBIDDEN, 'Error sending email')
      return res.json({
        success: true,
        message: 'Sending successfully'
      })
    })
  } catch (error) {
    next(error)
  }
}

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { opt, email } = req.body
    const verifyOtp = compareOTP(email, opt)
    if (!verifyOtp) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP')
    remoteOTP(email)
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'The OTP valid'
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId, password: newPassword } = req.body
    const password_hash = hashPassword(newPassword)

    updateUserInfo(userId, { password: password_hash })
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Reset password successfully'
    })
  } catch (error) {
    next(error)
  }
}
