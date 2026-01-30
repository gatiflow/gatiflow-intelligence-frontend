const API_URL = "http://localhost:8000/report";

const content = document.getElementById("content");

function renderSection(title, items) {
  if (!items || items.length === 0) return "";

  const list = items.map(item => `<li>${item}</li>`).join("");

  return `
    <section>
      <h2>${title}</h2>
      <ul>${list}</ul>
    </section>
  `;
}

async function loadReport() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    content.innerHTML = `
      <section>
        <h2>Executive Summary</h2>
        <p>${data.executive_summary}</p>
      </section>

      ${renderSection("Market Signals", data.market_signals)}
      ${renderSection("Talent Intelligence", data.talent_insights)}
      ${renderSection("Hiring Pressure", data.hiring_pressure)}
      ${renderSection("Strategic Recommendations", data.recommendations)}
    `;
  } catch (error) {
    content.innerHTML = `
      <section>
        <h2>Error</h2>
        <p>Unable to load executive report.</p>
      </section>
    `;
  }
}

loadReport();
