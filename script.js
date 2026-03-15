const SB_URL = "https://ohozsfqsocwjpwoioqef.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ob3pzZnFzb2N3anB3b2lvcWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTYxNTIsImV4cCI6MjA4OTE3MjE1Mn0.Of-dTDu17P62PK24kTn4IQfqNjUJLvmpisw481e-Yoc";

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
        alert("Falha na autenticação: " + error.message);
    } else {
        router('dashboard');
        loadUpdates();
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
            <div class="border-l-2 border-cyan-500/20 pl-4 transition-all hover:border-cyan-500">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-white font-bold italic">${up.version}</span>
                    <span class="text-[10px] uppercase font-mono text-gray-600">${new Date(up.created_at).toLocaleDateString()}</span>
                </div>
                <p class="font-light text-gray-400">${up.changelog}</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="text-gray-600 italic">Nenhum log de atualização disponível.</p>';
    }
}

async function logout() {
    await _supabase.auth.signOut();
    location.reload();
}
