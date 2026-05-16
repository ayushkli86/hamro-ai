import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, sparse: true, unique: true },
  password: { type: String },
  balance: { type: Number, default: 5 },
  isAdmin: { type: Boolean, default: false, index: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  googleId: { type: String, sparse: true, unique: true },
  appleId: { type: String, sparse: true, unique: true },
  phone: { type: String, sparse: true, unique: true },
  phoneVerified: { type: Boolean, default: false },
  authProvider: { type: String, enum: ['email', 'google', 'apple', 'phone'], default: 'email' },
  twoFactorSecret: String,
  twoFactorEnabled: { type: Boolean, default: false },
}, { timestamps: true })

userSchema.index({ isAdmin: 1, createdAt: -1 })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now()
}

userSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1
  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000
    this.loginAttempts = 0
  }
  await this.save()
}

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0
  this.lockUntil = undefined
  await this.save()
}

export default mongoose.model('User', userSchema)
