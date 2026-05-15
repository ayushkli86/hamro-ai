import PageLayout from '../components/PageLayout'

const RELEASES = [
  { title: 'hamro.ai Launches Nepal\'s First GPU Cloud Platform', date: 'Jan 15, 2026', summary: 'hamro.ai announced the launch of Nepal\'s first GPU cloud platform, making high-performance computing accessible to developers and AI teams across the region.' },
  { title: 'hamro.ai Achieves SOC 2 Certification', date: 'Feb 20, 2026', summary: 'hamro.ai announced it has achieved SOC 2 Type II certification, demonstrating its commitment to security and data protection.' },
  { title: 'hamro.ai Partners with Leading GPU Suppliers', date: 'Mar 10, 2026', summary: 'New partnerships ensure access to latest GPU hardware including H100, RTX 5090, and Blackwell architecture.' },
  { title: 'hamro.ai Startup Program Opens Applications', date: 'Apr 5, 2026', summary: 'New program offers $500 in free compute credits to early-stage AI startups building in Nepal and South Asia.' },
]

export default function Press() {
  return (
    <PageLayout title="Press Releases" subtitle="Latest news and announcements from hamro.ai.">
      <div className="space-y-6 mb-12">
        {RELEASES.map((r) => (
          <div key={r.title} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
            <p className="text-xs text-gray-500 mb-2">{r.date}</p>
            <h3 className="text-lg font-bold mb-2">{r.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{r.summary}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 text-center">
        <h3 className="font-bold text-lg mb-2">Media Contact</h3>
        <p className="text-gray-400 text-sm mb-1">For press inquiries, please contact:</p>
        <a href="mailto:press@hamro.ai" className="text-[#315fff] hover:underline text-sm">press@hamro.ai</a>
      </div>
    </PageLayout>
  )
}
