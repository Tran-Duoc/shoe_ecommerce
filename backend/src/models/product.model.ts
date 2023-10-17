import { model, Schema } from 'mongoose'

const productModel = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    description: {
      type: String,
      default: '',
      required: true
    },
    price: {
      type: Number,
      require: true,
      min: [0, 'Price must be greater 0'],
      max: [100000000, 'Price must be less 100.000.000 VND'],
      default: 0
    },
    size: {
      type: Number,
      require: true,
      min: 35,
      max: 45,
      enum: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
      default: 35
    },
    color: {
      type: String,
      require: true
    },
    category: {
      type: String,
      enum: ['running', 'football', 'walking'],
      require: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      require: true
    },
    images_id: {
      type: Schema.Types.ObjectId,
      ref: 'Images'
    },
    discount_id: {
      type: Schema.Types.ObjectId,
      ref: 'Discount'
    }
  },
  {
    timestamps: true
  }
)

export default model('Product', productModel)
