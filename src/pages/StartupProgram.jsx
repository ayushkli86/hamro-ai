import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function StartupProgram() {
  return (
    <PageLayout title="Startup Program" subtitle="Get $500 in free compute credits and dedicated support for your startup.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
          { title: '$500 Free Credits', desc: 'Get started with $500 in compute credits to train, fine-tune, and deploy your models.' },
          { title: 'Priority GPUs', desc: 'Access to high-demand GPUs like H100 and RTX 5090 with priority scheduling.' },
          { title: 'Technical Support', desc: 'Dedicated engineering support to help you optimize your workloads.' },
          { title: 'No Lock-in', desc: 'Pay-as-you-go pricing with no minimums or long-term commitments.' },
          { title: 'API Access', desc: 'Full API, CLI, and SDK access for programmatic infrastructure management.' },
          { title: 'Nepal-first', desc: 'Deploy in Nepal data centers for lowest latency in the region.' },
        ].map((item) => (
          <div key={item.title} className="bg-[#161616] border border-gray-800 rounded-xl p-6">
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">Eligibility</h2>
        <ul className="space-y-2 mb-6">
          {[
            'Early-stage startup (less than 5 years old)',
            'Building AI/ML products or services',
            'Based in or serving Nepal/South Asia',
            'Less than $5M in total funding',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="text-green-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              {item}
            </li>
          ))}
        </ul>
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition text-sm">Apply Now</Link>
      </div>
    </PageLayout>
  )
}
