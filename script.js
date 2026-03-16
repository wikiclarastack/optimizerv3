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

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        notify("Acesso Negado: " + error.message, "#ef4444");
    } else {
        const user = data.user;
        
        const { data: profile, error: profileError } = await _supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile?.is_banned) {
            notify("CONTA BLOQUEADA", "#ff0000");
            return _supabase.auth.signOut();
        }

        confetti({ 
            particleCount: 150, 
            spread: 70, 
            origin: { y: 0.6 }, 
            colors: ['#06b6d4', '#8b5cf6'] 
        });

        document.getElementById('display-user').innerText = `SESSION: ${user.email.toUpperCase()}`;
        
        if (profile?.is_admin) {
            document.getElementById('admin-master-panel').classList.remove('hidden');
            notify("MODO ROOT ATIVADO", "#ff4444");
            trackPresence(user);
        } else {
            document.getElementById('admin-master-panel').classList.add('hidden');
            notify("Conectado com sucesso!");
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

    const { data: newUserId, error: rpcError } = await _supabase.rpc('admin_create_user', { 
        email: email, 
        password: password 
    });

    if (rpcError) {
        notify("Erro ao criar: " + rpcError.message, "#ef4444");
    } else {
        const { error: profileError } = await _supabase
            .from('profiles')
            .insert([{ id: newUserId, is_admin: false, is_banned: false }]);

        if (profileError) {
            notify("Erro ao gerar perfil: " + profileError.message, "#ffaa00");
        } else {
            notify("CLIENTE CRIADO E ATIVADO!", "#06b6d4");
            e.target.reset();
        }
    }
});

async function syncDownloadLink() {
    const { data } = await _supabase.from('site_config').select('download_url').eq('id', 1).single();
    if (data) {
        const btn = document.getElementById('main-download-btn');
        btn.href = data.download_url;
    }
}

async function updateDownloadLink() {
    const url = document.getElementById('new-dl-link').value;
    if(!url) return notify("Insira uma URL válida", "#ff4444");

    const { error } = await _supabase.from('site_config').update({ download_url: url }).eq('id', 1);
    
    if (error) {
        notify("Erro ao atualizar link", "#ff4444");
    } else {
        notify("Link de download atualizado!");
        syncDownloadLink();
    }
}

document.getElementById('adminUpdateForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const version = document.getElementById('version').value;
    const changelog = document.getElementById('changelog').value;

    const { error } = await _supabase.from('updates').insert([{ version, changelog }]);
    
    if (error) {
        notify("Erro ao postar update", "#ff4444");
    } else {
        notify("Update publicado com sucesso!");
        e.target.reset();
        loadUpdates();
    }
});

async function loadUpdates() {
    const { data } = await _supabase.from('updates').select('*').order('created_at', { ascending: false });
    const container = document.getElementById('updatesContainer');
    
    if (data && data.length > 0) {
        container.innerHTML = data.map(up => `
            <div class="border-l-2 border-white/5 pl-4 hover:border-cyan-500 transition-all group">
                <p class="text-white font-black italic text-sm group-hover:text-cyan-400 transition-colors">${up.version}</p>
                <p class="text-gray-500 text-[10px] leading-relaxed">${up.changelog}</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="text-gray-600 text-[10px] italic">No updates found.</p>';
    }
}

async function trackPresence(user) {
    const channel = _supabase.channel('online-users');
    
    channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
            await channel.track({ 
                user: user.email, 
                online_at: new Date().toISOString() 
            });
        }
    });

    channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const list = document.getElementById('online-list');
        if (list) {
            list.innerHTML = Object.values(state).flat().map(u => `
                <div class="flex items-center gap-2">
                    <span class="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></span>
                    ${u.user.split('@')[0].toUpperCase()}
                </div>
            `).join('');
        }
    });
}

async function logout() {
    await _supabase.auth.signOut();
    notify("Sessão finalizada", "#8b5cf6");
    setTimeout(() => {
        location.reload();
    }, 1000);
}
