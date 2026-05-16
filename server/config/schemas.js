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
  gpuId: z.string().trim().min(1),
  hours: z.number().int().min(1, 'Minimum 1 hour').max(720, 'Maximum 720 hours'),
})

export const gpuQuerySchema = z.object({
  search: z.string().trim().optional(),
  minPrice: z.string().trim().optional(),
  maxPrice: z.string().trim().optional(),
  arch: z.string().trim().optional(),
  minVram: z.string().trim().optional(),
  availability: z.string().trim().optional(),
  region: z.string().trim().optional(),
  sort: z.string().trim().optional(),
  page: z.string().trim().optional(),
  limit: z.string().trim().optional(),
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
  name: z.string().trim().min(1),
  arch: z.string().trim().optional(),
  vram: z.string().trim().optional(),
  vramGB: z.number().optional(),
  price: z.number().positive(),
  rangeLow: z.number().optional(),
  rangeHigh: z.number().optional(),
  availability: z.enum(['Low', 'Med', 'High']).optional(),
  region: z.string().trim().optional(),
  inStock: z.number().int().optional(),
  bandwidth: z.string().trim().optional(),
  cpu: z.string().trim().optional(),
  ram: z.string().trim().optional(),
  disk: z.string().trim().optional(),
  description: z.string().trim().optional(),
})
