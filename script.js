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
        style: { background: "#0a0a0a", border: `1px solid ${color}`, borderRadius: "15px", color: color, fontWeight: "bold" }
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
        notify("Erro: " + error.message, "#ef4444");
    } else {
        const user = data.user;
        const { data: profile } = await _supabase.from('profiles').select('is_admin').eq('id', user.id).single();

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        document.getElementById('display-user').innerText = `AUTENTICADO: ${user.email}`;
        
        // Libera as ferramentas se for Admin
        if (profile && profile.is_admin) {
            document.getElementById('admin-tools').classList.remove('hidden');
            notify("BEM-VINDO, ADMIN", "#ef4444");
        } else {
            document.getElementById('admin-tools').classList.add('hidden');
            notify("Conectado!");
        }

        router('dashboard');
        loadUpdates();
    }
});

// Postagem de Update (Só funciona se for Admin no Supabase)
document.getElementById('adminUpdateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const version = document.getElementById('version').value;
    const changelog = document.getElementById('changelog').value;

    const { error } = await _supabase.from('updates').insert([{ version, changelog }]);

    if (error) {
        notify("Erro ao publicar: " + error.message, "#ef4444");
    } else {
        notify("Update publicado com sucesso!");
        e.target.reset();
        loadUpdates();
    }
});

async function loadUpdates() {
    const { data } = await _supabase.from('updates').select('*').order('created_at', { ascending: false });
    const container = document.getElementById('updatesContainer');
    if (data) {
        container.innerHTML = data.map(up => `
            <div class="border-l-4 border-white/5 pl-6 py-2 hover:border-cyan-500 transition-all">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-white font-black italic uppercase">${up.version}</span>
                    <span class="text-[10px] text-gray-600">${new Date(up.created_at).toLocaleDateString()}</span>
                </div>
                <p class="text-gray-400 text-sm font-light">${up.changelog}</p>
            </div>
        `).join('');
    }
}

async function logout() {
    await _supabase.auth.signOut();
    location.reload();
}
