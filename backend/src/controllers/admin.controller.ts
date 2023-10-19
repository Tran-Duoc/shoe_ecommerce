import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

import ApiError from '~/handlers/error.handler'
import { accept, getAllUserPublic, getPendingProducts, getProduct } from '~/services/admin.service'

export const getUsersPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    const { role: role } = req.user
    if (role !== 'admin') throw new ApiError(StatusCodes.UNAUTHORIZED, 'your role invalid feature')
    const users = await getAllUserPublic()
    if (!users) throw new ApiError(StatusCodes.NOT_FOUND, "Can't get product")
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Get users successfully',
      data: users
    })
  } catch (error) {
    next(error)
  }
}

export const getPendingProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    const { role: role } = req.user
    if (role !== 'admin') throw new ApiError(StatusCodes.UNAUTHORIZED, 'your role invalid feature')
    const products = await getPendingProducts()
    if (!products) throw new ApiError(StatusCodes.NOT_FOUND, "Can't get products, may be something fail")
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Get products successfully',
      data: products
    })
  } catch (error) {
    next(error)
  }
}

export const acceptPendingProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    const { role: role } = req.user
    const { id: ProductId } = req.params
    if (role !== 'admin') throw new ApiError(StatusCodes.UNAUTHORIZED, 'your role invalid feature')
    const product = await getProduct(ProductId as unknown as Types.ObjectId)
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, "Product does't exit")
    await accept(ProductId as unknown as Types.ObjectId, 'accept')
  } catch (error) {
    next(error)
  }
}
