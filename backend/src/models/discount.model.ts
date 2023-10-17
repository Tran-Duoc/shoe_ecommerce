import { model, Schema } from 'mongoose'

const discountModel = new Schema(
  {
    start_date: {
      type: Date
    },
    end_date: {
      type: Date
    },
    discount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export default model('Discount', discountModel)
