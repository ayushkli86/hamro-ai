import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const PRODUCTS = {
  'gpu-cloud': {
    name: 'GPU Cloud',
    desc: 'On-demand GPU instances across 40+ data centers and 20,000+ GPUs. Deploy in seconds via CLI, SDK, or API.',
    features: ['20,000+ GPUs worldwide', '40+ data center locations', 'Per-second billing', 'API-native provisioning', 'Real-time pricing', '68+ GPU types'],
  },
  'serverless': {
    name: 'Serverless Inference',
    desc: 'Deploy models as endpoints with automatic benchmarking and optimization across GPU types. Autoscale to zero, pay only for compute time.',
    features: ['Automatic GPU selection', 'Auto-scaling to zero', 'Built-in benchmarking', 'Multi-model endpoints', 'Usage-based pricing', 'Nepal region support'],
  },
  'clusters': {
    name: 'GPU Clusters',
    desc: 'Dedicated multi-node GPU clusters with InfiniBand networking for large-scale training jobs.',
    features: ['Multi-node clusters', 'InfiniBand networking', 'Dedicated instances', 'Priority scheduling', '24/7 support', 'Custom SLAs'],
  },
}

export default function ProductPage() {
  const { name } = useParams()
  const product = PRODUCTS[name]
  if (!product) return <PageLayout title="Product not found"><p className="text-gray-400">This product doesn't exist.</p></PageLayout>

  return (
    <PageLayout title={product.name} subtitle={product.desc}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {product.features.map((f) => (
          <div key={f} className="bg-[#161616] border border-gray-800 rounded-lg p-4 flex items-center gap-3">
            <svg className="text-green-400 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm text-gray-300">{f}</span>
          </div>
        ))}
      </div>
      <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg no-underline transition">Get Started</Link>
    </PageLayout>
  )
}
