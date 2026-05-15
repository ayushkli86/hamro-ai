import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const POSTS = [
  { id: 'introducing-hamroai', title: 'Introducing hamro.ai — Nepal\'s First GPU Cloud', date: 'Jan 15, 2026', content: 'Today we\'re excited to announce the launch of hamro.ai, Nepal\'s first GPU cloud platform. Our mission is to make GPU infrastructure accessible to everyone — starting right here in Nepal. The platform offers on-demand access to thousands of GPUs including RTX 4090, H100, A100, and the latest Blackwell architecture. With per-second billing, real-time pricing, and API-native provisioning, developers can deploy instances in seconds without long-term commitments or enterprise contracts.' },
  { id: 'fine-tune-llama', title: 'How to Fine-Tune Llama 4 on Custom Data', date: 'Feb 2, 2026', content: 'Fine-tuning large language models on custom data is one of the most powerful techniques for adapting AI to your specific use case. In this guide, we\'ll walk through the complete process of fine-tuning Meta\'s Llama 4 on hamro.ai GPUs. You\'ll learn how to prepare your dataset, choose the right GPU (we recommend H100 or A100 for 70B models), launch your instance, run the fine-tuning script, and deploy your fine-tuned model.' },
  { id: 'gpu-benchmarking', title: 'GPU Benchmarking: RTX 4090 vs A100 vs H100', date: 'Mar 10, 2026', content: 'Choosing the right GPU for your workload can significantly impact both performance and cost. In this benchmark comparison, we tested RTX 4090, A100 80GB, and H100 across popular AI/ML workloads including LLM training, inference, image generation, and batch processing. Our results show that while H100 leads in raw training throughput, RTX 4090 offers the best price-performance ratio for inference and fine-tuning tasks.' },
]

export default function BlogPost() {
  const { id } = useParams()
  const post = POSTS.find((p) => p.id === id)
  if (!post) return <PageLayout title="Post not found"><p className="text-gray-400">This blog post doesn't exist. <Link to="/blog" className="text-[#315fff] hover:underline">View all posts →</Link></p></PageLayout>

  return (
    <PageLayout title={post.title}>
      <div className="max-w-3xl">
        <p className="text-sm text-gray-500 mb-6">{post.date}</p>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed text-lg">{post.content}</p>
        </div>
        <Link to="/blog" className="inline-block mt-8 text-sm text-[#315fff] hover:underline">← Back to Blog</Link>
      </div>
    </PageLayout>
  )
}
