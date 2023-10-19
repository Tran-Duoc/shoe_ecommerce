import { Types } from 'mongoose'

import productModel from '~/models/product.model'
import userModel from '~/models/user.model'

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
