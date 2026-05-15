import PageLayout from '../components/PageLayout'

export default function CaseStudies() {
  const studies = [
    { company: 'Creatix Technology', title: 'Scales to 200K Daily Users', desc: 'How a fast-growing AI app company cut infrastructure costs by over 60% and powered millions of new users with hamro.ai.', tag: 'Tech' },
    { company: 'PAICON', title: 'Global Cancer Diagnostics', desc: 'How a global oncology data platform used hamro.ai to rapidly iterate on AI models for cancer detection.', tag: 'Medical AI' },
    { company: 'Kathmandu AI Labs', title: 'Doubled Training Throughput', desc: 'Nepali AI startup doubled model training throughput while cutting infrastructure spend by half.', tag: 'AI Research' },
  ]

  return (
    <PageLayout title="Case Studies" subtitle="See how teams use hamro.ai to scale AI infrastructure and accelerate production workloads.">
      <div className="space-y-6">
        {studies.map((s) => (
          <div key={s.company} className="bg-[#161616] border border-gray-800 rounded-xl p-8">
            <p className="text-[#315fff] text-sm font-semibold mb-1">{s.company}</p>
            <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-4">{s.desc}</p>
            <span className="text-xs bg-[#222] text-gray-400 px-2 py-0.5 rounded">{s.tag}</span>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
