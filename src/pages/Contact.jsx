import { useState } from 'react'
import PageLayout from '../components/PageLayout'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <PageLayout title="Contact Sales" subtitle="Talk to our team about enterprise plans, dedicated clusters, and customized solutions.">
      <div className="max-w-lg">
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-8">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="text-green-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-white font-bold text-lg">Message Sent!</p>
              <p className="text-gray-400 text-sm mt-1">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm text-blue-400 hover:underline cursor-pointer bg-transparent border-none">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="text-sm text-gray-400 block mb-1">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" required /></div>
              <div><label className="text-sm text-gray-400 block mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" required /></div>
              <div><label className="text-sm text-gray-400 block mb-1">Message</label><textarea rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" required /></div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition cursor-pointer">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
