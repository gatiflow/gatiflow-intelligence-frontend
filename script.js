/* ===============================
   LEAD MODAL LOGIC
================================= */
const leadButtons = document.querySelectorAll('.btn-primary');
const modal = document.getElementById('leadModal');
const closeModal = document.getElementById('closeModal');
const leadForm = document.getElementById('leadForm');

leadButtons.forEach(btn=>{
    btn.addEventListener('click', e=>{
        e.preventDefault();
        modal.style.display='flex';
    });
});

closeModal.addEventListener('click', ()=>{modal.style.display='none';});
window.addEventListener('click', e=>{if(e.target===modal) modal.style.display='none';});

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
        return await response.json();
    } catch (err) {
        console.error('Falha ao obter relatório:', err);
        return null;
    }
}

/* ===============================
   POPULA DASHBOARD AVANÇADO
================================= */
async function populateDashboardAdvanced() {
    const report = await fetchReportPreview();

    if (!report || !report.talents || report.talents.length === 0) {
        console.warn('Nenhum dado disponível para o dashboard');
        return;
    }

    const talents = report.talents;

    // -------------------------------
    // CARDS DE INSIGHTS
    // -------------------------------
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const avgScore = talents.reduce((acc, t) => acc + t.score, 0) / talents.length;
        const topScore = Math.max(...talents.map(t => t.score));

        // Contagem por role
        const rolesCount = {};
        talents.forEach(t => {
            const role = t.role || 'Unknown';
            rolesCount[role] = (rolesCount[role] || 0) + 1;
        });

        let rolesCards = Object.entries(rolesCount)
            .map(([role, count]) => `<div class="stat-card"><div class="stat-value">${count}</div><div class="stat-label">${role}</div></div>`)
            .join('');

        statsGrid.innerHTML = `
            <div class="stat-card"><div class="stat-value">${talents.length}</div><div class="stat-label">Perfis analisados</div></div>
            <div class="stat-card"><div class="stat-value">${avgScore.toFixed(1)}</div><div class="stat-label">Score médio</div></div>
            <div class="stat-card"><div class="stat-value">${topScore}</div><div class="stat-label">Maior score</div></div>
            ${rolesCards}
        `;
    }

    // -------------------------------
    // GRÁFICO DINÂMICO COMBINADO
    // -------------------------------
    const ctx = document.getElementById('demandChart')?.getContext('2d');
    if (ctx) {
        // Preparar dados para line chart (score médio por mês fictício)
        // Apenas exemplo: gerar tendência fictícia baseada no score médio
        const months = ['Jan','Feb','Mar','Apr','May','Jun'];
        const avgScoreTrend = months.map((_, idx) => {
            const variation = Math.random() * 5 - 2.5; // ±2.5
            const base = talents.reduce((acc,t)=>acc+t.score,0)/talents.length;
            return Math.max(65, Math.min(99, base + variation));
        });

        // Dados de roles para bar chart
        const rolesCount = {};
        talents.forEach(t => {
            const role = t.role || 'Unknown';
            rolesCount[role] = (rolesCount[role] || 0) + 1;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(rolesCount),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Quantidade de talentos',
                        data: Object.values(rolesCount),
                        backgroundColor: 'rgba(88,166,255,0.6)',
                        borderColor: '#58a6ff',
                        borderWidth: 1
                    },
                    {
                        type: 'line',
                        label: 'Score médio (estimativa)',
                        data: avgScoreTrend,
                        borderColor: '#3fb950',
                        backgroundColor: 'rgba(63,185,80,0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { labels: { color: '#c9d1d9' } } },
                scales: {
                    x: { ticks: { color: '#8b949e' } },
                    y: {
                        type: 'linear',
                        position: 'left',
                        ticks: { color: '#8b949e', beginAtZero: true }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        ticks: { color: '#3fb950' },
                        grid: { drawOnChartArea: false },
                        min: 65,
                        max: 99
                    }
                }
            }
        });
    }
}

/* ===============================
   EXECUTAR AO CARREGAR A PÁGINA
================================= */
document.addEventListener('DOMContentLoaded', () => {
    populateDashboardAdvanced();
});
