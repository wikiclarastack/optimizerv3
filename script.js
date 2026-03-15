const SB_URL = "https://ohozsfqsocwjpwoioqef.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ob3pzZnFzb2N3anB3b2lvcWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTYxNTIsImV4cCI6MjA4OTE3MjE1Mn0.Of-dTDu17P62PK24kTn4IQfqNjUJLvmpisw481e-Yoc";

let _supabase;
if (SB_URL !== "https://ohozsfqsocwjpwoioqef.supabase.co") {
    _supabase = supabase.createClient(SB_URL, SB_KEY);
}

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

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!_supabase) return notify("Erro: Configure o Supabase na Vercel", "#ff4444");

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        notify("Acesso Negado: " + error.message, "#ef4444");
    } else {
        const user = data.user;
        const { data: profile } = await _supabase.from('profiles').select('*').eq('id', user.id).single();

        if (profile?.is_banned) {
            notify("VOCÊ FOI BANIDO", "#ff0000");
            return _supabase.auth.signOut();
        }

        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#06b6d4', '#8b5cf6'] });
        document.getElementById('display-user').innerText = `ID: ${user.id} | ${user.email.toUpperCase()}`;
        
        if (profile?.is_admin) {
            document.getElementById('admin-master-panel').classList.remove('hidden');
            notify("MODO ROOT ATIVADO", "#ff4444");
            trackPresence(user);
        }

        router('dashboard');
        loadUpdates();
        syncDownloadLink();
    }
});

async function syncDownloadLink() {
    const { data } = await _supabase.from('site_config').select('download_url').eq('id', 1).single();
    if (data) document.getElementById('main-download-btn').href = data.download_url;
}

async function updateDownloadLink() {
    const newUrl = document.getElementById('new-dl-link').value;
    const { error } = await _supabase.from('site_config').update({ download_url: newUrl }).eq('id', 1);
    if (!error) notify("Link de download atualizado!");
}

document.getElementById('adminUpdateForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const version = document.getElementById('version').value;
    const changelog = document.getElementById('changelog').value;

    const { error } = await _supabase.from('updates').insert([{ version, changelog }]);
    if (!error) {
        notify("Update publicado!");
        e.target.reset();
        loadUpdates();
    }
});

async function loadUpdates() {
    const { data } = await _supabase.from('updates').select('*').order('created_at', { ascending: false });
    const container = document.getElementById('updatesContainer');
    if (data) {
        container.innerHTML = data.map(up => `
            <div class="border-l-2 border-white/5 pl-4 hover:border-cyan-500 transition-all">
                <p class="text-white font-black italic text-sm">${up.version}</p>
                <p class="text-gray-500 text-xs">${up.changelog}</p>
            </div>
        `).join('');
    }
}

async function trackPresence(user) {
    const channel = _supabase.channel('online-users');
    channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await channel.track({ user: user.email, id: user.id });
    });
    channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        document.getElementById('online-list').innerHTML = Object.values(state).flat().map(u => `<div>● ${u.user}</div>`).join('');
    });
}

async function logout() {
    await _supabase.auth.signOut();
    location.reload();
}
