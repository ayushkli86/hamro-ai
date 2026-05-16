import Stripe from 'stripe'
import logger from './logger.js'

let stripe
export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      logger.warn('STRIPE_SECRET_KEY not set — Stripe disabled')
      return null
    }
    stripe = new Stripe(key)
  }
  return stripe
}

export async function createCheckoutSession(amount, userId, userEmail) {
  const s = getStripe()
  if (!s) return null

  const session = await s.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Hamro.ai Credit Topup' },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=cancelled`,
    metadata: { userId: userId.toString(), amount: amount.toString() },
    customer_email: userEmail,
  })

  return session
}

export async function constructWebhookEvent(body, signature) {
  const s = getStripe()
  if (!s) return null
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!endpointSecret) {
    logger.warn('STRIPE_WEBHOOK_SECRET not set — using raw body')
    return JSON.parse(body.toString())
  }
  return s.webhooks.constructEvent(body, signature, endpointSecret)
}
