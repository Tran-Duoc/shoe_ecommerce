import { model, Schema } from 'mongoose'

const orderDetailModel = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    },
    total_item: {
      type: Number,
      default: 0
    },
    total_price: {
      type: Number,
      default: 0
    },
    voucher: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export default model('OrderDetail', orderDetailModel)
