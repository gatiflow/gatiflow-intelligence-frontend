/* ======================================================
   GATIFLOW FRONTEND SCRIPT
   - Lead Modal
   - Real-time Dashboard (WebSocket)
   - Charts + Strategic Insights
====================================================== */

/* ===============================
   LEAD MODAL
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

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

leadForm.addEventListener('submit', e => {
    e.preventDefault();

    const payload = {
        name: document.getElementById('leadName').value,
        email: document.getElementById('leadEmail').value,
        company: document.getElementById('leadCompany').value
    };

    console.log('Lead captured:', payload);

    alert('Thank you! Your request has been received.');
    leadForm.reset();
    modal.style.display = 'none';
});

/* ===============================
   DASHBOARD ELEMENTS
================================= */
const chartCtx = document.getElementById('demandChart')?.getContext('2d');
let demandChart = null;

const dashboard = document.querySelector('.dashboard-demo');

/* ===============================
   INSIGHTS CONTAINER
================================= */
const insightsContainer = document.createElement('div');
insightsContainer.style.marginTop = '20px';
insightsContainer.style.background = '#161b22';
insightsContainer.style.padding = '16px';
insightsContainer.style.borderRadius = '8px';
insightsContainer.innerHTML = `
  <h4 style="color:#58a6ff;margin-bottom:10px;">
    Strategic Insights (Real-Time)
  </h4>
`;
dashboard.appendChild(insightsContainer);

/* ===============================
   CHART INITIALIZATION
================================= */
function initChart() {
    if (!chartCtx) return;

    demandChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Average Technical Score',
                    data: [],
                    borderColor: '#58a6ff',
                    backgroundColor: 'rgba(88,166,255,0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#c9d1d9' }
                }
            },
            scales: {
                x: { ticks: { color: '#8b949e' } },
                y: { ticks: { color: '#8b949e' }, min: 60, max: 100 }
            }
        }
    });
}

/* ===============================
   DASHBOARD UPDATE
================================= */
function updateDashboard(report) {
    if (!demandChart) return;

    const timestamp = new Date(report.metadata.generated_at).toLocaleTimeString();
    const avgScore = report.market_overview?.average_score ?? 0;

    demandChart.data.labels.push(timestamp);
    demandChart.data.datasets[0].data.push(avgScore);

    if (demandChart.data.labels.length > 6) {
        demandChart.data.labels.shift();
        demandChart.data.datasets[0].data.shift();
    }

    demandChart.update();
}

/* ===============================
   INSIGHTS UPDATE
================================= */
function updateInsights(report) {
    insightsContainer.querySelectorAll('p').forEach(p => p.remove());

    const insights = report.strategic_insights || [];

    insights.slice(0, 5).forEach(text => {
        const p = document.createElement('p');
        p.style.color = '#c9d1d9';
        p.style.margin = '6px 0';
        p.textContent = '• ' + text;
        insightsContainer.appendChild(p);
    });
}

/* ===============================
   WEBSOCKET CONNECTION
================================= */
function connectWebSocket() {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${location.host}/ws`);

    ws.onopen = () => console.log('WebSocket connected');

    ws.onmessage = event => {
        const message = JSON.parse(event.data);
        if (message.event === 'update') {
            updateDashboard(message.report);
            updateInsights(message.report);
        }
    };

    ws.onclose = () => {
        console.warn('WebSocket disconnected. Reconnecting...');
        setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = err => {
        console.error('WebSocket error', err);
        ws.close();
    };
}

/* ===============================
   INIT
================================= */
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    connectWebSocket();
});
