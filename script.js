/* ===============================
   LEAD MODAL LOGIC
================================= */
const leadButtons = document.querySelectorAll('.btn-primary');
const modal = document.getElementById('leadModal');
const closeModal = document.getElementById('closeModal');
const leadForm = document.getElementById('leadForm');

leadButtons.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        modal.style.display = 'flex';
    });
});

closeModal.addEventListener('click', () => { modal.style.display = 'none'; });
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

leadForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('leadName').value;
    const email = document.getElementById('leadEmail').value;
    const company = document.getElementById('leadCompany').value;

    console.log({ name, email, company });
    alert('Thank you! Your request has been received. We will contact you soon.');
    leadForm.reset();
    modal.style.display = 'none';
});

/* ===============================
   CHART.JS DEMO WITH BADGES
================================= */
const ctx = document.getElementById('demandChart')?.getContext('2d');
let demandChart;

function initChart(initialData) {
    demandChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Python/AI',
                    data: initialData.pythonAI,
                    borderColor: '#3fb950',
                    backgroundColor: 'rgba(63,185,80,0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Data Engineering',
                    data: initialData.dataEng,
                    borderColor: '#58a6ff',
                    backgroundColor: 'rgba(88,166,255,0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#c9d1d9' } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const score = context.raw;
                            let badge = '';
                            if (score >= 90) badge = ' 🏆 Liderança';
                            else if (score >= 80) badge = ' ⭐ Sênior';
                            else if (score >= 70) badge = ' ⚡ Pleno';
                            else badge = ' 🔹 Júnior';
                            return `${context.dataset.label}: ${score}${badge}`;
                        }
                    }
                }
            },
            scales: { x: { ticks: { color: '#8b949e' } }, y: { ticks: { color: '#8b949e' } } }
        }
    });
}

/* ===============================
   INSIGHTS & OPPORTUNITIES CARDS
================================= */
const dashboardContainer = document.querySelector('.dashboard-demo');
let insightsContainer = document.getElementById('insightsContainer');
let opportunitiesContainer = document.getElementById('opportunitiesContainer');

// Cria container de insights
if (!insightsContainer) {
    insightsContainer = document.createElement('div');
    insightsContainer.id = 'insightsContainer';
    insightsContainer.style.marginTop = '20px';
    insightsContainer.style.backgroundColor = '#161b22';
    insightsContainer.style.padding = '15px';
    insightsContainer.style.borderRadius = '8px';
    insightsContainer.style.maxHeight = '220px';
    insightsContainer.style.overflowY = 'auto';
    insightsContainer.innerHTML = `<h4 style="color:#58a6ff;margin-bottom:10px;">Strategic Insights (Real-Time)</h4>`;
    dashboardContainer.appendChild(insightsContainer);
}

// Cria container de oportunidades
if (!opportunitiesContainer) {
    opportunitiesContainer = document.createElement('div');
    opportunitiesContainer.id = 'opportunitiesContainer';
    opportunitiesContainer.style.marginTop = '20px';
    opportunitiesContainer.style.display = 'grid';
    opportunitiesContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
    opportunitiesContainer.style.gap = '12px';
    dashboardContainer.appendChild(opportunitiesContainer);
}

function getBadge(score) {
    if (score >= 90) return { label: '🏆 Liderança', color: '#ffdd57' };
    if (score >= 80) return { label: '⭐ Sênior', color: '#3fb950' };
    if (score >= 70) return { label: '⚡ Pleno', color: '#58a6ff' };
    return { label: '🔹 Júnior', color: '#8b949e' };
}

function updateInsights(newTalents) {
    // Limpa insights antigos
    Array.from(insightsContainer.querySelectorAll('p')).forEach(p => p.remove());

    newTalents.slice(-5).reverse().forEach(t => {
        const badge = getBadge(t.score);
        const p = document.createElement('p');
        p.innerHTML = `<strong>${t.username}</strong> (${t.role}) - ${t.score} <span style="color:${badge.color}">${badge.label}</span>`;
        p.style.color = '#c9d1d9';
        p.style.margin = '4px 0';
        p.style.transition = 'all 0.3s ease';
        insightsContainer.appendChild(p);
    });
}

function updateOpportunities(newTalents) {
    // Limpa oportunidades antigas
    opportunitiesContainer.innerHTML = '';
    
    newTalents.slice(-6).reverse().forEach(t => {
        const badge = getBadge(t.score);
        const card = document.createElement('div');
        card.style.backgroundColor = '#161b22';
        card.style.border = `2px solid ${badge.color}`;
        card.style.borderRadius = '10px';
        card.style.padding = '12px';
        card.style.color = '#c9d1d9';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.cursor = 'pointer';
        card.onmouseover = () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = `0 6px 12px ${badge.color}50`;
        };
        card.onmouseleave = () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        };
        card.innerHTML = `
            <h4 style="margin-bottom:6px;">${t.username}</h4>
            <p style="margin-bottom:6px;">${t.role} - Score: ${t.score} <span style="color:${badge.color}">${badge.label}</span></p>
            <p style="font-size:0.85em;color:#8b949e;">Top skills: ${t.skills.join(', ')}</p>
        `;
        opportunitiesContainer.appendChild(card);
    });
}

/* ===============================
   DASHBOARD UPDATE
================================= */
function updateDashboard(talents) {
    const pythonAI = talents.map(t => t.score);
    const dataEng = talents.map(t => t.score - 5);

    if (demandChart) {
        demandChart.data.datasets[0].data = pythonAI;
        demandChart.data.datasets[1].data = dataEng;
        demandChart.update();
    }

    updateInsights(talents);
    updateOpportunities(talents);
}

/* ===============================
   WEBSOCKET REAL-TIME
================================= */
function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

    ws.onopen = () => console.log('WebSocket connected for real-time updates');

    ws.onmessage = event => {
        const msg = JSON.parse(event.data);
        if (msg.event === 'update' && msg.talents) {
            console.log('Received new talent data:', msg.talents);
            updateDashboard(msg.talents);
        }
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting in 5s...');
        setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = err => {
        console.error('WebSocket error:', err);
        ws.close();
    };
}

// Inicializa WebSocket
connectWebSocket();

// Inicializa gráfico com dados fictícios iniciais
initChart({
    pythonAI: [65, 72, 78, 85, 89, 92],
    dataEng: [50, 55, 60, 65, 70, 73]
});

// Inicializa insights e oportunidades com dados fictícios
updateDashboard([
    { username: 'Alice', role: 'AI Engineer', score: 92, skills: ['Python','TensorFlow','PyTorch'] },
    { username: 'Bob', role: 'Data Engineer', score: 85, skills: ['SQL','Spark','Airflow'] },
    { username: 'Charlie', role: 'Full Stack Dev', score: 78, skills: ['React','Node.js','Docker'] },
    { username: 'Dana', role: 'Backend Engineer', score: 88, skills: ['Python','Django','PostgreSQL'] },
    { username: 'Eve', role: 'DevOps', score: 95, skills: ['AWS','Kubernetes','Terraform'] },
    { username: 'Frank', role: 'Frontend Engineer', score: 70, skills: ['Vue.js','Tailwind','HTML/CSS'] }
]);
