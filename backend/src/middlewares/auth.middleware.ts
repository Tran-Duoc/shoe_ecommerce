import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import ApiError from '~/handlers/error.handler'
import { ACCESS_TOKEN_SECRET_KEY, DecodeToken } from '~/libs/utils'

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization
    if (!token) throw new ApiError(StatusCodes.BAD_REQUEST, "You are't authentication")

    const decoded = DecodeToken(token as string, ACCESS_TOKEN_SECRET_KEY)
    if (!decoded) throw new ApiError(StatusCodes.UNAUTHORIZED, 'unauthorization')

    //@ts-ignore
    req.user = decoded
    next()
  } catch (error) {
    return next(error)
  }
}
