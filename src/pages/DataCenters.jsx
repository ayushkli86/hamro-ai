import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const REGIONS = [
  { name: 'Kathmandu, Nepal', flag: '🇳🇵', desc: 'Primary hub — low latency for South Asia' },
  { name: 'Mumbai, India', flag: '🇮🇳', desc: 'Regional data center for India & SAARC' },
  { name: 'Singapore', flag: '🇸🇬', desc: 'Southeast Asia gateway' },
  { name: 'Tokyo, Japan', flag: '🇯🇵', desc: 'East Asia & Pacific hub' },
  { name: 'Frankfurt, Germany', flag: '🇩🇪', desc: 'European Union data center' },
  { name: 'London, UK', flag: '🇬🇧', desc: 'UK & Western Europe' },
  { name: 'Virginia, USA', flag: '🇺🇸', desc: 'US East Coast' },
  { name: 'California, USA', flag: '🇺🇸', desc: 'US West Coast' },
]

export default function DataCenters() {
  return (
    <PageLayout title="Data Centers" subtitle="40+ data center locations worldwide. Deploy close to your users.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {REGIONS.map((r) => (
          <div key={r.name} className="bg-[#161616] border border-gray-800 rounded-xl p-5">
            <span className="text-3xl block mb-2">{r.flag}</span>
            <h3 className="font-bold text-sm">{r.name}</h3>
            <p className="text-gray-500 text-xs mt-1">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold mb-3">SOC 2 Certified</h3>
          <p className="text-gray-400 text-sm leading-relaxed">All data centers maintain SOC 2 Type II certification. Your data is encrypted in transit and at rest, with strict access controls and audit logging.</p>
        </div>
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold mb-3">Data Center Certification</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Run flagship GPUs with verified trust, priority placement, and enterprise deal flow. Apply for our certification program.</p>
          <Link to="/contact" className="inline-block mt-3 text-sm text-[#315fff] hover:underline">Apply for Certification →</Link>
        </div>
      </div>
    </PageLayout>
  )
}
