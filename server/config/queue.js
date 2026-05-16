import Bull from 'bull'
import { sendEmail } from './email.js'
import logger from './logger.js'

const emailQueue = process.env.REDIS_URL
  ? new Bull('email', process.env.REDIS_URL)
  : null

if (emailQueue) {
  emailQueue.process(async (job) => {
    const { to, subject, html } = job.data
    await sendEmail({ to, subject, html })
  })

  emailQueue.on('completed', (job) => logger.info({ jobId: job.id, to: job.data.to }, 'Email sent'))
  emailQueue.on('failed', (job, err) => logger.error({ jobId: job.id, err: err.message }, 'Email failed'))

  logger.info('Email queue initialized with Redis')
}

export function enqueueEmail({ to, subject, html }) {
  if (emailQueue) {
    return emailQueue.add({ to, subject, html }, { removeOnComplete: true, attempts: 3 })
  }
  return sendEmail({ to, subject, html })
}
