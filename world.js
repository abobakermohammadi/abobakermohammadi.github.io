import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer:fine)').matches;
const mobile = innerWidth < 760;
const clamp = (v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const mix = (a,b,t)=>a+(b-a)*t;
const ease = t=>t*t*(3-2*t);

// DOM shell
const boot = document.createElement('div');
boot.className='world-boot';
boot.innerHTML=`<div class="world-boot-inner"><div class="world-boot-top"><span>ABOBAKER // BUILD SYSTEM</span><span>2026</span></div><div class="world-boot-mark">AM<i>∞</i></div><div class="world-boot-track"><i></i></div></div>`;
const canvas=document.createElement('canvas');canvas.id='am-world';canvas.setAttribute('aria-hidden','true');
const vignette=document.createElement('div');vignette.className='world-vignette';vignette.setAttribute('aria-hidden','true');
const hud=document.createElement('div');hud.className='world-hud';hud.setAttribute('aria-hidden','true');hud.innerHTML=`<div class="world-hud-left"><span class="world-hud-phase">BOOT / 01</span><div class="world-hud-rail"><i></i></div><span class="world-hud-index">01 / 06</span></div><div class="world-hud-bottom"><span>ABOBAKER.MOHAMMADI // LIVE BUILD INDEX</span><span class="world-hud-coord">X 00.00 // Y 00.00</span></div>`;
const cursor=document.createElement('div');cursor.className='world-cursor';cursor.setAttribute('aria-hidden','true');
const flash=document.createElement('div');flash.className='world-flash';flash.setAttribute('aria-hidden','true');
document.body.prepend(canvas,vignette,hud,cursor,boot);document.body.append(flash);
document.documentElement.classList.add('exp-loaded');document.body.classList.add('home-world');

const phaseLabel=hud.querySelector('.world-hud-phase');
const indexLabel=hud.querySelector('.world-hud-index');
const coordLabel=hud.querySelector('.world-hud-coord');

// Mark revealable content
const revealTargets=[...document.querySelectorAll('.section-head,.project-card,.atlas,.lens,.timeline-row,.principle,.about,.footer-card')];
revealTargets.forEach(el=>el.setAttribute('data-world-reveal',''));
if('IntersectionObserver' in window){
  const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');ro.unobserve(e.target)}}),{threshold:.08});
  revealTargets.forEach(el=>ro.observe(el));
}else revealTargets.forEach(el=>el.classList.add('seen'));

// Three.js world
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,alpha:false,powerPreference:'high-performance'});}catch(err){console.warn('3D experience unavailable',err);boot.classList.add('done');throw err;}
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.15:1.55));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;

const scene=new THREE.Scene();scene.background=new THREE.Color(0x050507);scene.fog=new THREE.FogExp2(0x050507,mobile?.024:.018);
const camera=new THREE.PerspectiveCamera(mobile?48:43,innerWidth/innerHeight,.05,180);camera.position.set(0,1.6,13);
const world=new THREE.Group();scene.add(world);

scene.add(new THREE.HemisphereLight(0xbfd3ff,0x100608,2.1));
const key=new THREE.DirectionalLight(0xffffff,4.2);key.position.set(-4,7,6);scene.add(key);
const blue=new THREE.PointLight(0x6f8cff,50,24,2);blue.position.set(-6,2,2);scene.add(blue);
const cyan=new THREE.PointLight(0x79f6ff,36,20,2);cyan.position.set(6,-1,-5);scene.add(cyan);
const warm=new THREE.PointLight(0xff5a3d,44,22,2);warm.position.set(4,5,6);scene.add(warm);

const metal=new THREE.MeshPhysicalMaterial({color:0x11131a,metalness:.9,roughness:.16,clearcoat:1,clearcoatRoughness:.08});
const pale=new THREE.MeshPhysicalMaterial({color:0xe9e7df,metalness:.72,roughness:.18,clearcoat:1});
const dark=new THREE.MeshStandardMaterial({color:0x08090d,metalness:.75,roughness:.3});
const cyanMat=new THREE.MeshBasicMaterial({color:0x79f6ff,toneMapped:false});
const blueMat=new THREE.MeshBasicMaterial({color:0x6f8cff,toneMapped:false});
const hotMat=new THREE.MeshBasicMaterial({color:0xff5a3d,toneMapped:false});

