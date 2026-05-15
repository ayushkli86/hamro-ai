import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const ASSETS = [
  { name: 'Logo — Light', desc: 'For dark backgrounds', format: 'SVG', dimensions: '114×30' },
  { name: 'Logo — Dark', desc: 'For light backgrounds', format: 'SVG', dimensions: '114×30' },
  { name: 'Logo — Icon', desc: 'Favicon / app icon', format: 'SVG', dimensions: '48×48' },
  { name: 'Wordmark', desc: 'hamro.ai wordmark only', format: 'SVG', dimensions: '200×40' },
]

const BRAND_COLORS = [
  { name: 'Primary Blue', hex: '#315fff', usage: 'Primary actions, links, brand' },
  { name: 'Dark Background', hex: '#000000', usage: 'Page background, dark mode' },
  { name: 'Card Background', hex: '#161616', usage: 'Card, container backgrounds' },
  { name: 'Green Accent', hex: '#00d0a2', usage: 'Success states, highlights' },
]

export default function PressKit() {
  return (
    <PageLayout title="Press Kit" subtitle="Brand assets, colors, and guidelines for hamro.ai.">
      <div className="space-y-10">
        <div>
          <h2 className="text-xl font-bold mb-4">Logo Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ASSETS.map((a) => (
              <div key={a.name} className="bg-[#161616] border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-gray-700 transition">
                <div>
                  <h3 className="font-bold text-sm">{a.name}</h3>
                  <p className="text-gray-500 text-xs">{a.desc}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{a.format} — {a.dimensions}</p>
                </div>
                <span className="text-xs text-[#315fff]">Download →</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BRAND_COLORS.map((c) => (
              <div key={c.name} className="rounded-xl overflow-hidden border border-gray-800">
                <div className="h-16" style={{ background: c.hex }} />
                <div className="bg-[#161616] p-3">
                  <p className="font-bold text-xs">{c.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{c.hex}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">Brand Guidelines</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Always use the official logo — do not modify, rotate, or recolor</li>
            <li>• Maintain clear space around the logo equal to the height of the icon</li>
            <li>• Use the light logo on dark backgrounds and dark logo on light backgrounds</li>
            <li>• Refer to the platform as "hamro.ai" (lowercase h) in all communications</li>
            <li>• Do not use the logo in a way that implies endorsement of third-party products</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">For media inquiries and additional assets:</p>
          <a href="mailto:press@hamro.ai" className="text-[#315fff] hover:underline">press@hamro.ai</a>
        </div>
      </div>
    </PageLayout>
  )
}
