import logger from './logger.js'

const API_URL = 'https://sms.aakashsms.com/sms/v3/send/'

export async function sendSms(phone, message) {
  const authToken = process.env.AAKASH_SMS_TOKEN
  if (!authToken) {
    logger.warn('AAKASH_SMS_TOKEN not set — SMS not sent')
    return null
  }

  const params = new URLSearchParams({
    auth_token: authToken,
    to: phone.replace(/[^0-9]/g, ''),
    text: message,
  })

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })
    const data = await res.json()
    if (data.error) {
      logger.error({ phone, error: data.message }, 'SMS send failed')
      return null
    }
    logger.info({ phone, smsId: data.data?.valid?.[0]?.id }, 'SMS sent')
    return data
  } catch (err) {
    logger.error({ phone, err: err.message }, 'SMS API request failed')
    return null
  }
}
