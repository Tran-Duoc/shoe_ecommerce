import { model, Schema } from 'mongoose'

const imageModel = new Schema(
  {
    thumbnail: {
      type: String
    },
    product_images: {
      type: Array(String),
      default: []
    },
    total: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export default model('ProductImages', imageModel)
