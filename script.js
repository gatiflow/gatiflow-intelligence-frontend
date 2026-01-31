/* ===============================
   LEAD MODAL LOGIC
================================= */
const leadButtons = document.querySelectorAll('.btn-primary');
const modal = document.getElementById('leadModal');
const closeModal = document.getElementById('closeModal');
const leadForm = document.getElementById('leadForm');
const leadSubmitBtn = leadForm.querySelector('button');

function openModal() { modal.style.display='flex'; }
function closeModalFunc() { modal.style.display='none'; }

leadButtons.forEach(btn=>{
    btn.addEventListener('click', e=>{
        e.preventDefault();
        openModal();
    });
});

closeModal.addEventListener('click', closeModalFunc);
window.addEventListener('click', e=>{ if(e.target===modal) closeModalFunc(); });

leadForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const name=document.getElementById('leadName').value;
    const email=document.getElementById('leadEmail').value;
    const company=document.getElementById('leadCompany').value;

    leadSubmitBtn.disabled = true;
    leadSubmitBtn.textContent = 'Enviando...';

    try {
        // Aqui você pode chamar API real para armazenar lead
        console.log({name,email,company});
        await new Promise(r=>setTimeout(r,500)); // Simula envio async
        alert('Obrigado! Sua solicitação foi recebida. Entraremos em contato em breve.');
        leadForm.reset();
        closeModalFunc();
    } catch (err) {
        console.error('Erro ao enviar lead:', err);
        alert('Falha ao enviar, tente novamente.');
    } finally {
        leadSubmitBtn.disabled = false;
        leadSubmitBtn.textContent = 'Request Access';
    }
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
   DASHBOARD DYNAMIC POPULATION
================================= */
let dashboardChart = null;

async function populateDashboard() {
    const report = await fetchReportPreview();

    if (!report || !report.talents || report.talents.length === 0) {
        console.warn('Nenhum dado disponível para o dashboard');
        return;
    }

    const talents = report.talents;

    // -------------------------------
    // CARDS DINÂMICOS
    // -------------------------------
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const avgScore = talents.reduce((acc, t) => acc + t.score, 0) / talents.length;
        const topScore = Math.max(...talents.map(t => t.score));

        const rolesCount = {};
        talents.forEach(t => { const role = t.role || 'Unknown'; rolesCount[role] = (rolesCount[role] || 0) + 1; });

        let rolesCards = Object.entries(rolesCount)
            .map(([role,count])=>`<div class="stat-card"><div class="stat-value">${count}</div><div class="stat-label">${role}</div></div>`)
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
        const months = ['Jan','Feb','Mar','Apr','May','Jun'];
        const avgScoreTrend = months.map(_ => {
            const variation = Math.random()*5 - 2.5;
            const base = talents.reduce((acc,t)=>acc+t.score,0)/talents.length;
            return Math.max(65, Math.min(99, base + variation));
        });

        const rolesCountChart = {};
        talents.forEach(t => { const role = t.role || 'Unknown'; rolesCountChart[role] = (rolesCountChart[role] || 0) + 1; });

        const chartData = {
            type: 'bar',
            data: {
                labels: Object.keys(rolesCountChart),
                datasets: [
                    { type:'bar', label:'Quantidade de talentos', data:Object.values(rolesCountChart),
                      backgroundColor:'rgba(88,166,255,0.6)', borderColor:'#58a6ff', borderWidth:1 },
                    { type:'line', label:'Score médio (estimativa)', data:avgScoreTrend,
                      borderColor:'#3fb950', backgroundColor:'rgba(63,185,80,0.1)', tension:0.4, fill:true, yAxisID:'y1' }
                ]
            },
            options: {
                responsive:true,
                interaction:{mode:'index', intersect:false},
                plugins:{legend:{labels:{color:'#c9d1d9'}}},
                scales:{
                    x:{ticks:{color:'#8b949e'}},
                    y:{type:'linear',position:'left',ticks:{color:'#8b949e', beginAtZero:true}},
                    y1:{type:'linear',position:'right',ticks:{color:'#3fb950'}, grid:{drawOnChartArea:false}, min:65, max:99}
                }
            }
        };

        if(dashboardChart){ dashboardChart.data=chartData.data; dashboardChart.update(); }
        else{ dashboardChart = new Chart(ctx, chartData); }
    }
}

/* ===============================
   ATUALIZAÇÃO AUTOMÁTICA
================================= */
const REFRESH_INTERVAL = 10000; // 10s

document.addEventListener('DOMContentLoaded', () => {
    populateDashboard();
    setInterval(populateDashboard, REFRESH_INTERVAL);
});

/* ===============================
   WEBSOCKET REAL-TIME (OPCIONAL)
================================= */
if ('WebSocket' in window) {
    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onmessage = event => {
        console.log('Mensagem WS recebida:', event.data);
        populateDashboard();
    };
    ws.onopen = () => console.log('Conexão WebSocket estabelecida.');
    ws.onerror = err => console.error('Erro WebSocket:', err);
}
