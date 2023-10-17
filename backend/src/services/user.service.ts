import { Types } from 'mongoose'

import tokenModel from '~/models/token.model'
import userModel from '~/models/user.model'

type payloadType = {
  user_id: Types.ObjectId
  refresh_token: string
}

export const exitUser = async (argument: any) => {
  return await userModel.findOne(argument)
}

export const createUser = async (data: object) => {
  const user = new userModel(data)
  return await user.save()
}

export const saveRefreshToken = async (payload: payloadType) => {
  return await tokenModel.findOneAndUpdate(
    {
      user_id: payload.user_id
    },
    {
      user: payload.user_id,
      refresh_token: payload.refresh_token
    },
    {
      upsert: true,
      new: true
    }
  )
}

export const deleteUserFromDb = async (userId: Types.ObjectId) => {
  return await userModel.findByIdAndUpdate(userId, {
    is_active: 0
  })
}

export const updateUserInfo = async (userId: Types.ObjectId, data: any) => {
  return userModel.findByIdAndUpdate({ _id: userId }, data, {
    new: true
  })
}

export const updateAvatar = async (userId: Types.ObjectId, avatar: any) => {
  return userModel.findByIdAndUpdate(userId, avatar, { new: true })
}
