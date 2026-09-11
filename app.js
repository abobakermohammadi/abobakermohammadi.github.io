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
function setSearchState(open){searchTriggers.forEach(b=>b.setAttribute('aria-expanded',String(open)));modal?.setAttribute('aria-hidden',String(!open))}
function openSearch(){if(!modal)return;previousFocus=document.activeElement;modal.classList.add('open');document.body.style.overflow='hidden';setSearchState(true);render(input?.value||'');setTimeout(()=>input?.focus(),20)}
function closeSearch(){if(!modal)return;modal.classList.remove('open');document.body.style.overflow='';setSearchState(false);if(previousFocus instanceof HTMLElement)previousFocus.focus()}
function moveResult(delta){const links=[...results?.querySelectorAll('a')||[]];if(!links.length)return;const current=links.indexOf(document.activeElement);const next=current<0?(delta>0?0:links.length-1):(current+delta+links.length)%links.length;links[next].focus()}
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
  if(e.key==='Tab'&&modal?.classList.contains('open')){const focusables=[...modal.querySelectorAll('input,a,button,[tabindex]:not([tabindex="-1"])')];if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
});

const proofToggle=document.querySelector('[data-proof-toggle]');
function setProofMode(on,{persist=true}={}){document.body.classList.toggle('proof-mode',on);proofToggle?.setAttribute('aria-pressed',String(on));if(proofToggle)proofToggle.textContent=on?'Proof mode ✓':'Proof mode';if(persist){try{localStorage.setItem('am-proof-mode',on?'1':'0')}catch{}}}
if(proofToggle){let initial=false;try{initial=localStorage.getItem('am-proof-mode')==='1'}catch{}if(new URLSearchParams(location.search).get('proof')==='1')initial=true;setProofMode(initial,{persist:false});proofToggle.addEventListener('click',()=>setProofMode(!document.body.classList.contains('proof-mode')))}

