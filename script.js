const root=document.documentElement,home=location.pathname.includes('contato')?'index.html':'';
const L=[['Sobre','#sobre'],['Habilidades','#habilidades'],['Experiência','#experiencia'],['Educação','#educacao'],['Certificados','#certificados'],['Projetos','#projetos']];
document.getElementById('hd').innerHTML=`<header><div class="w"><a class="logo" href="${home||'#'}">rian<b>@</b>lucas:~$</a><nav id="nv">${L.map(l=>`<a href="${home}${l[1]}">${l[0]}</a>`).join('')}<a href="contato.html">Contato</a></nav><button id="tg" aria-label="Alternar tema"></button><button id="mb" aria-label="Menu">☰</button></div></header>`;
document.getElementById('ft').innerHTML=`<footer><div class="w"><span>[rian] <a href="index.html">0:portfolio${home?'':'*'}</a><a href="contato.html">1:contato${home?'*':''}</a></span><span><a href="https://github.com/rianlucas-0" target="_blank" rel="noopener">github</a><a href="https://www.linkedin.com/in/rianlucassds/" target="_blank" rel="noopener">linkedin</a> Belo Horizonte, MG <b id="ck"></b></span></div></footer>`;
const tick=()=>document.getElementById('ck').textContent=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});tick();setInterval(tick,3e4);
const tg=document.getElementById('tg'),paint=()=>tg.textContent=root.dataset.theme==='dark'?'☀ Claro':'☾ Escuro';paint();
tg.onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}paint()};
document.getElementById('mb').onclick=()=>document.getElementById('nv').classList.toggle('open');
document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>document.getElementById('nv').classList.remove('open'));
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('on')),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// Topologia de rede animada
const cv=document.getElementById('net'),c=cv.getContext('2d'),slow=matchMedia('(prefers-reduced-motion:reduce)').matches,k=slow?.5:1;let N=[],W,H;
function size(){W=cv.width=innerWidth;H=cv.height=Math.max(innerHeight,screen.height);cv.style.width=W+'px';cv.style.height=H+'px';
N=Array.from({length:Math.min(60,Math.floor(W*H/22000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6}))}
function draw(){c.clearRect(0,0,W,H);const cs=getComputedStyle(root),col=cs.getPropertyValue('--ac').trim()||'#38bdf8',g=cs.getPropertyValue('--ac2').trim()||'#34d399',now=performance.now();c.fillStyle=c.strokeStyle=col;
for(const a of N){a.x+=a.vx*k;a.y+=a.vy*k;if((a.x<0&&a.vx<0)||(a.x>W&&a.vx>0))a.vx*=-1;if((a.y<0&&a.vy<0)||(a.y>H&&a.vy>0))a.vy*=-1;
c.beginPath();c.arc(a.x,a.y,2,0,7);c.fill();
for(const b of N){const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<150){c.globalAlpha=1-d/150;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();const t=((now/(slow?4500:2800))+(a.x*b.y%1))%1;c.fillStyle=g;c.globalAlpha=Math.min(1,(1-d/150)*2);c.beginPath();c.arc(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,2.4,0,7);c.fill();c.fillStyle=col;c.globalAlpha=1}}}
requestAnimationFrame(draw)}
size();draw();
// No celular, rolar a página dispara "resize" (barra do navegador). Só recria a rede se a largura mudar.
addEventListener('resize',()=>{if(innerWidth!==W||innerHeight>H)size()});
// Formulário
const f=document.getElementById('cf');
if(f)f.onsubmit=async e=>{e.preventDefault();const m=document.getElementById('msg'),b=f.querySelector('button');m.className='';m.textContent='Enviando…';b.disabled=true;
try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(f)))});
const d=await r.json();if(!r.ok)throw new Error(d.error||'Erro ao enviar');m.className='ok';m.textContent='Mensagem enviada! Respondo assim que possível.';f.reset()}
catch(err){m.className='er';m.textContent=err.message+'. Se preferir, fale comigo pelo WhatsApp.'}b.disabled=false};

