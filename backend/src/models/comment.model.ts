import { model, Schema } from 'mongoose'

const commentModel = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    content: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export default model('Comment', commentModel)
