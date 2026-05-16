import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const topupSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least $1').max(10000),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(128),
})

export const orderCreateSchema = z.object({
  gpuId: z.string().min(1),
  hours: z.number().int().min(1, 'Minimum 1 hour').max(720, 'Maximum 720 hours'),
})

export const gpuQuerySchema = z.object({
  search: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  arch: z.string().optional(),
  minVram: z.string().optional(),
  availability: z.string().optional(),
  region: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
})

export const apiKeySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
})

export const sshKeySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  publicKey: z.string().trim().min(1, 'Public key is required'),
})

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Valid email required'),
})

export const couponSchema = z.object({
  code: z.string().trim().min(1, 'Coupon code required'),
})

export const instanceActionSchema = z.object({
  action: z.enum(['start', 'stop', 'terminate']),
})

export const gpuCreateSchema = z.object({
  name: z.string().min(1),
  arch: z.string().optional(),
  vram: z.string().optional(),
  vramGB: z.number().optional(),
  price: z.number().positive(),
  rangeLow: z.number().optional(),
  rangeHigh: z.number().optional(),
  availability: z.enum(['Low', 'Med', 'High']).optional(),
  region: z.string().optional(),
  inStock: z.number().int().optional(),
  bandwidth: z.string().optional(),
  cpu: z.string().optional(),
  ram: z.string().optional(),
  disk: z.string().optional(),
  description: z.string().optional(),
})
