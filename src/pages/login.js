import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-cyan-400 italic">LOGIN FLUXZ</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Seu E-mail" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Sua Senha" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
            ENTRAR NO SISTEMA
          </button>
        </form>
      </div>
    </div>
  )
}
