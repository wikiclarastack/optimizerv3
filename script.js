const SB_URL = "https://ohozsfqsocwjpwoioqef.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ob3pzZnFzb2N3anB3b2lvcWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTYxNTIsImV4cCI6MjA4OTE3MjE1Mn0.Of-dTDu17P62PK24kTn4IQfqNjUJLvmpisw481e-Yoc";
const _supabase = supabase.createClient(SB_URL, SB_KEY);

let currentUser = null;
let isAdmin = false;

// Sistema de Presença (Online agora)
const trackPresence = async (user) => {
    const channel = _supabase.channel('online-users');
    channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
            await channel.track({ user_id: user.id, email: user.email, online_at: new Date().toISOString() });
        }
    });

    channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        updateOnlineUI(state);
    });
};

function updateOnlineUI(state) {
    const list = document.getElementById('online-list');
    if (!list) return;
    list.innerHTML = Object.values(state).flat().map(u => `
        <div class="flex items-center gap-2 text-xs p-2 border-b border-white/5">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            ${u.email}
        </div>
    `).join('');
}

// Funções de Gerenciamento (Admin Only)
async function banUser(userId, status) {
    const { error } = await _supabase.from('profiles').update({ is_banned: status }).eq('id', userId);
    if (!error) notify(status ? "Usuário Banido" : "Usuário Desbanido");
    loadUsers();
}

async function updateDownloadLink() {
    const newLink = document.getElementById('new-dl-link').value;
    const { error } = await _supabase.from('site_config').update({ download_url: newLink }).eq('id', 1);
    if (!error) notify("Link de Download Atualizado!");
}

async function sendDM(receiverId) {
    const msg = prompt("Digite a mensagem direta:");
    if (!msg) return;
    await _supabase.from('messages').insert([{ 
        sender_id: currentUser.id, 
        receiver_id: receiverId, 
        text: msg 
    }]);
    notify("Mensagem enviada!");
}

// Suporte em Tempo Real
function subscribeMessages() {
    _supabase.channel('support-chat')
        .on('postgres_changes', { event: 'INSERT', table: 'messages' }, payload => {
            const m = payload.new;
            if (m.receiver_id === currentUser.id || !m.receiver_id) {
                notify("Nova mensagem de suporte!", "#8b5cf6");
                renderMessages();
            }
        }).subscribe();
}

async function renderMessages() {
    const { data } = await _supabase.from('messages').select('*').order('created_at', { ascending: true });
    const chat = document.getElementById('chat-box');
    if (chat) chat.innerHTML = data.map(m => `
        <div class="mb-2 ${m.sender_id === currentUser.id ? 'text-right' : 'text-left'}">
            <span class="inline-block p-2 rounded-lg ${m.sender_id === currentUser.id ? 'bg-cyan-600' : 'bg-white/10'} text-xs">
                ${m.text}
            </span>
        </div>
    `).join('');
}

// Login e Inicialização
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: e.target.email.value,
        password: e.target.password.value
    });

    if (error) return notify(error.message, "#ef4444");

    currentUser = data.user;
    const { data: profile } = await _supabase.from('profiles').select('*').eq('id', currentUser.id).single();

    if (profile.is_banned) {
        alert("VOCÊ FOI BANIDO.");
        return _supabase.auth.signOut();
    }

    isAdmin = profile.is_admin;
    if (isAdmin) document.getElementById('admin-master-panel').classList.remove('hidden');
    
    trackPresence(currentUser);
    subscribeMessages();
    router('dashboard');
    loadUpdates();
});
