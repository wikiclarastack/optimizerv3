import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import { Download, RefreshCw, Activity, Terminal } from 'lucide-react'

export default function Dashboard() {
  const [updates, setUpdates] = useState([])
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
    }

    const fetchUpdates = async () => {
      const { data } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false })
      setUpdates(data)
    }

    checkUser()
    fetchUpdates()
  }, [])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CENTRAL DO CLIENTE</h1>
            <p className="text-cyan-500 font-mono text-sm">{user.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg border border-red-500/20 text-sm">Sair</button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-4 italic">FLUXZ OPTIMIZATOR <span className="text-cyan-400">PRO</span></h2>
                <p className="text-gray-400 mb-8 max-w-md">Baixe a build mais estável e otimizada para o seu hardware atual.</p>
                <button className="flex items-center gap-3 bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95">
                  <Download size={24} /> DOWNLOAD INSTALADOR
                </button>
              </div>
              <Terminal className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 rotate-12 transition-transform group-hover:rotate-0" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 italic underline decoration-cyan-500 underline-offset-8">HISTÓRICO DE UPDATES</h3>
              {updates.map((up) => (
                <div key={up.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/30 tracking-widest">{up.version}</span>
                    <span className="text-gray-500 text-xs">{new Date(up.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-light">{up.changelog}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
              <h4 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-widest">Status do Hardware</h4>
              <div className="space-y-3">
                <StatRow label="Conexão Engine" value="Online" color="text-green-400" />
                <StatRow label="Threads Ativas" value="16" color="text-white" />
                <StatRow label="Uso de RAM" value="3.2 GB" color="text-white" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, color }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
      <span className="text-gray-400 font-light">{label}</span>
      <span className={`font-mono font-bold ${color}`}>{value}</span>
    </div>
  )
}
