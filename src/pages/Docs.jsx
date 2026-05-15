import PageLayout from '../components/PageLayout'

export default function Docs() {
  const sections = [
    { title: 'Quickstart', desc: 'Get started with hamro.ai in under 5 minutes. Add credit, grab your API key, and deploy your first GPU instance.' },
    { title: 'CLI Reference', desc: 'Full documentation for the hamro.ai CLI — search GPUs, deploy instances, manage your account from the terminal.' },
    { title: 'Python SDK', desc: 'Programmatic compute provisioning in five lines of code. Deploy, scale, and monitor GPU instances from Python.' },
    { title: 'REST API', desc: 'The interface agents call to provision infrastructure. Real-time pricing, per-second billing, programmatic everything.' },
    { title: 'API Keys', desc: 'Manage your API keys, set permissions, and rotate credentials securely.' },
    { title: 'SDK Examples', desc: 'Ready-to-run examples for training, inference, fine-tuning, and rendering workloads.' },
  ]

  return (
    <PageLayout title="Documentation" subtitle="Everything you need to deploy and manage GPU infrastructure with hamro.ai.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((s) => (
          <div key={s.title} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
            <h3 className="text-lg font-bold mb-2">{s.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 bg-[#161616] border border-gray-800 rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">Install hamro.ai CLI</h2>
        <code className="bg-[#0d1117] text-[#e6edf3] text-sm font-mono px-4 py-3 rounded-md block overflow-x-auto">pip install hamro-ai</code>
        <p className="text-gray-400 text-sm mt-3">One install gives you both the CLI and Python SDK.</p>
      </div>
    </PageLayout>
  )
}
