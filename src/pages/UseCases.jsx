import PageLayout from '../components/PageLayout'

export default function UseCases() {
  const items = [
    { title: 'AI/ML Frameworks', desc: 'Train and deploy PyTorch, TensorFlow, and JAX models on high-performance GPUs.', icon: '🧠' },
    { title: 'AI Text Generation', desc: 'Run LLM inference for chatbots, content generation, and code assistants.', icon: '💬' },
    { title: 'AI Image + Video Generation', desc: 'Generate images and videos with Stable Diffusion, Runway, and custom models.', icon: '🎨' },
    { title: 'AI Agents', desc: 'Deploy autonomous AI agents that design, procure, and optimize their own compute.', icon: '🤖' },
    { title: 'Batch Data Processing', desc: 'Process large datasets in parallel across multiple GPUs.', icon: '📊' },
    { title: 'Audio-to-Text Transcription', desc: 'Transcribe audio at scale with Whisper and other ASR models.', icon: '🎤' },
    { title: 'AI Fine Tuning', desc: 'Fine-tune open-source models on your custom datasets.', icon: '🔧' },
    { title: 'GPU Programming', desc: 'Develop and test CUDA, OpenCL, and Vulkan applications.', icon: '💻' },
    { title: 'Graphics Rendering', desc: 'Render 3D scenes and visual effects with GPU-accelerated renderers.', icon: '🎬' },
  ]

  return (
    <PageLayout title="Use Cases" subtitle="From training to inference, fine-tuning to rendering — run any GPU workload on hamro.ai.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.title} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
            <span className="text-3xl mb-4 block">{item.icon}</span>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
