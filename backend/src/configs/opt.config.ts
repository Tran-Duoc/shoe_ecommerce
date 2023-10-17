import speakeasy from 'speakeasy'
// create storage save opt temp
const otpStorage = new Map()

// generate radom otp password
export const generateOTP = (timeout: number): number => {
  const otp = speakeasy.totp({
    secret: speakeasy.generateSecret().base32,
    digits: 6,
    time: timeout
  })
  return Number(otp)
}

//save opt  in storage
export const storageTemp = (email: string, otp: number) => {
  return otpStorage.set(email, otp)
}
// get opt from storage
export const getOTP = (key: string) => {
  return otpStorage.get(key)
}

// delete opt in storage
export const remoteOTP = (email: string) => {
  return otpStorage.delete(email)
}

// compare otp
export const compareOTP = (email: string, enteredOTP: number) => {
  const storedOTP = getOTP(email)
  if (storedOTP === enteredOTP) {
    console.log('Mã OTP hợp lệ')
    return true
  } else {
    console.log('Mã OTP không hợp lệ')
    return false
  }
}
