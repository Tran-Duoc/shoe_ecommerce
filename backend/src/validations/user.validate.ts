import Joi from 'joi'

export const registerUserValidate = (data: any) => {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required().min(0).max(100),
    // email: Joi.string().required().email().pattern(new RegExp('gmail.com$')),
    email: Joi.string().required().email(),
    address: Joi.string().default(''),
    phone_number: Joi.string().length(10).required(),
    password: Joi.string().required().default(''),
    is_active: Joi.number().valid(0, 1).default(1),
    date_of_birth: Joi.date().default(''),
    google_account_id: Joi.string().default(''),
    avatar: Joi.string().default(''),
    role: Joi.string().valid('user', 'admin', 'business').default('user')
  })
  return userSchema.validate(data)
}

export const loginValidation = (data: any) => {
  const userSchema = Joi.object({
    email: Joi.string().required().email().pattern(new RegExp('gmail.com$')),
    password: Joi.string().required().default('')
  })
  return userSchema.validate(data)
}
