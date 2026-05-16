import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryReplSet } from 'mongodb-memory-server'

let mongoServer
let request
let userToken = ''
let userId = ''
let gpuId = ''
let orderId = ''
let apiKeyId = ''
let sshKeyId = ''
let adminToken = ''
let otpCode = ''
const testPhone = '+977-9841234567'

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  })
  process.env.MONGO_URI = mongoServer.getUri()
  process.env.JWT_SECRET = 'test-secret-key'
  process.env.NODE_ENV = 'test'
  process.env.FRONTEND_URL = 'http://localhost:5173'

  const { default: connectDB } = await import('../server/config/db.js')
  await connectDB()

  const { app } = await import('../server/server.js')
  request = supertest(app)
}, 30000)

afterAll(async () => {
  await mongoose.disconnect()
  if (mongoServer) await mongoServer.stop()
})

async function seedGpus() {
  const { default: Gpu } = await import('../server/models/Gpu.js')
  const gpu = await Gpu.create({
    name: 'RTX 4090', arch: 'Ada Lovelace', vram: '24GB VRAM', vramGB: 24,
    price: 0.33, rangeLow: 0.13, rangeHigh: 2.40, availability: 'High',
    bandwidth: '1.0 TB/s', cpu: 'AMD EPYC 32 vCPU', ram: '128 GB',
    disk: '512 GB NVMe', description: 'Best value GPU for AI inference',
    inStock: 10, sparkData: [1, 2, 3],
  })
  gpuId = gpu._id.toString()
}

