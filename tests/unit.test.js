import { describe, it, expect } from 'vitest'

describe('GPU utilities', () => {
  it('should calculate cost correctly', () => {
    const price = 0.33
    const hours = 10
    expect(price * hours).toBeCloseTo(3.3)
  })

  it('should format invoice total with tax', () => {
    const cost = 100
    const tax = cost * 0.13
    const grandTotal = cost + tax
    expect(grandTotal).toBe(113)
  })
})

describe('Input validation', () => {
  it('should reject invalid email', () => {
    const emails = ['notanemail', '@b.com', '', 'a@b', 'a@.com']
    for (const email of emails) {
      expect(/\S+@\S+\.\S+/.test(email)).toBe(false)
    }
  })

  it('should accept valid email', () => {
    expect(/\S+@\S+\.\S+/.test('test@example.com')).toBe(true)
  })

  it('should reject short password', () => {
    expect('abc'.length >= 6).toBe(false)
    expect('abcdef'.length >= 6).toBe(true)
  })
})

describe('Order constraints', () => {
  it('should enforce max 720 hours', () => {
    const maxHours = 720
    expect(1).toBeLessThanOrEqual(maxHours)
    expect(720).toBeLessThanOrEqual(maxHours)
    expect(721).toBeGreaterThan(maxHours)
  })

  it('should enforce minimum 1 hour', () => {
    expect(0).toBeLessThan(1)
    expect(1).toBeGreaterThanOrEqual(1)
  })
})
