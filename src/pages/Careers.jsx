import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function Careers() {
  return (
    <PageLayout title="Careers" subtitle="Build where the boundaries end. If our mission hits something in you, keep reading.">
      <div className="max-w-3xl space-y-8">
        <p className="text-gray-300 text-lg leading-relaxed">hamro.ai is organizing and optimizing the world's computation. We're building the infrastructure layer where AI agents and developers programmatically provision and manage GPU compute — starting in Nepal.</p>

        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Our Mission</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Make GPU infrastructure accessible to everyone. We believe AI infrastructure should be as easy to access as turning on a light switch — and we're starting right here in Nepal.</p>
        </div>

        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3">Open Positions</h3>
          <div className="space-y-3">
            {[
              { title: 'Full Stack Engineer', loc: 'Kathmandu / Remote', type: 'Full-time' },
              { title: 'GPU Infrastructure Engineer', loc: 'Kathmandu', type: 'Full-time' },
              { title: 'AI/ML Solutions Engineer', loc: 'Remote', type: 'Full-time' },
              { title: 'Customer Success Manager', loc: 'Kathmandu', type: 'Full-time' },
            ].map((job) => (
              <div key={job.title} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-semibold text-sm">{job.title}</p>
                  <p className="text-gray-500 text-xs">{job.loc} — {job.type}</p>
                </div>
                <span className="text-xs text-[#315fff]">Apply →</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161616] border border-gray-800 rounded-xl p-8 text-center">
          <h3 className="font-bold text-lg mb-2">Don't see the right role?</h3>
          <p className="text-gray-400 text-sm mb-4">We're always looking for exceptional people. Send your resume.</p>
          <a href="mailto:careers@hamro.ai" className="inline-flex items-center gap-2 px-6 py-3 bg-[#315fff] hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition text-sm">careers@hamro.ai</a>
        </div>
      </div>
    </PageLayout>
  )
}
