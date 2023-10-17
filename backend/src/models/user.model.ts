import { CallbackError, CallbackWithoutResultAndOptionalError, model, Schema } from 'mongoose'

import { hashPassword } from '~/libs/utils'

const userModel = new Schema(
  {
    name: {
      type: String,
      default: '',
      require: true
    },
    age: {
      type: Number,
      min: [1, 'Age must be greater 1'],
      max: [100, 'Age must be less 100'],
      default: 1,
      require: true
    },
    address: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email: string) {
          return /\S+@\S+\.\S+/.test(email)
        },
        message: 'Invalid email format'
      }
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Invalid phone number']
    },
    password: {
      type: String,
      require: true,
      unique: true,
      default: ''
    },
    is_active: {
      type: Number,
      enum: [0, 1],
      default: 1
    },
    date_of_birth: {
      type: Date,
      default: ''
    },
    google_account_id: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'business'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
)

userModel.pre('save', async function (next: CallbackWithoutResultAndOptionalError) {
  try {
    const encryptedPassword = await hashPassword(this.password)
    console.log(encryptedPassword)
    this.password = encryptedPassword
    next()
  } catch (error) {
    next(error.message)
  }
})

export default model('User', userModel)
