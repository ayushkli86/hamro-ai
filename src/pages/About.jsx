import PageLayout from '../components/PageLayout'

export default function About() {
  return (
    <PageLayout title="About hamro.ai" subtitle="Making GPU infrastructure accessible to everyone in Nepal and beyond.">
      <div className="space-y-8 max-w-3xl">
        <p className="text-gray-300 text-lg leading-relaxed">hamro.ai is Nepal's first GPU cloud platform, built by developers for developers. We believe AI infrastructure should be as easy to access as turning on a light switch.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[#315fff]">20K+</p>
            <p className="text-gray-400 text-sm mt-1">GPUs Available</p>
          </div>
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[#315fff]">40+</p>
            <p className="text-gray-400 text-sm mt-1">Data Centers</p>
          </div>
          <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[#315fff]">700K+</p>
            <p className="text-gray-400 text-sm mt-1">Transactions/mo</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
