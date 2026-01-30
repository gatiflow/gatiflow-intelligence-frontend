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
   CHART.JS DEMO
================================= */
const ctx=document.getElementById('demandChart')?.getContext('2d');
if(ctx){
    new Chart(ctx,{
        type:'line',
        data:{
            labels:['Jan','Feb','Mar','Apr','May','Jun'],
            datasets:[
                {label:'Python/AI',data:[65,72,78,85,89,92],borderColor:'#3fb950',backgroundColor:'rgba(63,185,80,0.1)',tension:0.4,fill:true},
                {label:'Data Engineering',data:[50,55,60,65,70,73],borderColor:'#58a6ff',backgroundColor:'rgba(88,166,255,0.1)',tension:0.4,fill:true}
            ]
        },
        options:{
            responsive:true,
            plugins:{legend:{labels:{color:'#c9d1d9'}}},
            scales:{x:{ticks:{color:'#8b949e'}},y:{ticks:{color:'#8b949e'}}}
        }
    });
}
