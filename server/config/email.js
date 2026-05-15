import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

export async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_USER) {
    console.log(`\n📧 [DEV EMAIL] To: ${to}`)
    console.log(`   Subject: ${subject}`)
    console.log(`   Body: ${html.replace(/<[^>]*>/g, '').slice(0, 200)}...\n`)
    return
  }
  await transporter.sendMail({ from: `"hamro.ai" <${process.env.SMTP_USER}>`, to, subject, html })
}
