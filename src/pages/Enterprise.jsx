import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const FEATURES = [
  { title: 'Bulk Pricing', desc: 'Custom pricing tiers and volume discounts for large-scale AI deployments. The bigger your deployment, the more you save.', icon: '📦' },
  { title: 'Compliance Ready', desc: 'Fully isolated GPU clusters built for regulated, high-compliance environments. SOC 2 certified.', icon: '🔒' },
  { title: 'Private Networking', desc: 'Secure network paths, high-speed bandwidth, VPN support, and scalable storage solutions.', icon: '🌐' },
  { title: 'White-Glove Support', desc: 'Hands-on onboarding, optimization, and dedicated 24/7 enterprise-level support from our team.', icon: '🤝' },
  { title: 'Custom Workflows', desc: 'Tailored environments and workflow support for complex ML/AI projects and proprietary stacks.', icon: '⚙️' },
  { title: 'Single-Tenant Isolation', desc: 'Deploy on dedicated GPU hardware with zero shared compute. Complete environment isolation.', icon: '🛡️' },
]

const CASE_STUDIES = [
  { stat: '200K+', label: 'Scaled from zero to 200K MAU within 12 months', tag: 'Tech' },
  { stat: '8x 4090', label: 'Massive multi-GPU clusters for large-scale LLM training', tag: 'AI Research' },
  { stat: '80%', label: 'Cost savings vs big-cloud pricing for multi-GPU ML workloads', tag: 'Startup' },
]

const SUPPORT_TIERS = [
  { title: 'Onboarding & Optimization', desc: 'Work with engineers to configure, launch, and optimize your deployment for peak performance.' },
  { title: 'Priority Response', desc: 'Guaranteed SLA-backed response times with rapid escalation pathways for production-critical issues.' },
  { title: 'Live Support & Experts', desc: 'Access live technical support plus AI infrastructure specialists for architectural consulting.' },
]

export default function Enterprise() {
  return (
    <PageLayout title="Enterprise" subtitle="AI Infrastructure that Scales with You — from hundreds to thousands of GPUs.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {CASE_STUDIES.map((c) => (
          <div key={c.stat} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
            <p className="text-3xl font-bold text-[#315fff]">{c.stat}</p>
            <p className="text-gray-400 text-sm mt-2 mb-3">{c.label}</p>
            <span className="text-xs bg-[#222] text-gray-400 px-2 py-0.5 rounded">{c.tag}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Why Enterprises Build on hamro.ai</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
            <span className="text-2xl block mb-3">{f.icon}</span>
            <h3 className="font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 mb-12">
        <h2 className="text-xl font-bold mb-6">Support Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUPPORT_TIERS.map((t) => (
            <div key={t.title} className="border border-gray-700 rounded-lg p-5">
              <h3 className="font-bold text-sm mb-2">{t.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 mb-12">
        <h2 className="text-xl font-bold mb-6">Security & Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'SOC 2 Certified', desc: 'Compliance-ready infrastructure with isolated environments and full data control.' },
            { title: 'Single-Tenant Isolation', desc: 'Dedicated GPU hardware with zero shared compute, preventing cross-tenant risks.' },
            { title: 'Data Sovereignty', desc: 'Full control over data lifecycle with on-demand deletion and guaranteed removal.' },
            { title: 'Custom Security', desc: 'Optional private VPNs, persistent audit logging, and custom security profiles.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <svg className="text-green-400 shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              <div><h3 className="font-bold text-sm">{item.title}</h3><p className="text-gray-400 text-xs mt-1">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition text-lg">Talk to Sales</Link>
        <p className="text-gray-500 text-sm mt-3">No commitments. No sales calls. Just infrastructure.</p>
      </div>
    </PageLayout>
  )
}
