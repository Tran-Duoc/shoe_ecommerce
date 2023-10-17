import { model, Schema } from 'mongoose'

const tokenModel = new Schema(
  {
    refresh_token: {
      type: String,
      default: ''
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  { timestamps: true }
)

export default model('token', tokenModel)
