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

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        notify("Erro: " + error.message, "#ef4444");
    } else {
        const user = data.user;
        const { data: profile } = await _supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

        if (profile?.is_banned) {
            notify("ACESSO BLOQUEADO", "#ff0000");
            return _supabase.auth.signOut();
        }

        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        document.getElementById('display-user').innerText = `USER: ${user.email.split('@')[0].toUpperCase()}`;
        
        if (profile?.is_admin) {
            document.getElementById('admin-master-panel').classList.remove('hidden');
            notify("MODO ADMIN ATIVO", "#ff4444");
        } else {
            document.getElementById('admin-master-panel').classList.add('hidden');
        }

        router('dashboard');
        loadUpdates();
        syncDownloadLink();
    }
});

document.getElementById('createClientForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('new-client-email').value;
    const password = document.getElementById('new-client-password').value;

    const { data, error } = await _supabase.rpc('admin_create_user', { email, password });

    if (error) notify("Erro ao criar: " + error.message, "#ef4444");
    else {
        notify("CLIENTE REGISTRADO!", "#06b6d4");
        e.target.reset();
    }
});

async function generateKey() {
    const key = document.getElementById('new-key-input').value;
    if(!key) return notify("Insira uma chave!");

    const { error } = await _supabase.from('license_keys').insert([{ key_code: key }]);
    
    if (error) notify("Erro: " + error.message, "#ef4444");
    else {
        notify("KEY GERADA COM SUCESSO!", "#22d68e");
        document.getElementById('new-key-input').value = "";
    }
}

async function syncDownloadLink() {
    const { data } = await _supabase.from('site_config').select('download_url').eq('id', 1).maybeSingle();
    if (data) document.getElementById('main-download-btn').href = data.download_url;
}

async function updateDownloadLink() {
    const url = document.getElementById('new-dl-link').value;
    const { error } = await _supabase.from('site_config').update({ download_url: url }).eq('id', 1);
    if (!error) notify("Link atualizado!");
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
                <p class="text-gray-500 text-[10px]">${up.changelog}</p>
            </div>
        `).join('');
    }
}

function logout() {
    _supabase.auth.signOut().then(() => location.reload());
}