const caseLenses={
  sprachprep:{label:'Skill lens',items:[
    {name:'Reading',eyebrow:'Exam muscle / comprehension',title:'Read for the task, not for the vibe.',copy:'Practice has to train extracting the right information under an exam-shaped prompt, then make the mistake legible enough to improve on the next attempt.',route:['Prompt','Passage','Answer','Feedback','Review']},
    {name:'Listening',eyebrow:'Exam muscle / audio',title:'Hear once. Decide with evidence.',copy:'Listening practice changes the medium and pressure while keeping the same product loop: task context, response, immediate correction and visible progress.',route:['Context','Audio','Decision','Feedback','Retry']},
    {name:'Writing',eyebrow:'Exam muscle / production',title:'Turn a blank page into a trainable skill.',copy:'Writing needs prompts, structure and feedback that help a learner see what to change, not a mysterious score dropped from the sky.',route:['Prompt','Draft','Check','Feedback','Rewrite']},
    {name:'Speaking',eyebrow:'Exam muscle / response',title:'Practice the moment you have to say it out loud.',copy:'Speaking work is where preparation becomes performance: understand the scenario, respond, inspect the result and repeat with less friction.',route:['Scenario','Respond','Evaluate','Repeat']}
  ]},
  mamelat:{label:'Intent router',items:[
    {name:'Buy',eyebrow:'Visitor intent / buyer',title:'Show me what is real, then let me talk to a human.',copy:'The buyer path makes current inventory understandable without manufacturing stock. If the right property is not public, contact becomes the honest next step.',route:['Orient','Real inventory','Understand','WhatsApp / call']},
    {name:'Sell',eyebrow:'Visitor intent / seller',title:'Explain the service before asking for the property.',copy:'Seller and landlord intent should not be buried behind listings. The path clarifies what MAMELAT can do, then hands the conversation to the business.',route:['Need','Service','Property context','Contact']},
    {name:'Private request',eyebrow:'Visitor intent / off-market',title:'When the catalog is not the answer, ask for the brief.',copy:'Private requests remain secondary but useful: capture the actual criteria instead of pretending the public grid contains everything.',route:['Criteria','Context','Human handoff']}
  ]},
  newapp:{label:'Product boundary',items:[
    {name:'Discover',eyebrow:'v1 / Home + Search',title:'Discovery before feature accumulation.',copy:'The first job is helping someone find a book worth caring about. Provider-backed actions stay narrow until evidence says they are dependable.',route:['Home','Search','Inspect','Must Read']},
    {name:'Library',eyebrow:'v1 / local state',title:'A tiny state model that survives because it is understandable.',copy:'Must Read and Read are intentionally local-first. No account graph or sync layer is smuggled in before the core product earns it.',route:['Must Read','Read','Local persistence']},
    {name:'Release',eyebrow:'v1 / evidence gates',title:'A source audit is not a device test.',copy:'Release tooling checks provider evidence and rejection risks, then still requires Xcode and real-device verification before the build can be treated as release-ready.',route:['Evidence','Static audit','Xcode','Device','Release']}
  ]},
  aegis:{label:'Mission lens',items:[
    {name:'Mission',eyebrow:'System / intent',title:'Turn “build this” into state that can survive the session.',copy:'A mission carries goal, acceptance criteria and current state so the agent does not have to rediscover the work every time context changes.',route:['Goal','Criteria','State','Next action']},
    {name:'Evidence',eyebrow:'System / proof',title:'The command is part of the claim.',copy:'A test, deployment or worker capability only counts when the system has executable evidence. Changing relevant code can make old evidence stale.',route:['Action','Command','Output','Freshness']},
    {name:'Verify',eyebrow:'System / release',title:'Completion is derived, not narrated.',copy:'Release gates ask whether acceptance evidence still passes. If it does not, the mission is not finished no matter how confident the prose sounds.',route:['Gate','Regression check','Acceptance','Ship']}
  ]},
  sineklik:{label:'Workflow lens',items:[
    {name:'Find',eyebrow:'Customer / discovery',title:'Start with the room, not the product catalog.',copy:'Sineklik Bul and the configurator reduce product-language friction by guiding the customer from need to a more concrete request.',route:['Need','Finder','Configure','Ask']},
    {name:'Book',eyebrow:'Customer / continuity',title:'Do not drop the lead after the form submit.',copy:'Appointments, status surfaces, messaging and quotes turn initial intent into a trackable customer journey rather than a lonely contact form.',route:['Appointment','Status','Message','Quote']},
    {name:'Operate',eyebrow:'Business / admin',title:'The other half of the website faces inward.',copy:'Leads, chat, quote workflow, uploads and phone-first administration make the product useful to the business after the marketing page has done its job.',route:['Lead','Chat','Quote','Admin']}
  ]},
  aurel:{label:'Editorial lens',items:[
    {name:'Edit',eyebrow:'Discovery / curation',title:'Ten products should feel chosen, not scraped.',copy:'AUREL begins with a narrow researched drop so hierarchy, pacing and comparison can communicate a point of view instead of infinite-catalog fatigue.',route:['Research','Narrow','Arrange','Explain']},
    {name:'Shop',eyebrow:'Commerce / handoff',title:'Discovery here. Transaction there.',copy:'The storefront helps someone understand and choose, then sends them to the real retailer. Affiliate tracking can be added later without faking ownership of checkout.',route:['Discover','Compare','Choose','Retailer']},
    {name:'Integrity',eyebrow:'Commerce / truth',title:'Look premium without cosplaying as the brand.',copy:'Official product media is used for the real products, while the experience stays explicit that AUREL is an independent edit rather than KIKO MILANO itself.',route:['Official media','Independent framing','Clear handoff']}
  ]}
};
function initCaseLens(){
  const match=location.pathname.match(/^\/projects\/([^/]+)\/?/);if(!match)return;
  const lens=caseLenses[match[1]],story=document.querySelector('#story');if(!lens||!story)return;
  const section=document.createElement('section');section.className='section shell';section.setAttribute('aria-label',lens.label);
  section.innerHTML=`<div class="case-interaction"><div class="case-interaction-controls"><p class="kicker">${lens.label}</p>${lens.items.map((item,i)=>`<button class="case-interaction-button" type="button" data-case-index="${i}" aria-pressed="${i===0?'true':'false'}">${item.name}</button>`).join('')}</div><div class="case-interaction-stage" aria-live="polite"></div></div>`;
  story.parentNode.insertBefore(section,story);
  const stage=section.querySelector('.case-interaction-stage'),buttons=[...section.querySelectorAll('.case-interaction-button')];
  const show=i=>{const item=lens.items[i];buttons.forEach((b,index)=>b.setAttribute('aria-pressed',String(index===i)));stage.innerHTML=`<div><small>${item.eyebrow}</small><h2>${item.title}</h2><p>${item.copy}</p></div><div class="case-interaction-route">${item.route.map(step=>`<span>${step}</span>`).join('')}</div>`};
  buttons.forEach((b,i)=>b.addEventListener('click',()=>show(i)));show(0);
}
initCaseLens();

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(pointer:fine)').matches;
const observer=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){if(!reduce)e.target.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:680,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});observer.unobserve(e.target)}}),{threshold:.08}):null;
if(observer)document.querySelectorAll('.project-card,.section-head,.timeline-row,.case-block,.principle,.case-interaction').forEach(el=>observer.observe(el));

const filters=[...document.querySelectorAll('.atlas-filter')],nodes=[...document.querySelectorAll('.atlas-node')];
function setAtlas(filter='all'){filters.forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});nodes.forEach(n=>{const p=projects.find(x=>x.id===n.dataset.id);n.classList.toggle('dim',filter!=='all'&&!p?.tags.includes(filter))});document.querySelectorAll('.atlas-line').forEach(line=>{const a=projects.find(x=>x.id===line.dataset.a),b=projects.find(x=>x.id===line.dataset.b);line.style.opacity=filter==='all'||a?.tags.includes(filter)||b?.tags.includes(filter)?'1':'.12'})}
filters.forEach(b=>b.addEventListener('click',()=>setAtlas(b.dataset.filter)));if(filters.length)setAtlas('all');

const lensButtons=[...document.querySelectorAll('.lens-button')],lensStage=document.querySelector('.lens-stage');
function renderLens(id){const p=projects.find(x=>x.id===id);if(!p||!lensStage)return;lensButtons.forEach(b=>{const active=b.dataset.project===id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});const index=projects.indexOf(p)+1;lensStage.innerHTML=`<div><span class="lens-number">0${index} / 0${projects.length}</span><h3>${p.name}</h3><p>${p.summary}</p></div><div><div class="lens-tags"><span>${p.type}</span><span>${p.status}</span>${p.tags.map(t=>`<span>${t}</span>`).join('')}</div><p style="margin-top:22px"><a class="repo-link" href="${p.href}">Enter project world ↗</a></p></div>`}
lensButtons.forEach(b=>b.addEventListener('click',()=>renderLens(b.dataset.project)));if(lensStage)renderLens(lensButtons[0]?.dataset.project||'sprachprep');

if(!reduce&&finePointer){document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-1.2}deg) rotateY(${x*1.2}deg) translateY(-5px)`}));document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform=''))}
