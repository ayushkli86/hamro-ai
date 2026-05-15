import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const CERTIFICATIONS = [
  { name: 'SOC 2 Type II', status: 'Certified', desc: 'Annual third-party audit validates our security controls, data protection, and operational processes.' },
  { name: 'ISO 27001', status: 'In Progress', desc: 'Implementation underway for information security management system certification.' },
  { name: 'GDPR', status: 'Compliant', desc: 'Data processing practices align with GDPR requirements for European user data protection.' },
]

const CONTROLS = [
  { title: 'Encryption at Rest', desc: 'All customer data encrypted using AES-256. Storage volumes use per-volume encryption keys.' },
  { title: 'Encryption in Transit', desc: 'TLS 1.3 for all API traffic. WireGuard VPN available for private network paths.' },
  { title: 'Access Control', desc: 'Role-based access control (RBAC) with multi-factor authentication support.' },
  { title: 'Audit Logging', desc: 'Comprehensive audit trails for all infrastructure and administrative actions.' },
  { title: 'Network Security', desc: 'Isolated tenant environments with firewall rules and DDoS protection.' },
  { title: 'Incident Response', desc: '24/7 security monitoring with documented incident response procedures.' },
]

export default function Trust() {
  return (
    <PageLayout title="Trust & Security" subtitle="Security, compliance, and data protection — built into everything we do.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {CERTIFICATIONS.map((c) => (
          <div key={c.name} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
            <div className="flex items-center gap-2 mb-3">
              <svg className="text-green-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <h3 className="font-bold">{c.name}</h3>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${c.status === 'Certified' || c.status === 'Compliant' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>{c.status}</span>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-6">Security Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {CONTROLS.map((c) => (
          <div key={c.title} className="bg-[#161616] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition">
            <h3 className="font-bold text-sm mb-2">{c.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">Report a Vulnerability</h2>
        <p className="text-gray-400 text-sm mb-4">We welcome security researchers to report potential vulnerabilities responsibly.</p>
        <a href="mailto:security@hamro.ai" className="text-[#315fff] hover:underline text-sm">security@hamro.ai</a>
        <p className="text-gray-500 text-xs mt-3">We commit to acknowledging reports within 48 hours and resolving validated issues promptly.</p>
      </div>
    </PageLayout>
  )
}
