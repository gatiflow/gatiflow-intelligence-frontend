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
   CHART.JS DEMO
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
            plugins: { legend: { labels: { color: '#c9d1d9' } } },
            scales: { x: { ticks: { color: '#8b949e' } }, y: { ticks: { color: '#8b949e' } } }
        }
    });
}

/* ===============================
   INSIGHTS EM TEMPO REAL
================================= */
// Cria container no dashboard para insights
const dashboardContainer = document.querySelector('.dashboard-demo');

let insightsContainer = document.getElementById('insightsContainer');
if (!insightsContainer) {
    insightsContainer = document.createElement('div');
    insightsContainer.id = 'insightsContainer';
    insightsContainer.style.marginTop = '20px';
    insightsContainer.style.backgroundColor = '#161b22';
    insightsContainer.style.padding = '15px';
    insightsContainer.style.borderRadius = '8px';
    insightsContainer.style.maxHeight = '200px';
    insightsContainer.style.overflowY = 'auto';
    insightsContainer.innerHTML = `<h4 style="color:#58a6ff;margin-bottom:10px;">Strategic Insights (Real-Time)</h4>`;
    dashboardContainer.appendChild(insightsContainer);
}

function updateInsights(newTalents) {
    const insights = newTalents.map(t => {
        let text = `${t.username} (${t.role}) score: ${t.score}`;
        if (t.score >= 90) text += ' → Liderança técnica detectada';
        else if (t.score >= 80) text += ' → Sênior';
        else if (t.score >= 70) text += ' → Pleno';
        else text += ' → Júnior';
        return text;
    });

    // Remove insights antigos
    Array.from(insightsContainer.querySelectorAll('p')).forEach(p => p.remove());

    // Adiciona apenas os 5 últimos insights
    insights.slice(-5).reverse().forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        p.style.color = '#c9d1d9';
        p.style.margin = '4px 0';
        insightsContainer.appendChild(p);
    });
}

/* ===============================
   DASHBOARD UPDATE (GRÁFICO)
================================= */
function updateDashboard(talents) {
    const pythonAI = talents.map(t => t.score);
    const dataEng = talents.map(t => t.score - 5);

    if (demandChart) {
        demandChart.data.datasets[0].data = pythonAI;
        demandChart.data.datasets[1].data = dataEng;
        demandChart.update();
    }
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
            updateInsights(msg.talents);
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