function bar(w,h,d,mat=metal){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d,2,2,2),mat)}
function makeSigil(){
  const g=new THREE.Group();
  const a=new THREE.Group();a.position.x=-1.15;
  const a1=bar(.26,2.65,.36,pale),a2=a1.clone(),ac=bar(1.32,.22,.36,pale);a1.rotation.z=-.26;a2.rotation.z=.26;a1.position.x=-.36;a2.position.x=.36;ac.position.y=-.05;a.add(a1,a2,ac);
  const m=new THREE.Group();m.position.x=1.15;
  const m1=bar(.24,2.55,.36,pale),m4=m1.clone(),m2=bar(.24,1.48,.36,pale),m3=m2.clone();m1.position.x=-.72;m4.position.x=.72;m2.position.set(-.3,.48,0);m3.position.set(.3,.48,0);m2.rotation.z=-.43;m3.rotation.z=.43;m.add(m1,m2,m3,m4);
  g.add(a,m);g.scale.setScalar(.92);return g;
}

const core=new THREE.Group();world.add(core);
const sigil=makeSigil();core.add(sigil);
const coreSphere=new THREE.Mesh(new THREE.IcosahedronGeometry(2.45,3),new THREE.MeshPhysicalMaterial({color:0x11131a,wireframe:true,transparent:true,opacity:.16,metalness:.8,roughness:.22}));core.add(coreSphere);
const innerSphere=new THREE.Mesh(new THREE.IcosahedronGeometry(1.9,2),new THREE.MeshPhysicalMaterial({color:0x0a0b10,metalness:.94,roughness:.12,transparent:true,opacity:.72}));core.add(innerSphere);
const rings=[];
[[3.2,.028,blueMat],[3.65,.022,cyanMat],[4.25,.018,hotMat]].forEach(([r,t,m],i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,t,10,180),m);ring.rotation.set(Math.PI/2+i*.5,i*.72,i*.2);core.add(ring);rings.push(ring)});
for(let i=0;i<18;i++){const s=new THREE.Mesh(new THREE.TetrahedronGeometry(mix(.08,.24,Math.random())),i%5===0?cyanMat:dark);const a=Math.random()*Math.PI*2,r=mix(3.2,6.4,Math.random());s.position.set(Math.cos(a)*r,mix(-2.8,2.8,Math.random()),Math.sin(a)*r);s.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);s.userData.seed=Math.random()*10;core.add(s)}

// Project constellation
const projectColors=[0x3157ff,0x39d394,0xf1eee6,0xff6b88,0x79f6ff,0xe8c47d];
const projectNames=['SprachPrep','MAMELAT','NEWAPP','AUREL','AEGIS','Sineklik'];
const projectGroups=[];
const constellation=new THREE.Group();world.add(constellation);
const positions=[[-7,1,-7],[7,2,-9],[-5,-2,-14],[6,-2,-16],[0,3,-20],[1,-3,-25]];
positions.forEach((pos,i)=>{
  const g=new THREE.Group();g.position.set(...pos);g.userData.base=g.position.clone();g.userData.name=projectNames[i];
  const mat=new THREE.MeshPhysicalMaterial({color:projectColors[i],metalness:.72,roughness:.18,clearcoat:1,emissive:projectColors[i],emissiveIntensity:.08});
  const block=new THREE.Mesh(new THREE.BoxGeometry(i%2?2.1:1.55,mix(2.6,4.2,(i%3)/2),.36),mat);block.rotation.y=(i-.5)*.09;g.add(block);
  const frame=new THREE.Mesh(new THREE.TorusGeometry(2.05,.025,8,100),new THREE.MeshBasicMaterial({color:projectColors[i],transparent:true,opacity:.7,toneMapped:false}));frame.rotation.x=Math.PI/2;g.add(frame);
  const halo=new THREE.Mesh(new THREE.RingGeometry(2.55,2.58,120),new THREE.MeshBasicMaterial({color:projectColors[i],transparent:true,opacity:.2,side:THREE.DoubleSide,toneMapped:false}));halo.rotation.y=Math.PI/2;g.add(halo);
  g.userData.block=block;g.userData.frame=frame;g.userData.halo=halo;const beacon=new THREE.PointLight(projectColors[i],9,9,2);g.add(beacon);g.userData.light=beacon;
  constellation.add(g);projectGroups.push(g);
});

// Lines tying projects into a system
const lineMat=new THREE.LineBasicMaterial({color:0x6f8cff,transparent:true,opacity:.18});
positions.forEach((p,i)=>{const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(...p)]);const line=new THREE.Line(geo,lineMat.clone());world.add(line)});

