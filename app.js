const projects=[{id:'sprachprep',name:'SprachPrep',type:'Education · Web + iOS',status:'Live product',href:'/projects/sprachprep/',keywords:'german goethe education ios learning exams speaking mock progress',tags:['education','native'],summary:'German exam preparation shaped into a full learning product across web and iOS.'},{id:'mamelat',name:'MAMELAT',type:'Real estate',status:'Building',href:'/projects/mamelat/',keywords:'real estate property istanbul mamelat fideon whatsapp owner console',tags:['business'],summary:'A Turkish-first property experience built around clarity, contact and truthful inventory.'},{id:'sineklik',name:'Sineklik İstanbul',type:'Local business system',status:'Built',href:'/projects/sineklik/',keywords:'sineklik istanbul booking admin configurator chat quotes portal',tags:['business'],summary:'A local-service website that grew into discovery, configuration, booking, messaging and admin.'},{id:'newapp',name:'NEWAPP',type:'Native iPhone experiment',status:'Experiment',href:'/projects/newapp/',keywords:'books ios swiftui search library native provider evidence',tags:['native'],summary:'A deliberately narrow SwiftUI book-discovery experiment with evidence-gated provider capabilities.'},{id:'aegis',name:'AEGIS',type:'Agent systems',status:'Open source',href:'/projects/aegis/',keywords:'ai agents coding benchmark mission engine evidence verification',tags:['agents'],summary:'A mission system for coding agents built around durable state, evidence and release gates.'},{id:'aurel',name:'AUREL Beauty Edit',type:'Editorial commerce',status:'Experiment',href:'/projects/aurel/',keywords:'beauty kiko affiliate editorial storefront commerce',tags:['commerce'],summary:'An editorial beauty discovery storefront that refuses to fake a marketplace or checkout.'}];

const modal=document.querySelector('.search');
const input=document.querySelector('#project-search');
const results=document.querySelector('.search-results');
const searchTriggers=[...document.querySelectorAll('[data-search]')];
let previousFocus=null;

function render(q=''){
  if(!results)return;
  const needle=q.trim().toLowerCase();
  const filtered=projects.filter(p=>!needle||(p.name+' '+p.type+' '+p.status+' '+p.keywords).toLowerCase().includes(needle));
  results.innerHTML=filtered.map((p,i)=>`<a href="${p.href}" data-result="${i}"><span><strong>${p.name}</strong><br><small>${p.type} · ${p.status}</small></span><span aria-hidden="true">↗</span></a>`).join('')||'<div style="padding:18px;color:#777" role="status">No matching build.</div>';
}
function setSearchState(open){
  searchTriggers.forEach(b=>b.setAttribute('aria-expanded',String(open)));
  modal?.setAttribute('aria-hidden',String(!open));
}
function openSearch(){
  if(!modal)return;
  previousFocus=document.activeElement;
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  setSearchState(true);
  render(input?.value||'');
  setTimeout(()=>input?.focus(),20);
}
function closeSearch(){
  if(!modal)return;
  modal.classList.remove('open');
  document.body.style.overflow='';
  setSearchState(false);
  if(previousFocus instanceof HTMLElement)previousFocus.focus();
}
function moveResult(delta){
  const links=[...results?.querySelectorAll('a')||[]];
  if(!links.length)return;
  const current=links.indexOf(document.activeElement);
  const next=current<0?(delta>0?0:links.length-1):(current+delta+links.length)%links.length;
  links[next].focus();
}
searchTriggers.forEach(b=>{b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-expanded','false');b.addEventListener('click',openSearch)});
input?.addEventListener('input',e=>render(e.target.value));
input?.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();moveResult(1)}if(e.key==='ArrowUp'){e.preventDefault();moveResult(-1)}});
results?.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();moveResult(1)}if(e.key==='ArrowUp'){e.preventDefault();moveResult(-1)}if(e.key==='Home'){e.preventDefault();results.querySelector('a')?.focus()}if(e.key==='End'){e.preventDefault();[...results.querySelectorAll('a')].at(-1)?.focus()}});
modal?.addEventListener('click',e=>{if(e.target===modal)closeSearch()});
setSearchState(false);
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}
  if(e.key==='Escape'&&modal?.classList.contains('open')){e.preventDefault();closeSearch()}
  if(e.key==='Enter'&&modal?.classList.contains('open')&&document.activeElement===input){const first=results?.querySelector('a');if(first)location.href=first.href}
  if(e.key==='Tab'&&modal?.classList.contains('open')){
    const focusables=[...modal.querySelectorAll('input,a,button,[tabindex]:not([tabindex="-1"])')];
    if(!focusables.length)return;
    const first=focusables[0],last=focusables[focusables.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
});

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(pointer:fine)').matches;
const observer=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){if(!reduce)e.target.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:680,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});observer.unobserve(e.target)}}),{threshold:.08}):null;
if(observer)document.querySelectorAll('.project-card,.section-head,.timeline-row,.case-block,.principle').forEach(el=>observer.observe(el));

const filters=[...document.querySelectorAll('.atlas-filter')],nodes=[...document.querySelectorAll('.atlas-node')];
function setAtlas(filter='all'){
  filters.forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  nodes.forEach(n=>{const p=projects.find(x=>x.id===n.dataset.id);n.classList.toggle('dim',filter!=='all'&&!p?.tags.includes(filter))});
  document.querySelectorAll('.atlas-line').forEach(line=>{const a=projects.find(x=>x.id===line.dataset.a),b=projects.find(x=>x.id===line.dataset.b);line.style.opacity=filter==='all'||a?.tags.includes(filter)||b?.tags.includes(filter)?'1':'.12'});
}
filters.forEach(b=>b.addEventListener('click',()=>setAtlas(b.dataset.filter)));
if(filters.length)setAtlas('all');

const lensButtons=[...document.querySelectorAll('.lens-button')],lensStage=document.querySelector('.lens-stage');
function renderLens(id){
  const p=projects.find(x=>x.id===id);if(!p||!lensStage)return;
  lensButtons.forEach(b=>{const active=b.dataset.project===id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  const index=projects.indexOf(p)+1;
  lensStage.innerHTML=`<div><span class="lens-number">0${index} / 0${projects.length}</span><h3>${p.name}</h3><p>${p.summary}</p></div><div><div class="lens-tags"><span>${p.type}</span><span>${p.status}</span>${p.tags.map(t=>`<span>${t}</span>`).join('')}</div><p style="margin-top:22px"><a class="repo-link" href="${p.href}">Enter project world ↗</a></p></div>`;
}
lensButtons.forEach(b=>b.addEventListener('click',()=>renderLens(b.dataset.project)));
if(lensStage)renderLens(lensButtons[0]?.dataset.project||'sprachprep');

if(!reduce&&finePointer){
  document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-1.2}deg) rotateY(${x*1.2}deg) translateY(-5px)`}));
  document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform=''));
}
