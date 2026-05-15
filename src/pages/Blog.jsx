import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const POSTS = [
  { id: 'introducing-hamroai', title: 'Introducing hamro.ai — Nepal\'s First GPU Cloud', date: 'Jan 15, 2026', excerpt: 'We\'re building the infrastructure layer for AI in Nepal. Here\'s why.' },
  { id: 'fine-tune-llama', title: 'How to Fine-Tune Llama 4 on Custom Data', date: 'Feb 2, 2026', excerpt: 'A step-by-step guide to fine-tuning Meta\'s latest open-source LLM on hamro.ai GPUs.' },
  { id: 'gpu-benchmarking', title: 'GPU Benchmarking: RTX 4090 vs A100 vs H100', date: 'Mar 10, 2026', excerpt: 'Real-world performance comparisons across popular GPU models on our platform.' },
  { id: 'building-ai-agents', title: 'Building AI Agents on hamro.ai', date: 'Apr 5, 2026', excerpt: 'How to deploy autonomous AI agents that procure and manage their own compute.' },
]

export default function Blog() {
  return (
    <PageLayout title="Blog" subtitle="Updates, tutorials, and stories from the hamro.ai team.">
      <div className="space-y-6">
        {POSTS.map((p) => (
          <Link key={p.id} to={`/blog/${p.id}`} className="block bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition no-underline">
            <p className="text-xs text-gray-500 mb-2">{p.date}</p>
            <h3 className="text-xl font-bold mb-2 text-white">{p.title}</h3>
            <p className="text-gray-400 text-sm">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}