// Architectural corridor
const corridor=new THREE.Group();world.add(corridor);
for(let z=-8;z>-70;z-=5){
  const depth=Math.abs(z);const w=8+depth*.11;const h=5+depth*.035;
  const geo=new THREE.BoxGeometry(w,.035,.035);const top=new THREE.Mesh(geo,depth%10===0?cyanMat:blueMat);top.position.set(0,h,z);top.material=top.material.clone();top.material.transparent=true;top.material.opacity=.18;corridor.add(top);
  const vgeo=new THREE.BoxGeometry(.035,h*2,.035);const l=new THREE.Mesh(vgeo,top.material),r=l.clone();l.position.set(-w/2,0,z);r.position.set(w/2,0,z);corridor.add(l,r);
}
const grid=new THREE.GridHelper(150,90,0x33406f,0x171b2c);grid.position.y=-3.1;grid.material.transparent=true;grid.material.opacity=.18;world.add(grid);

// Particle depth
const count=mobile?700:1800;const pts=new Float32Array(count*3);for(let i=0;i<count;i++){const r=mix(8,70,Math.random());const a=Math.random()*Math.PI*2;pts[i*3]=Math.cos(a)*r;pts[i*3+1]=mix(-16,16,Math.random());pts[i*3+2]=Math.sin(a)*r-15;}const pgeo=new THREE.BufferGeometry();pgeo.setAttribute('position',new THREE.BufferAttribute(pts,3));const particles=new THREE.Points(pgeo,new THREE.PointsMaterial({color:0xb8c8ff,size:mobile?.035:.045,transparent:true,opacity:.6,sizeAttenuation:true}));world.add(particles);

const path=new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,1.6,13),new THREE.Vector3(4,2,9),new THREE.Vector3(-5,1,3),new THREE.Vector3(0,1,-5),new THREE.Vector3(7,2,-11),new THREE.Vector3(-6,-1,-17),new THREE.Vector3(0,2,-24),new THREE.Vector3(0,0,-38),new THREE.Vector3(0,4,-54)
],false,'catmullrom',.6);
const lookPath=new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,0,0),new THREE.Vector3(0,.5,-1),new THREE.Vector3(0,0,-7),new THREE.Vector3(1,0,-12),new THREE.Vector3(0,0,-20),new THREE.Vector3(0,0,-30),new THREE.Vector3(0,1,-48)
],false,'catmullrom',.7);

let pointerX=0,pointerY=0,targetPX=0,targetPY=0,activeProject=-1,lastScroll=scrollY,scrollVelocity=0;
if(finePointer){
  addEventListener('pointermove',e=>{targetPX=(e.clientX/innerWidth-.5)*2;targetPY=(e.clientY/innerHeight-.5)*2;cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';coordLabel.textContent=`X ${targetPX.toFixed(2)} // Y ${(-targetPY).toFixed(2)}`});
  document.querySelectorAll('a,button,.project-card').forEach(el=>{el.addEventListener('pointerenter',()=>cursor.classList.add('hot'));el.addEventListener('pointerleave',()=>cursor.classList.remove('hot'))});
}

const cards=[...document.querySelectorAll('.project-card')];
const hrefOrder=['sprachprep','mamelat','newapp','aurel','aegis','sineklik'];
cards.forEach(card=>{
  const slug=card.getAttribute('href')?.split('/').filter(Boolean).at(-1);const idx=hrefOrder.indexOf(slug);
  card.addEventListener('pointerenter',()=>{if(idx>=0)activeProject=idx});
  card.addEventListener('pointerleave',()=>activeProject=-1);
});

// Cinematic internal navigation
for(const link of document.querySelectorAll('a[href^="/projects/"]')){
  link.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();flash.classList.add('go');document.body.style.pointerEvents='none';setTimeout(()=>{location.href=link.href},430)});
}

const sections=[
  {el:document.querySelector('.hero'),name:'ORIGIN',n:'01 / 06'},
  {el:document.querySelector('#work'),name:'WORLDS',n:'02 / 06'},
  {el:document.querySelector('#atlas'),name:'ATLAS',n:'03 / 06'},
  {el:document.querySelector('#lens'),name:'LENS',n:'04 / 06'},
  {el:document.querySelector('#timeline'),name:'TRAIL',n:'05 / 06'},
  {el:document.querySelector('#about'),name:'ABOUT',n:'06 / 06'}
].filter(x=>x.el);

