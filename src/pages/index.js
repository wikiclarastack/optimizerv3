import Head from 'next/head'
import Link from 'next/link'
import { Zap, Shield, Cpu, MousePointer2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <Head>
        <title>Fluxz Optimizator | Peak Performance</title>
      </Head>

      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black italic tracking-tighter">FLUXZ<span className="text-cyan-500">.</span></div>
        <Link href="/login" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full transition-all">
          Área do Cliente
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium animate-bounce">
            Nova Versão v2.4 Disponível
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
            DOMINE O <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">GAMEPLAY.</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Otimização de nível kernel para reduzir input lag, limpar processos inúteis e estabilizar seus frames.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all">
              Obter Agora
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-32">
          <FeatureCard 
            icon={<Zap className="text-cyan-400" />} 
            title="Zero Latency" 
            desc="Otimização de registros para resposta instantânea do mouse e teclado." 
          />
          <FeatureCard 
            icon={<Cpu className="text-purple-500" />} 
            title="Debloat Total" 
            desc="Remove telemetria e processos em segundo plano que roubam sua CPU." 
          />
          <FeatureCard 
            icon={<Shield className="text-blue-500" />} 
            title="Safe Mode" 
            desc="Algoritmos inteligentes que não danificam os arquivos do seu sistema." 
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/50 transition-all group">
      <div className="mb-4 p-3 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  )
}
