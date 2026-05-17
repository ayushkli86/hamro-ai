import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import authLight from '../middleware/authLight.js'
import User from '../models/User.js'
import logger from '../config/logger.js'
import { existsSync, mkdirSync, unlinkSync } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars')
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true })

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${req.user.id}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPEG, PNG, WebP allowed'))
  },
})

const router = express.Router()

router.post('/avatar', authLight, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large. Max 2MB' })
      return res.status(400).json({ message: err.message })
    }
    if (err) return res.status(400).json({ message: err.message })
    next()
  })
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
  const user = await User.findById(req.user.id).select('avatar').lean()
  if (user?.avatar) {
    const oldPath = path.join(uploadDir, path.basename(user.avatar))
    try { if (existsSync(oldPath)) unlinkSync(oldPath) } catch {}
  }
  const avatarUrl = `/uploads/avatars/${req.file.filename}`
  await User.findByIdAndUpdate(req.user.id, { $set: { avatar: avatarUrl } })
  logger.info({ userId: req.user.id, avatar: avatarUrl }, 'Avatar uploaded')
  res.json({ avatar: avatarUrl })
})

export default router
