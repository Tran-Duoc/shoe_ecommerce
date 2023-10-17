import { model, Schema } from 'mongoose'

const favoriteModel = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  },
  {
    timestamps: true
  }
)

export default model('Favorite', favoriteModel)