function scrollState(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const p=clamp(scrollY/max);const delta=scrollY-lastScroll;lastScroll=scrollY;scrollVelocity=mix(scrollVelocity,delta,.1);
  document.documentElement.style.setProperty('--world-progress',`${(p*100).toFixed(2)}%`);
  let current=sections[0];const mid=innerHeight*.48;for(const s of sections){const r=s.el.getBoundingClientRect();s.el.dataset.worldActive=String(r.top<mid&&r.bottom>mid);if(r.top<mid)current=s;}
  if(current){phaseLabel.textContent=current.name+' / '+current.n.slice(0,2);indexLabel.textContent=current.n;}
  return p;
}

const bgA=new THREE.Color(0x050507),bgB=new THREE.Color(0x090c17),bgC=new THREE.Color(0x140b12),bgD=new THREE.Color(0x050507),tmpBg=new THREE.Color();
const target=new THREE.Vector3();
let time=0;
function render(){
  requestAnimationFrame(render);time+=.008;const p=scrollState();pointerX=mix(pointerX,targetPX,.045);pointerY=mix(pointerY,targetPY,.045);
  const pathP=clamp(p*.97);const pos=path.getPointAt(pathP);camera.position.lerp(pos,.065);const lk=lookPath.getPointAt(clamp(pathP*.98));target.copy(lk);target.x+=pointerX*(mobile?0:.55);target.y+=-pointerY*(mobile?0:.3);camera.lookAt(target);
  camera.rotation.z+=pointerX*.0008+clamp(scrollVelocity,-35,35)*.00005;
  camera.fov=mix(camera.fov,43+Math.min(9,Math.abs(scrollVelocity)*.05),.05);camera.updateProjectionMatrix();

  core.rotation.y+=.0025+Math.abs(scrollVelocity)*.000008;core.rotation.x=Math.sin(time*.55)*.08;coreSphere.rotation.x-=.0018;coreSphere.rotation.y+=.0026;innerSphere.rotation.y-=.002;
  rings.forEach((r,i)=>{r.rotation.z+=.0015*(i+1);r.scale.setScalar(1+Math.sin(time*(1.2+i*.18)+i)*.018)});
  const coreFade=1-clamp((p-.24)/.18);core.visible=coreFade>.02;core.scale.setScalar(mix(.65,1.05,coreFade));sigil.rotation.y=pointerX*.08;

  constellation.rotation.y=Math.sin(time*.18)*.06;projectGroups.forEach((g,i)=>{const hot=i===activeProject;g.position.y=g.userData.base.y+Math.sin(time*1.4+i)*.28;g.rotation.y=Math.sin(time*.7+i)*.12;g.userData.frame.rotation.z+=.003*(i%2?1:-1);g.userData.halo.rotation.z-=.0015;g.userData.block.material.emissiveIntensity=mix(g.userData.block.material.emissiveIntensity,hot?.72:.08,.1);g.userData.light.intensity=mix(g.userData.light.intensity,hot?38:9,.08);const s=hot?1.22:1;g.scale.lerp(new THREE.Vector3(s,s,s),.08)});
  constellation.visible=p>.13&&p<.69;
  corridor.visible=p>.47;corridor.position.z=-(p-.47)*18;grid.material.opacity=mix(grid.material.opacity,p>.44?.24:.08,.04);
  particles.rotation.y+=.00018;particles.position.z=(p*4)%4;
  lineMat.opacity=.12+.08*Math.sin(time);

  if(p<.32)tmpBg.lerpColors(bgA,bgB,ease(p/.32));else if(p<.67)tmpBg.lerpColors(bgB,bgC,ease((p-.32)/.35));else tmpBg.lerpColors(bgC,bgD,ease((p-.67)/.33));scene.background.copy(tmpBg);scene.fog.color.copy(tmpBg);
  blue.intensity=36+Math.sin(time*2)*8;cyan.intensity=28+Math.sin(time*1.7+2)*7;warm.intensity=30+Math.sin(time*1.3+4)*9;
  renderer.render(scene,camera);scrollVelocity*=.92;
}

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.15:1.55))});

if(reduce){core.rotation.set(0,0,0);cards.forEach(c=>c.style.transform='none')}
setTimeout(()=>boot.classList.add('done'),reduce?150:1250);
render();