describe('E2E: Complete API flow', () => {
  it('01. Health check', async () => {
    const res = await request.get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('02. Signup', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'Test User', email: 'test@test.com', password: 'password123',
    })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('Test User')
    expect(res.body.email).toBe('test@test.com')
    expect(res.body.balance).toBe(5)
  })

  it('03. Reject duplicate signup', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: 'Test User', email: 'test@test.com', password: 'password123',
    })
    expect(res.status).toBe(400)
  })

  it('04. Reject invalid signup data', async () => {
    const res = await request.post('/api/auth/signup').send({
      name: '', email: 'bad', password: '12',
    })
    expect(res.status).toBe(400)
  })

  it('05. Login', async () => {
    const res = await request.post('/api/auth/login').send({
      email: 'test@test.com', password: 'password123',
    })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('_id')
    userToken = res.body.token
    userId = res.body._id
  })

  it('06. Reject wrong password', async () => {
    const res = await request.post('/api/auth/login').send({
      email: 'test@test.com', password: 'wrongpassword',
    })
    expect(res.status).toBe(401)
  })

  it('07. Reject non-existent email', async () => {
    const res = await request.post('/api/auth/login').send({
      email: 'nobody@test.com', password: 'password123',
    })
    expect(res.status).toBe(401)
  })

  it('08. GET /me with valid token', async () => {
    const res = await request.get('/api/auth/me').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('test@test.com')
  })

  it('09. GET /me without token returns 401', async () => {
    const res = await request.get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('10. GET /me with bad token returns 401', async () => {
    const res = await request.get('/api/auth/me').set('Authorization', 'Bearer badtoken')
    expect(res.status).toBe(401)
  })

  it('11. Refresh token', async () => {
    const res = await request.post('/api/auth/refresh').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('12. Change password', async () => {
    const res = await request.put('/api/auth/password').set('Authorization', `Bearer ${userToken}`).send({
      currentPassword: 'password123', newPassword: 'newpass456',
    })
    expect(res.status).toBe(200)
    // Revert
    await request.put('/api/auth/password').set('Authorization', `Bearer ${userToken}`).send({
      currentPassword: 'newpass456', newPassword: 'password123',
    })
  })

  it('13. Reject wrong current password', async () => {
    const res = await request.put('/api/auth/password').set('Authorization', `Bearer ${userToken}`).send({
      currentPassword: 'wrong-old-pass', newPassword: 'newpass789',
    })
    expect(res.status).toBe(401)
  })

  it('14. Forgot password sends reset email', async () => {
    const res = await request.post('/api/auth/forgot-password').send({ email: 'test@test.com' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
  })

  it('15. Forgot password with unknown email still returns 200', async () => {
    const res = await request.post('/api/auth/forgot-password').send({ email: 'ghost@test.com' })
    expect(res.status).toBe(200)
  })

  it('16. Seed GPUs', async () => {
    await seedGpus()
    expect(gpuId).toBeTruthy()
  })

  it('17. List GPUs (paginated)', async () => {
    const res = await request.get('/api/gpus')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('gpus')
    expect(Array.isArray(res.body.gpus)).toBe(true)
    expect(res.body.gpus.length).toBeGreaterThanOrEqual(1)
    expect(res.body).toHaveProperty('total')
    expect(res.body).toHaveProperty('page')
  })

  it('18. Get single GPU', async () => {
    const res = await request.get(`/api/gpus/${gpuId}`)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('RTX 4090')
  })

  it('19. Filter GPUs by search', async () => {
    const res = await request.get('/api/gpus?search=4090')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.gpus)).toBe(true)
  })

  it('20. Filter GPUs by availability', async () => {
    const res = await request.get('/api/gpus?availability=High')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.gpus)).toBe(true)
  })

  it('21. Create order (insufficient balance — default $5, rent $0.33/h * 20h = $6.60)', async () => {
    const res = await request.post('/api/orders').set('Authorization', `Bearer ${userToken}`).send({
      gpuId, hours: 20,
    })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('message')
  })

  it('22. Topup balance', async () => {
    const res = await request.post('/api/auth/topup').set('Authorization', `Bearer ${userToken}`).send({
      amount: 10,
    })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('balance')
    expect(res.body.balance).toBeGreaterThanOrEqual(15)
  })

  it('23. Now create order should succeed', async () => {
    const res = await request.post('/api/orders').set('Authorization', `Bearer ${userToken}`).send({
      gpuId, hours: 10,
    })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('_id')
    orderId = res.body._id
  })

  it('24. List my orders', async () => {
    const res = await request.get('/api/orders').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(1)
  })

  it('25. Cancel order', async () => {
    const res = await request.patch(`/api/orders/${orderId}/cancel`).set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('cancelled')
  })

  it('26. Instance action on order', async () => {
    const res = await request.patch(`/api/orders/${orderId}/instance`).set('Authorization', `Bearer ${userToken}`).send({
      action: 'terminate',
    })
    expect(res.status).toBe(200)
  })

  it('27. Reject instance action with bad action', async () => {
    const res = await request.patch(`/api/orders/${orderId}/instance`).set('Authorization', `Bearer ${userToken}`).send({
      action: 'fly',
    })
    expect(res.status).toBe(400)
  })

  it('28. Get invoice', async () => {
    const res = await request.get(`/api/orders/${orderId}/invoice`).set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.text).toContain('hamro.ai')
  })

  it('29. Create API key', async () => {
    const res = await request.post('/api/apikeys').set('Authorization', `Bearer ${userToken}`).send({
      name: 'Test Key',
    })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('key')
    expect(res.body.key).toMatch(/^hamro_/)
    apiKeyId = res.body._id || res.body.id
  })

  it('30. List API keys', async () => {
    const res = await request.get('/api/apikeys').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('31. Reject create API key with missing name', async () => {
    const res = await request.post('/api/apikeys').set('Authorization', `Bearer ${userToken}`).send({})
    expect(res.status).toBe(400)
  })

  it('32. Delete API key', async () => {
    const res = await request.delete(`/api/apikeys/${apiKeyId}`).set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
  })

  it('33. Create SSH key', async () => {
    const res = await request.post('/api/sshkeys').set('Authorization', `Bearer ${userToken}`).send({
      name: 'My Laptop',
      publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC... test-key',
    })
    expect(res.status).toBe(201)
    sshKeyId = res.body._id || res.body.id
  })

  it('34. List SSH keys', async () => {
    const res = await request.get('/api/sshkeys').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('35. Delete SSH key', async () => {
    const res = await request.delete(`/api/sshkeys/${sshKeyId}`).set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
  })

  it('36. List transactions', async () => {
    const res = await request.get('/api/transactions').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('37. Subscribe to newsletter', async () => {
    const res = await request.post('/api/subscribe').send({ email: 'sub@test.com' })
    expect(res.status).toBe(200)
  })

  it('38. Reject duplicate subscribe', async () => {
    const res = await request.post('/api/subscribe').send({ email: 'sub@test.com' })
    expect(res.status).toBe(400)
  })

  it('39. Reject invalid subscribe email', async () => {
    const res = await request.post('/api/subscribe').send({ email: 'notanemail' })
    expect(res.status).toBe(400)
  })

  it('40. Admin: login', async () => {
    const { default: User } = await import('../server/models/User.js')
    await User.create({ name: 'Admin', email: 'admin@hamro.ai', password: 'admin123', balance: 9999, isAdmin: true })

    const res = await request.post('/api/auth/login').send({ email: 'admin@hamro.ai', password: 'admin123' })
    expect(res.status).toBe(200)
    adminToken = res.body.token
  })

  it('41. Admin: list users', async () => {
    const res = await request.get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('users')
    expect(res.body).toHaveProperty('total')
  })

  it('42. Admin: list orders', async () => {
    const res = await request.get('/api/admin/orders').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('orders')
    expect(res.body).toHaveProperty('total')
  })

  it('43. Admin: list GPUs', async () => {
    const res = await request.get('/api/admin/gpus').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('44. Admin: create GPU', async () => {
    const res = await request.post('/api/admin/gpus').set('Authorization', `Bearer ${adminToken}`).send({
      name: 'Test GPU', price: 1.00, arch: 'Test',
    })
    expect(res.status).toBe(201)
  })

  it('45. Admin: reject regular user from admin', async () => {
    const res = await request.get('/api/admin/users').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(403)
  })

  it('46. Admin: seed endpoint', async () => {
    const res = await request.post('/api/admin/seed').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('47. Phone OTP: send', async () => {
    const res = await request.post('/api/auth/phone/send-otp').send({ phone: testPhone })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('code')
    otpCode = String(res.body.code)
  })

  it('48. Phone OTP: verify with correct code', async () => {
    const res = await request.post('/api/auth/phone/verify-otp').send({ phone: testPhone, code: otpCode })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('name')
  })

  it('49. Phone OTP: reject wrong code', async () => {
    const res = await request.post('/api/auth/phone/verify-otp').send({ phone: testPhone, code: '000000' })
    expect(res.status).toBe(400)
  })

  it('50. 2FA: setup generates secret', async () => {
    const res = await request.post('/api/auth/2fa/setup').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('secret')
    expect(res.body).toHaveProperty('qr')
  })

  it('51. 2FA: verify with wrong token', async () => {
    const res = await request.post('/api/auth/2fa/verify').set('Authorization', `Bearer ${userToken}`).send({
      token: '000000',
    })
    expect(res.status).toBe(400)
  })

  it('52. 2FA: status check', async () => {
    const res = await request.get('/api/auth/2fa/status').set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('enabled')
  })

  it('53. Coupon: verify invalid code', async () => {
    const res = await request.post('/api/payment/verify').set('Authorization', `Bearer ${userToken}`).send({
      code: 'NONEXISTENT',
    })
    expect(res.status).toBe(404)
  })

  it('54. Coupon: create via model and verify', async () => {
    const { default: Coupon } = await import('../server/models/Coupon.js')
    await Coupon.create({ code: 'TEST10', discountPercent: 10 })

    const res = await request.post('/api/payment/verify').set('Authorization', `Bearer ${userToken}`).send({
      code: 'TEST10',
    })
    expect(res.status).toBe(200)
    expect(res.body.code).toBe('TEST10')
    expect(res.body.discountPercent).toBe(10)
  })

  it('55. 404 on unknown API route', async () => {
    const res = await request.get('/api/nonexistent-route')
    expect(res.status).toBe(404)
  })

  it('56. Email verification flow', async () => {
    const { default: User } = await import('../server/models/User.js')
    const crypto = await import('crypto')
    const user = await User.findOne({ email: 'test@test.com' })
    const token = crypto.randomBytes(20).toString('hex')
    user.verificationToken = token
    user.verificationTokenExpires = new Date(Date.now() + 3600000)
    await user.save()

    const res = await request.get(`/api/auth/verify-email/${token}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/verified/i)

    const updated = await User.findById(user._id)
    expect(updated.emailVerified).toBe(true)
  })

  it('57. Password reset flow', async () => {
    const crypto = await import('crypto')
    const { default: User } = await import('../server/models/User.js')
    const user = await User.findOne({ email: 'test@test.com' })
    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date(Date.now() + 3600000)
    await user.save()

    const res = await request.post('/api/auth/reset-password').send({ token, password: 'brandnewpass' })
    expect(res.status).toBe(200)
  })

  it('58. Login with new password', async () => {
    const res = await request.post('/api/auth/login').send({ email: 'test@test.com', password: 'brandnewpass' })
    expect(res.status).toBe(200)
    userToken = res.body.token
  })

  it('59. Cleanup: delete test user', async () => {
    const { default: User } = await import('../server/models/User.js')
    await User.deleteMany({ email: { $ne: 'admin@hamro.ai' } })
    const count = await User.countDocuments()
    expect(count).toBe(1)
  })
}, 10000)
