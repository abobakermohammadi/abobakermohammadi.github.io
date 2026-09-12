const projects=[
  {name:'SprachPrep',type:'Education · Web + iOS',status:'Live product',href:'/projects/sprachprep/',keywords:'german goethe education ios learning exams speaking mock progress'},
  {name:'MAMELAT',type:'Real estate',status:'Building',href:'/projects/mamelat/',keywords:'real estate property istanbul mamelat whatsapp'},
  {name:'NEWAPP',type:'Native iPhone experiment',status:'Experiment',href:'/projects/newapp/',keywords:'books ios swiftui search library native'},
  {name:'AUREL Beauty Edit',type:'Editorial commerce',status:'Experiment',href:'/projects/aurel/',keywords:'beauty editorial storefront commerce'},
  {name:'AEGIS',type:'Agent systems',status:'Open source',href:'/projects/aegis/',keywords:'ai agents coding benchmark evidence verification'},
  {name:'Sineklik İstanbul',type:'Local business system',status:'Built',href:'/projects/sineklik/',keywords:'sineklik istanbul booking admin configurator chat quotes portal'}
];

const modal=document.querySelector('.search');
const input=document.querySelector('#project-search');
const results=document.querySelector('.search-results');
const triggers=[...document.querySelectorAll('[data-search]')];
let previousFocus=null;

function render(q=''){
  const needle=q.trim().toLowerCase();
  const filtered=projects.filter(p=>!needle||(`${p.name} ${p.type} ${p.status} ${p.keywords}`).toLowerCase().includes(needle));
  results.innerHTML=filtered.map(p=>`<a href="${p.href}"><span><strong>${p.name}</strong><br><small>${p.type} · ${p.status}</small></span><span>↗</span></a>`).join('')||'<div style="padding:18px;color:#777">No matching build.</div>';
}
function openSearch(){
  previousFocus=document.activeElement;
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  render(input?.value||'');
  setTimeout(()=>input?.focus(),20);
}
function closeSearch(){
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  if(previousFocus instanceof HTMLElement)previousFocus.focus();
}
triggers.forEach(b=>b.addEventListener('click',openSearch));
input?.addEventListener('input',e=>render(e.target.value));
modal?.addEventListener('click',e=>{if(e.target===modal)closeSearch()});
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}
  if(e.key==='Escape'&&modal?.classList.contains('open'))closeSearch();
});

const proof=document.querySelector('[data-proof-toggle]');
function setProof(on){
  document.body.classList.toggle('proof-mode',on);
  proof?.setAttribute('aria-pressed',String(on));
  if(proof)proof.textContent=on?'Proof ✓':'Proof';
}
proof?.addEventListener('click',()=>setProof(!document.body.classList.contains('proof-mode')));
setProof(false);

const revealTargets=[...document.querySelectorAll('.project-card,.principle-grid article,.about-grid,.hero-aside')];
revealTargets.forEach(el=>el.setAttribute('data-reveal',''));
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
    });
  },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
  revealTargets.forEach((el,index)=>{el.style.transitionDelay=`${Math.min(index%3,2)*55}ms`;observer.observe(el)});
}else{
  revealTargets.forEach(el=>el.classList.add('visible'));
}

function updateScrollProgress(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  document.documentElement.style.setProperty('--page-progress',`${Math.min(1,scrollY/max)*100}%`);
}
addEventListener('scroll',updateScrollProgress,{passive:true});
updateScrollProgress();
