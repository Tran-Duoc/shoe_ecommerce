import nodemailer from 'nodemailer'

export const transporterMailer = (mailProcess: string, passwordProcess: string) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailProcess,
      pass: passwordProcess
    }
  })
}

export const mailOptions = (options: any) => {
  return options
}
