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

if(closeModal){
    closeModal.addEventListener('click', ()=>{modal.style.display='none';});
}

window.addEventListener('click', e=>{
    if(e.target===modal) modal.style.display='none';
});

if(leadForm){
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
}

/* ===============================
   CHART.JS — REAL-TIME DEMO
================================= */
const ctx=document.getElementById('demandChart')?.getContext('2d');
let demandChart=null;

if(ctx){
    demandChart=new Chart(ctx,{
        type:'line',
        data:{
            labels:['Jan','Feb','Mar','Apr','May','Jun'],
            datasets:[
                {
                    label:'Python / AI',
                    data:[65,72,78,85,89,92],
                    borderColor:'#3fb950',
                    backgroundColor:'rgba(63,185,80,0.15)',
                    tension:0.4,
                    fill:true
                },
                {
                    label:'Data Engineering',
                    data:[50,55,60,65,70,73],
                    borderColor:'#58a6ff',
                    backgroundColor:'rgba(88,166,255,0.15)',
                    tension:0.4,
                    fill:true
                }
            ]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{labels:{color:'#c9d1d9'}}
            },
            scales:{
                x:{ticks:{color:'#8b949e'}},
                y:{ticks:{color:'#8b949e'}}
            }
        }
    });
}

/* ===============================
   REAL-TIME SIGNAL SIMULATION
================================= */
const insightsContainer=document.getElementById('insightsContainer');
const opportunitiesContainer=document.getElementById('opportunitiesContainer');

const insightsPool=[
    'Hiring surge detected for Senior Python Engineers',
    'AI adoption accelerating in Fintech sector',
    'Remote Data Engineers demand increased by 12%',
    'Enterprise hiring cycles shortening globally',
    'ML Ops roles showing strong quarter growth'
];

const opportunitiesPool=[
    {title:'Senior AI Engineer',company:'Fintech Global',growth:'+28%'},
    {title:'Data Platform Lead',company:'SaaS Unicorn',growth:'+21%'},
    {title:'ML Engineer',company:'HealthTech Scale-up',growth:'+34%'},
    {title:'Python Architect',company:'Enterprise Cloud',growth:'+18%'}
];

function addInsight(){
    if(!insightsContainer) return;
    const div=document.createElement('div');
    div.className='step';
    div.textContent=insightsPool[Math.floor(Math.random()*insightsPool.length)];
    insightsContainer.prepend(div);
    if(insightsContainer.children.length>5){
        insightsContainer.removeChild(insightsContainer.lastChild);
    }
}

function addOpportunity(){
    if(!opportunitiesContainer) return;
    const card=document.createElement('div');
    card.className='stat-card';
    const opp=opportunitiesPool[Math.floor(Math.random()*opportunitiesPool.length)];
    card.innerHTML=`
        <div class="stat-value">${opp.title}</div>
        <div class="stat-label">${opp.company}</div>
        <div style="margin-top:6px;color:#3fb950;font-weight:600">${opp.growth}</div>
    `;
    opportunitiesContainer.prepend(card);
    if(opportunitiesContainer.children.length>4){
        opportunitiesContainer.removeChild(opportunitiesContainer.lastChild);
    }
}

/* ===============================
   LIVE DATA UPDATES
================================= */
setInterval(()=>{
    addInsight();
    addOpportunity();

    if(demandChart){
        demandChart.data.datasets.forEach(ds=>{
            const variation=Math.floor(Math.random()*3);
            ds.data.push(ds.data[ds.data.length-1]+variation);
            if(ds.data.length>6) ds.data.shift();
        });

        demandChart.data.labels.push('Now');
        if(demandChart.data.labels.length>6) demandChart.data.labels.shift();

        demandChart.update();
    }
},5000);

/* ===============================
   COMPLIANCE STATUS PULSE
================================= */
const badge=document.querySelector('.compliance-badge-fixed');
if(badge){
    setInterval(()=>{
        badge.style.boxShadow='0 0 12px rgba(63,185,80,0.8)';
        setTimeout(()=>badge.style.boxShadow='none',600);
    },4000);
}
