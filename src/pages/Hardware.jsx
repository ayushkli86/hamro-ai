import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const GPUS = [
  { name: 'H100 SXM', vram: '80GB HBM3', arch: 'Hopper', price: '$3.49/hr', stock: 'Limited' },
  { name: 'H200', vram: '141GB HBM3e', arch: 'Hopper', price: '$4.20/hr', stock: 'High Demand' },
  { name: 'A100 80GB', vram: '80GB HBM2e', arch: 'Ampere', price: '$2.50/hr', stock: 'Available' },
  { name: 'RTX 5090', vram: '32GB GDDR7', arch: 'Blackwell', price: '$0.85/hr', stock: 'Limited Supply' },
  { name: 'RTX 4090', vram: '24GB GDDR6X', arch: 'Ada Lovelace', price: '$0.33/hr', stock: 'Available' },
  { name: 'B200', vram: '192GB HBM3e', arch: 'Blackwell', price: 'TBD', stock: 'Coming Soon' },
]

export default function Hardware() {
  return (
    <PageLayout title="GPU Hardware" subtitle="Source GPUs that are ready to earn. New and certified refurbished, stress-tested and platform-ready.">
      <div className="overflow-x-auto mb-12">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-white/10 text-left">
              <th className="pb-3 pr-6">GPU Model</th><th className="pb-3 pr-6">VRAM</th><th className="pb-3 pr-6">Architecture</th><th className="pb-3 pr-6">Est. Price</th><th className="pb-3">Availability</th>
            </tr>
          </thead>
          <tbody>
            {GPUS.map((g) => (
              <tr key={g.name} className="border-b border-white/5">
                <td className="py-3 pr-6 font-semibold">{g.name}</td>
                <td className="py-3 pr-6 text-gray-400">{g.vram}</td>
                <td className="py-3 pr-6 text-gray-400">{g.arch}</td>
                <td className="py-3 pr-6">{g.price}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    g.stock === 'Available' ? 'bg-green-900 text-green-400' :
                    g.stock === 'Limited' || g.stock === 'Limited Supply' ? 'bg-yellow-900 text-yellow-400' :
                    g.stock === 'Coming Soon' ? 'bg-blue-900 text-blue-400' :
                    'bg-red-900 text-red-400'
                  }`}>{g.stock}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-6">Vast Certified — Every Unit Tested</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { title: 'Burn-in Testing', desc: '72-hour stress test under full load' },
          { title: 'VRAM Validation', desc: 'Complete memory check, no defects' },
          { title: 'Benchmark Scoring', desc: 'Performance verified against reference' },
          { title: 'Thermal Profiling', desc: 'Cooling confirmed under sustained load' },
        ].map((item) => (
          <div key={item.title} className="bg-[#161616] border border-gray-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center mb-3">
              <svg className="text-green-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4M7.86 2h8.28L22 5.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"/></svg>
            </div>
            <h3 className="font-bold text-sm mb-1">{item.title}</h3>
            <p className="text-gray-500 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Get a Quote</h2>
        <p className="text-gray-400 text-sm mb-6">Tell us what you need. We'll source from multiple suppliers.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition">Request Quote</Link>
      </div>
    </PageLayout>
  )
}
