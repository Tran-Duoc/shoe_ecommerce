import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

import cloudinary from '../configs/cloudinary.config'

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    //@ts-ignore
    folder: 'shose-ecomerce',
    format: 'jpg'
  }
})

export const uploadAvatarMiddleware = multer({ storage: storage })
