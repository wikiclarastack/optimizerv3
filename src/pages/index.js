<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fluxz Optimizator | Performance</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { background-color: #050505; color: white; font-family: ui-sans-serif, system-ui; overflow-x: hidden; }
        .glass { background: rgba(10, 10, 10, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); }
        .hidden { display: none; }
        .gradient-text { background: linear-gradient(90deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    </style>
</head>
<body>

    <nav class="fixed w-full z-50 p-6 glass flex justify-between items-center">
        <div class="text-2xl font-black italic tracking-tighter uppercase">Fluxz<span class="text-cyan-500 underline decoration-cyan-500">.</span></div>
        <div id="nav-actions">
            <button onclick="router('login')" class="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full border border-white/10 transition-all text-sm font-bold tracking-widest uppercase">Portal</button>
        </div>
    </nav>

    <section id="home-page" class="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 class="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none uppercase italic">Optimizator <br><span class="gradient-text">Engine.</span></h1>
        <p class="text-gray-400 max-w-lg mb-10 text-lg">Performance bruta para hardware limitado. Redução de latência em nível kernel.</p>
        <button onclick="router('login')" class="bg-cyan-500 hover:bg-cyan-400 text-black px-12 py-4 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-[0_0_40px_rgba(6,182,212,0.2)]">ENTRAR NA ÁREA RESTRITA</button>
    </section>

    <section id="login-page" class="min-h-screen flex items-center justify-center px-6 hidden">
        <div class="w-full max-w-md glass p-10 rounded-3xl shadow-2xl border border-cyan-500/20">
            <h2 class="text-3xl font-black mb-8 text-center italic tracking-tighter">CLIENT LOGIN</h2>
            <form id="loginForm" class="space-y-4">
                <input type="email" id="email" placeholder="E-mail" class="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500 outline-none transition-all" required>
                <input type="password" id="password" placeholder="Senha" class="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500 outline-none transition-all" required>
                <button type="submit" class="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-black text-lg transition-all uppercase tracking-widest">Acessar</button>
                <button type="button" onclick="router('home')" class="w-full text-gray-500 text-xs hover:text-white mt-4 uppercase tracking-widest">Voltar ao Início</button>
            </form>
        </div>
    </section>

    <section id="dashboard-page" class="min-h-screen p-6 pt-32 hidden">
        <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-12">
                <h2 class="text-4xl font-black tracking-tighter italic uppercase">Dashboard</h2>
                <button onclick="logout()" class="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors font-bold uppercase text-xs">Deslogar</button>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    <div class="bg-gradient-to-br from-[#0a0a0a] to-[#151515] p-10 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div class="relative z-10">
                            <h3 class="text-2xl font-bold mb-2 italic">FLUXZ PRO INSTALADOR</h3>
                            <p class="text-gray-400 mb-8 text-sm">Download seguro via CDN. Verifique a assinatura do arquivo após o download.</p>
                            <button id="dl-btn" class="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-cyan-400 transition-all uppercase tracking-tighter">
                                <i data-lucide="download"></i> Download v2.4.1
                            </button>
                        </div>
                    </div>
                    
                    <div class="glass p-8 rounded-3xl">
                        <h3 class="text-lg font-bold mb-6 flex items-center gap-2 tracking-widest text-cyan-500 uppercase italic">Registro de Atualizações</h3>
                        <div id="updatesContainer" class="space-y-6 text-sm text-gray-400">
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="glass p-6 rounded-3xl border border-cyan-500/10">
                        <h4 class="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-[0.2em]">Status do Cliente</h4>
                        <div class="flex justify-between py-2 border-b border-white/5"><span class="text-gray-500">Licença</span><span class="text-white font-mono">FOREVER</span></div>
                        <div class="flex justify-between py-2"><span class="text-gray-500">Build</span><span class="text-cyan-400 font-mono">v2.4.1 Stable</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        const SB_URL = window.process?.env?.NEXT_PUBLIC_SUPABASE_URL || "https://ohozsfqsocwjpwoioqef.supabase.co";
        const SB_KEY = window.process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ob3pzZnFzb2N3anB3b2lvcWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTYxNTIsImV4cCI6MjA4OTE3MjE1Mn0.Of-dTDu17P62PK24kTn4IQfqNjUJLvmpisw481e-Yoc";
        
        const _supabase = supabase.createClient(SB_URL, SB_KEY);

        lucide.createIcons();

        function router(page) {
            document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
            const target = document.getElementById(`${page}-page`);
            if (target) target.classList.remove('hidden');
        }

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
            if (error) {
                alert("Falha: " + error.message);
            } else {
                router('dashboard');
                loadUpdates();
            }
        });

        async function loadUpdates() {
            const { data } = await _supabase.from('updates').select('*').order('created_at', { ascending: false });
            const container = document.getElementById('updatesContainer');
            if (data) {
                container.innerHTML = data.map(up => `
                    <div class="border-l-2 border-cyan-500/20 pl-4">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-white font-bold italic">${up.version}</span>
                            <span class="text-[10px] uppercase font-mono">${new Date(up.created_at).toLocaleDateString()}</span>
                        </div>
                        <p class="font-light">${up.changelog}</p>
                    </div>
                `).join('');
            }
        }

        async function logout() {
            await _supabase.auth.signOut();
            location.reload();
        }
    </script>
</body>
</html>
