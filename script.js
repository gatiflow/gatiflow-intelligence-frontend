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
   WEBSOCKET REAL-TIME
================================= */
function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

    ws.onopen = () => {
        console.log('WebSocket connected for real-time updates');
    };

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

function updateDashboard(talents) {
    // Exemplo simples: atualizar gráficos com novos valores
    // Aqui vamos apenas simular novos dados para Python/AI e Data Engineering
    const pythonAI = talents.map(t => t.score);       // score como proxy
    const dataEng = talents.map(t => t.score - 5);    // leve variação

    if (demandChart) {
        demandChart.data.datasets[0].data = pythonAI;
        demandChart.data.datasets[1].data = dataEng;
        demandChart.update();
    }
}

// Inicializa WebSocket
connectWebSocket();

// Inicializa gráfico com dados fictícios iniciais
initChart({
    pythonAI: [65, 72, 78, 85, 89, 92],
    dataEng: [50, 55, 60, 65, 70, 73]
});
