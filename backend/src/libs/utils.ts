import { compare, genSalt, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'

export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY as string
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY as string
const EXPIRES_ACCESS_TOKEN_TIMEOUT = '1d'
const EXPIRES_REFRESH_TOKEN_TIMEOUT = '10d'

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10)
  return await hash(password, salt)
}

export const comparePassword = async (currentPassword: string, hashPassword: string) => {
  return await compare(currentPassword, hashPassword)
}

export const generateAccessToken = (payload: object) => {
  return sign(payload, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: EXPIRES_ACCESS_TOKEN_TIMEOUT
  })
}
export const generateRefreshToken = (payload: object) => {
  return sign(payload, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: EXPIRES_REFRESH_TOKEN_TIMEOUT
  })
}

export const DecodeToken = (token: string, secret_key: string) => {
  return verify(token, secret_key)
}