// Estilo terminal: comandos acima dos títulos e janelas estilo macOS
const CMD={sobre:'cat sobre.md',habilidades:'ls -la habilidades/',experiencia:'cat experiencia.log',educacao:'cat educacao.txt',certificados:'ls ~/certificados',projetos:'ls ~/projetos',contato:'ssh contato@rian'};
document.querySelectorAll('h2').forEach(h=>{const k=h.closest('section')?.id||'contato';h.insertAdjacentHTML('beforebegin',`<div class="cmd"><b>rian@lucas</b>:<u>~</u>$ ${CMD[k]||'ls'}</div>`)});
document.querySelectorAll('.card').forEach(c=>{const h=c.querySelector('h3');c.dataset.t=h?h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.sh':'~/rian'});

document.querySelector('.term')?.setAttribute('data-t','bash · rian@lucas');
// Prévia automática dos projetos (WordPress mShots)
document.querySelectorAll('[data-site]').forEach(c=>{
const u=c.dataset.site,a=document.createElement('a'),i=new Image(),dia=new Date().toISOString().slice(0,10).replace(/-/g,'');
const base='https://s.wordpress.com/mshots/v1/'+encodeURIComponent(u+(u.includes('?')?'&':'?')+'v='+dia)+'?w=1200';
let n=0;
a.className='proj-img';a.href=u;a.target='_blank';a.rel='noopener';
i.alt='Prévia do site '+(c.querySelector('h3')?.textContent||'');i.loading='lazy';
// enquanto gera a captura, o mShots mostra uma imagem provisória menor: tenta de novo até 5 vezes
i.onload=()=>{if(i.naturalWidth<1000&&n++<5)setTimeout(()=>{i.src=base+'&t='+Date.now()},4000)};
i.onerror=()=>a.remove();
i.src=base;a.appendChild(i);c.prepend(a);
});

// Paginação (certificados e projetos)
function paginar(sel,item,per){const g=document.querySelector(sel);if(!g)return;
const items=[...g.querySelectorAll(item)],pages=Math.ceil(items.length/per);if(pages<2)return;
const nav=document.createElement('div');nav.className='pager';g.after(nav);
const show=p=>{items.forEach((el,i)=>el.hidden=Math.floor(i/per)+1!==p);
nav.innerHTML=`<button data-go="${p-1}" ${p===1?'disabled':''} aria-label="Página anterior">&lt; anterior</button>`
+Array.from({length:pages},(_,i)=>`<button data-go="${i+1}" ${i+1===p?'aria-current="page"':''}>${i+1}</button>`).join('')
+`<button data-go="${p+1}" ${p===pages?'disabled':''} aria-label="Próxima página">próxima &gt;</button>`};
nav.onclick=e=>{const b=e.target.closest('button[data-go]');if(b&&!b.disabled)show(+b.dataset.go)};
show(1)}
paginar('#certificados .grid','.cert',3);
paginar('#projetos .grid','.proj',3);
// Cards de projeto do mesmo tamanho (inclusive os de outras páginas)
let lastW=innerWidth;
function igualar(){const g=document.querySelector('#projetos .grid');if(!g)return;
  const cards=[...g.querySelectorAll('.proj')];
  cards.forEach(c=>c.style.minHeight='');
  const ocultos=cards.filter(c=>c.hidden);ocultos.forEach(c=>c.hidden=false);
  const maior=Math.max(...cards.map(c=>c.offsetHeight));
  ocultos.forEach(c=>c.hidden=true);
  cards.forEach(c=>c.style.minHeight=maior+'px');
}
igualar();
document.fonts?.ready.then(igualar);
addEventListener('load',igualar);
addEventListener('resize',()=>{if(innerWidth!==lastW){lastW=innerWidth;igualar()}});