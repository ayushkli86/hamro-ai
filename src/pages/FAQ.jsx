import { useState } from 'react'
import PageLayout from '../components/PageLayout'

const QAS = [
  { q: 'What is hamro.ai?', a: 'hamro.ai is a GPU cloud platform that lets you rent high-performance GPUs on demand. Deploy instances in seconds via CLI, SDK, or API.' },
  { q: 'How do I get started?', a: 'Sign up for an account, add credit (starting at $5), grab your API key from the console, and deploy your first GPU instance.' },
  { q: 'What GPUs are available?', a: 'We offer 68+ GPU types including RTX 4090, RTX 5090, H100, A100, and RTX PRO 6000 S, available across 40+ data centers.' },
  { q: 'How does billing work?', a: 'Per-second billing with no minimums. You only pay for the compute time you use. Prices are set by supply and demand in real-time.' },
  { q: 'Is hamro.ai available in Nepal?', a: 'Yes! We have data center presence in Nepal and the region, optimized for low-latency access.' },
  { q: 'Can I use my own API keys?', a: 'Yes, you can generate and manage API keys from the console. We support programmatic access via REST API, Python SDK, and CLI.' },
  { q: 'What about security?', a: 'We are SOC 2 certified. All data is encrypted in transit and at rest. Instances run in isolated environments.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <PageLayout title="FAQs" subtitle="Common questions about hamro.ai.">
      <div className="max-w-3xl space-y-3">
        {QAS.map((item, i) => (
          <div key={i} className="bg-[#161616] border border-gray-800 rounded-xl overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-none text-white font-semibold hover:bg-white/5 transition">
              {item.q}
              <svg className={`shrink-0 transition ${open === i ? 'rotate-180' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {open === i && <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{item.a}</div>}
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
