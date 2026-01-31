/* ===============================
   LEAD MODAL LOGIC
================================= */
const leadButtons = document.querySelectorAll('.btn-primary');
const modal = document.getElementById('leadModal');
const closeModal = document.getElementById('closeModal');
const leadForm = document.getElementById('leadForm');

// Abre modal ao clicar em qualquer botão primário
leadButtons.forEach(btn=>{
    btn.addEventListener('click', e=>{
        e.preventDefault();
        modal.style.display='flex';
    });
});

// Fecha modal
closeModal.addEventListener('click', ()=>{modal.style.display='none';});
window.addEventListener('click', e=>{if(e.target===modal) modal.style.display='none';});

// Envio do formulário de leads
leadForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name=document.getElementById('leadName').value;
    const email=document.getElementById('leadEmail').value;
    const company=document.getElementById('leadCompany').value;

    console.log({name,email,company});
    alert('Thank you! Your request has been received. We will contact you soon.');
    leadForm.reset();
    modal.style.display='none';
});

/* ===============================
   FETCH DADOS DINÂMICOS DO BACKEND
================================= */
async function fetchReportPreview(limit = 6) {
    try {
        const response = await fetch('http://localhost:8000/report/preview?limit=' + limit);
        if (!response.ok) throw new Error('Erro ao buscar dados do backend');
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Falha ao obter relatório:', err);
        return null;
    }
}

/* ===============================
   POPULA DASHBOARD
================================= */
async function populateDashboard() {
    const report = await fetchReportPreview();

    if (!report || !report.talents || report.talents.length === 0) {
        console.warn('Nenhum dado disponível para o dashboard');
        return;
    }

    // Atualizar cards de estatísticas
    const avgScore = report.talents.reduce((acc, t) => acc + t.score, 0) / report.talents.length;
    const topScore = Math.max(...report.talents.map(t => t.score));

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div class="stat-card"><div class="stat-value">${report.talents.length}</div><div class="stat-label">Perfis analisados</div></div>
            <div class="stat-card"><div class="stat-value">${avgScore.toFixed(1)}</div><div class="stat-label">Score médio</div></div>
            <div class="stat-card"><div class="stat-value">${topScore}</div><div class="stat-label">Maior score</div></div>
        `;
    }

    // Atualizar gráfico Chart.js
    const ctx = document.getElementById('demandChart')?.getContext('2d');
    if (ctx) {
        const rolesCount = {};
        report.talents.forEach(t => {
            const role = t.role || 'Unknown';
            rolesCount[role] = (rolesCount[role] || 0) + 1;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(rolesCount),
                datasets: [{
                    label: 'Quantidade de talentos por role',
                    data: Object.values(rolesCount),
                    backgroundColor: 'rgba(88,166,255,0.6)',
                    borderColor: '#58a6ff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#8b949e' } },
                    y: { ticks: { color: '#8b949e', beginAtZero: true } }
                }
            }
        });
    }
}

/* ===============================
   EXECUTAR AO CARREGAR A PÁGINA
================================= */
document.addEventListener('DOMContentLoaded', () => {
    populateDashboard();
});
