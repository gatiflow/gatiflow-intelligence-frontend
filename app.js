/**
 * GatiFlow Frontend App
 * Consome o endpoint /report/preview
 * Renderiza inteligência ética e estruturada
 */

const API_URL =
  "https://raw.githubusercontent.com/gatiflow/gatiflow-backend/main/report_preview.json";

/* Helpers */
function $(id) {
  return document.getElementById(id);
}

function createItem({ title, desc, tech, url }) {
  const div = document.createElement("div");
  div.className = "item";

  div.innerHTML = `
    <h3>${title}</h3>
    <p>${desc}</p>
    <p><strong>${tech}</strong></p>
    <a href="${url}" target="_blank" rel="noopener noreferrer">View source →</a>
  `;

  return div;
}

function createCandidate({ name, role, score, link }) {
  const div = document.createElement("div");
  div.className = "item";

  div.innerHTML = `
    <h3>${name}</h3>
    <p>${role}</p>
    <p><strong>Score:</strong> ${score}</p>
    <a href="${link}" target="_blank" rel="noopener noreferrer">Public profile →</a>
  `;

  return div;
}

/* Render functions */
function renderOverview(apiInfo, metadata) {
  $("api-name").textContent = apiInfo.name;
  $("api-version").textContent = apiInfo.version;
  $("api-status").textContent = apiInfo.status;
  $("api-updated").textContent = new Date(
    apiInfo.last_updated
  ).toLocaleString();
  $("api-datapoints").textContent = metadata.total_data_points;
}

function renderTrends(trends) {
  const container = $("market-trends");
  container.innerHTML = "";

  trends.forEach((item) => {
    container.appendChild(createItem(item));
  });
}

function renderCandidates(candidates) {
  const container = $("top-candidates");
  container.innerHTML = "";

  candidates.forEach((c) => {
    container.appendChild(createCandidate(c));
  });
}

function renderCompliance(compliance) {
  $("gdpr").textContent = compliance.gdpr_compliant ? "Yes" : "No";
  $("lgpd").textContent = compliance.lgpd_compliant ? "Yes" : "No";
  $("ccpa").textContent = compliance.ccpa_compliant ? "Yes" : "No";
  $("sources").textContent = compliance.data_sources;
  $("pii").textContent = compliance.pii_collected ? "Yes" : "No";
}

/* Bootstrap */
async function init() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();

    renderOverview(json.api_info, json.metadata);
    renderTrends(json.data.market_trends);
    renderCandidates(json.data.top_candidates);
    renderCompliance(json.api_info.compliance);
  } catch (err) {
    console.error("GatiFlow frontend error:", err);
    alert("Failed to load GatiFlow intelligence feed.");
  }
}

init();
