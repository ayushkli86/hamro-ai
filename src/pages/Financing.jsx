import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function Financing() {
  return (
    <PageLayout title="Financing" subtitle="Finance GPU hardware with partners who use your hamro.ai earnings as qualification.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: 'Vast Finance', desc: 'Finance GPU hardware with partners who factor in your hamro.ai platform earnings. Submit once, get multiple offers.' },
          { title: 'Source Hardware', desc: 'Source new or certified refurbished GPUs through our vetted supplier network. Every unit is stress-tested and platform-ready.' },
          { title: 'Presell Capacity', desc: 'Planning a new deployment? Share your upcoming GPU availability with our sales team. Paying customers from day one.' },
        ].map((item) => (
          <div key={item.title} className="bg-[#161616] border border-gray-800 rounded-xl p-6">
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">How Financing Works</h2>
        <div className="space-y-4">
          {[
            { step: '1', text: 'Tell us about your hardware needs — GPU models, quantity, timeline.' },
            { step: '2', text: 'We match you with financing partners who use your platform earnings for qualification.' },
            { step: '3', text: 'Receive offers, compare terms, and choose what works for you.' },
            { step: '4', text: 'Get funded, deploy hardware, and start earning on hamro.ai.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#315fff]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#315fff] font-bold text-sm">{item.step}</span>
              </div>
              <p className="text-gray-300 text-sm pt-1.5">{item.text}</p>
            </div>
          ))}
        </div>
        <Link to="/contact" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline text-sm transition">Get Funded</Link>
      </div>
    </PageLayout>
  )
}
