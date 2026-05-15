import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function ModelLibrary() {
  const models = [
    { name: 'Kimi K2.6', desc: 'Open-source multimodal agentic MoE model with 1T total parameters, 32B activated.', tag: 'Moonshot AI', category: 'Multimodal' },
    { name: 'Qwen3.6 35B A3B', desc: 'Agentic coding MoE with hybrid Gated DeltaNet and vision support.', tag: 'Alibaba', category: 'Coding' },
    { name: 'Gemma 4 31B IT', desc: 'Dense vision-language model by Google with 256K context and thinking mode.', tag: 'Google', category: 'Vision-Language' },
    { name: 'Qwen3.5 27B', desc: 'Dense 27B vision-language model with unified multimodal reasoning.', tag: 'Alibaba', category: 'Multimodal' },
    { name: 'Llama 4 70B', desc: 'Meta\'s latest open-source LLM with native multimodality and long context.', tag: 'Meta', category: 'LLM' },
    { name: 'DeepSeek V3', desc: 'High-performance MoE model with 671B total parameters, 37B activated.', tag: 'DeepSeek', category: 'LLM' },
  ]

  return (
    <PageLayout title="Model Library" subtitle="Pre-configured templates for the most popular open-source models. Deploy in one click.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((m) => (
          <div key={m.name} className="bg-[#161616] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition flex flex-col">
            <div className="mb-3"><span className="text-xs bg-[#222] text-gray-400 px-2 py-0.5 rounded">{m.category}</span></div>
            <h3 className="text-lg font-bold mb-1">{m.name}</h3>
            <p className="text-xs text-[#315fff] mb-3">{m.tag}</p>
            <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">{m.desc}</p>
            <Link to="/dashboard" className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm no-underline transition">Deploy</Link>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
