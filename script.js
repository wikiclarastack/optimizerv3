const SB_URL = "https://ohozsfqsocwjpwoioqef.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ob3pzZnFzb2N3anB3b2lvcWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTYxNTIsImV4cCI6MjA4OTE3MjE1Mn0.Of-dTDu17P62PK24kTn4IQfqNjUJLvmpisw481e-Yoc";

const _supabase = supabase.createClient(SB_URL, SB_KEY);
lucide.createIcons();

function notify(text, color = "#06b6d4") {
    Toastify({
        text: text,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: { 
            background: "#0a0a0a", 
            border: `1px solid ${color}`, 
            borderRadius: "15px", 
            color: color, 
            fontWeight: "bold",
            boxShadow: `0 0 20px ${color}33`
        }
    }).showToast();
}

function router(page) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(`${page}-page`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('reveal');
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        notify("Acesso Negado: " + error.message, "#ef4444");
    } else {
        const user = data.user;
        
        const { data: profile } = await _supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        confetti({ 
            particleCount: 150, 
            spread: 70, 
            origin: { y: 0.6 }, 
            colors: ['#06b6d4', '#8b5cf6'] 
        });
        
        if (profile && profile.is_admin) {
            notify("BEM-VINDO, ADMINISTRADOR", "#06b6d4");
            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1500);
        } else {
            document.getElementById('display-user').innerText = user.email.toUpperCase();
            notify("Conectado com sucesso!");
            setTimeout(() => {
                router('dashboard');
                loadUpdates();
            }, 1000);
        }
    }
});

async function loadUpdates() {
    const { data, error } = await _supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false });

    const container = document.getElementById('updatesContainer');
    
    if (data && data.length > 0) {
        container.innerHTML = data.map(up => `
            <div class="group border-l-4 border-white/5 pl-6 py-2 transition-all hover:border-cyan-500 bg-white/[0.01] rounded-r-2xl">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-white font-black italic tracking-tighter uppercase text-xl">${up.version}</span>
                    <span class="text-[10px] font-mono text-gray-600">${new Date(up.created_at).toLocaleDateString()}</span>
                </div>
                <p class="text-gray-400 font-light leading-relaxed">${up.changelog}</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="text-gray-600 italic">Nenhum log de atualização disponível.</p>';
    }
}

async function logout() {
    await _supabase.auth.signOut();
    notify("Sessão Encerrada", "#8b5cf6");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}

_supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        const { data: profile } = await _supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

        if (profile && profile.is_admin && window.location.pathname.includes('index.html')) {
            const adminBtn = document.createElement('button');
            adminBtn.innerHTML = '<i data-lucide="shield-alert"></i> PAINEL ADMIN';
            adminBtn.className = "fixed bottom-5 left-5 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-black z-50 flex items-center gap-2 shadow-lg hover:bg-red-500 transition-all";
            adminBtn.onclick = () => window.location.href = "admin.html";
            document.body.appendChild(adminBtn);
            lucide.createIcons();
        }
    }
});
