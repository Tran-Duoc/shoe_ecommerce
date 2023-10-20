import { Types } from 'mongoose'

import productModel from '~/models/product.model'
import userModel from '~/models/user.model'

export const exitUser = async (argument: any) => {
  return await userModel.findOne(argument)
}

export const getAllUserPublic = async () => {
  return await userModel.find({
    is_active: 1
  })
}
export const getAllUserBlock = async () => {
  return await userModel.find({
    is_active: 0
  })
}

export const getPendingProducts = async () => {
  return await productModel.find({ pending: 'pending' })
}

export const getProduct = async (ProductId: Types.ObjectId) => {
  return productModel.findOne({ _id: ProductId })
}

export const accept = async (ProductId: Types.ObjectId, type: string) => {
  return productModel.findByIdAndUpdate(
    ProductId,
    {
      pending: type
    },
    {
      new: true
    }
  )
}

export const block = async (userId: Types.ObjectId) => {
  return await userModel.findByIdAndUpdate(userId, { is_active: 0 }, { new: true })
}
