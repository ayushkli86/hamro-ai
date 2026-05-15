import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const TIMELINE = [
  { year: '2018', event: 'hamro.ai founded with a mission to democratize GPU compute in Nepal.' },
  { year: '2020', event: 'Launched platform with 10 GPUs. First customers in Kathmandu tech community.' },
  { year: '2022', event: 'Expanded to 500+ GPUs. Opened first Nepal data center partnership.' },
  { year: '2024', event: '1,000+ GPUs on platform. SOC 2 certified. Launched Nepal\'s first dedicated GPU cloud.' },
  { year: '2025', event: '10,000+ GPUs. 40+ data centers. Opened regional offices across South Asia.' },
  { year: '2026', event: '20,000+ GPUs. Serving customers in 50+ countries. Nepal\'s largest GPU cloud.' },
]

const VALUES = [
  { title: 'Access', desc: 'GPU compute should be as easy to access as turning on a light switch — starting right here in Nepal.' },
  { title: 'Transparency', desc: 'Real-time pricing, per-second billing, no hidden fees. You see exactly what you pay.' },
  { title: 'Performance', desc: 'Latest GPUs, optimized infrastructure, low-latency connectivity to South Asia and beyond.' },
  { title: 'Community', desc: 'Building Nepal\'s AI ecosystem. Supporting developers, researchers, and startups.' },
]

export default function About() {
  return (
    <PageLayout title="About hamro.ai" subtitle="Making GPU infrastructure accessible to everyone in Nepal and beyond.">
      <div className="max-w-3xl space-y-10">
        <div>
          <p className="text-gray-300 text-lg leading-relaxed">hamro.ai is Nepal's first GPU cloud platform, built by developers for developers. We believe AI infrastructure should be as easy to access as turning on a light switch — and we're starting right here in Nepal.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">To organize, optimize, and orient the world's computation — starting with Nepal. We're building the infrastructure layer where AI agents and developers programmatically provision and manage GPU compute.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">Timeline</h2>
          <div className="space-y-0">
            {TIMELINE.map((t) => (
              <div key={t.year} className="flex gap-4 pb-6 border-l border-gray-800 pl-6 ml-3 relative last:pb-0">
                <div className="absolute left-[-5px] w-2.5 h-2.5 rounded-full bg-[#315fff] mt-1.5" />
                <p className="text-[#315fff] font-bold text-sm w-14 shrink-0">{t.year}</p>
                <p className="text-gray-300 text-sm">{t.event}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-[#161616] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold mb-2">Join Us</h2>
          <p className="text-gray-400 text-sm mb-4">We're always looking for exceptional people to join our team.</p>
          <Link to="/careers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition text-sm">View Open Positions</Link>
        </div>
      </div>
    </PageLayout>
  )
}
