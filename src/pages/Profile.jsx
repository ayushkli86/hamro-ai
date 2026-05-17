import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authApi, profileApi } from '../api'
import ThemeToggle from '../components/ThemeToggle'
import CurrencyToggle from '../components/CurrencyToggle'
import Price from '../components/Price'

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

export default function Profile() {
  const { user, logout, refreshUser } = useAuth()
  const toast = useToast()
  const fileRef = useRef(null)
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  useEffect(() => { document.title = 'Profile — hamro.ai' }, [])

  const avatarUrl = (path) => path ? `${API.replace('/api', '')}${path}` : null

  useEffect(() => {
    profileApi.get().then((p) => {
      setProfile(p)
      setName(p.name || '')
      setPhone(p.phone || '')
    }).catch((err) => toast(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await profileApi.update({ name, phone })
      setProfile(updated)
      refreshUser()
      toast('Profile updated', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const data = await profileApi.uploadAvatar(file)
      setProfile((prev) => ({ ...prev, avatar: data.avatar }))
      refreshUser()
      toast('Avatar uploaded', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const handlePassword = async () => {
    if (!pwCurrent || !pwNew) return toast('Fill in both fields', 'error')
    if (pwNew.length < 6) return toast('Password must be at least 6 characters', 'error')
    setPwLoading(true)
    try {
      const data = await authApi.changePassword(pwCurrent, pwNew)
      toast(data.message, 'success')
      setPwCurrent('')
      setPwNew('')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header className="border-b px-4 md:px-8 py-3 md:py-4 flex flex-wrap items-center gap-2 justify-between" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-lg md:text-xl font-bold">hamro.ai</h1>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-green-400 text-sm md:text-base"><Price usd={user?.balance || 0} /></span>
          <span className="text-gray-400 text-sm hidden sm:inline">{user?.name}</span>
          <CurrencyToggle />
          <ThemeToggle />
          <Link to="/dashboard" className="text-blue-400 text-sm hover:underline">Dashboard</Link>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white cursor-pointer bg-transparent border-none">Logout</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Profile</h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                {profile?.avatar ? (
                  <img src={avatarUrl(profile.avatar)} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-white/10" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#161616] border-2 border-white/10 flex items-center justify-center text-2xl text-gray-500">
                    {(profile?.name || '?')[0]}
                  </div>
                )}
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center cursor-pointer border-2 border-[var(--bg)] disabled:opacity-50">
                  {uploading ? '...' : '+'}
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatar} />
              </div>
              <div>
                <p className="font-semibold text-lg">{profile?.name}</p>
                <p className="text-sm text-gray-400">{profile?.email}</p>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Email</label>
                <input type="email" value={profile?.email || ''} readOnly
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <button onClick={handleSave} disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer text-sm">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <h3 className="font-bold mb-4">Change Password</h3>
              <div className="space-y-3 max-w-md">
                <input type="password" placeholder="Current password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
                <input type="password" placeholder="New password (min 6 chars)" value={pwNew} onChange={(e) => setPwNew(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
                <button onClick={handlePassword} disabled={pwLoading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer text-sm">
                  {pwLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
