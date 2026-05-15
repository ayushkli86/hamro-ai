import { useParams } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const PAGES = {
  'terms': {
    title: 'Terms of Service',
    content: 'By using hamro.ai, you agree to these terms. You are responsible for all activity under your account. We reserve the right to suspend or terminate accounts that violate our policies. GPUs are provided on an "as-is" basis. Billing is per-second with no minimums. All prices are subject to change with notice.',
  },
  'privacy': {
    title: 'Privacy Policy',
    content: 'hamro.ai collects minimal data needed to provide our services: account information, usage data, and payment records. We never share your data with third parties for marketing purposes. Your compute instances are isolated and private. We use encryption for all data in transit and at rest.',
  },
  'compliance': {
    title: 'Compliance',
    content: 'hamro.ai is SOC 2 certified. We maintain strict access controls, audit logs, and data protection measures. Our infrastructure meets industry standards for security and reliability. We regularly undergo third-party audits to ensure compliance.',
  },
  'disclosure': {
    title: 'Vulnerability Disclosure',
    content: 'We welcome security researchers to report potential vulnerabilities. Please email security@hamro.ai with details. We commit to acknowledging reports within 48 hours and resolving validated issues promptly. No legal action will be taken against good-faith researchers.',
  },
  'data-processing': {
    title: 'Data Processing Agreement',
    content: 'This DPA governs the processing of customer data by hamro.ai. We act as a data processor for customer content. Data is stored in encrypted form and can be deleted upon request. We maintain GDPR-compliant data processing practices.',
  },
}

export default function Legal() {
  const { page } = useParams()
  const p = PAGES[page]
  if (!p) return <PageLayout title="Not found"><p className="text-gray-400">Page not found.</p></PageLayout>

  return (
    <PageLayout title={p.title}>
      <div className="max-w-3xl bg-[#161616] border border-gray-800 rounded-xl p-8">
        <p className="text-gray-300 leading-relaxed">{p.content}</p>
      </div>
    </PageLayout>
  )
}
