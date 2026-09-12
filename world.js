import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const mobile=innerWidth<760;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;
const canvas=document.querySelector('#am-world');
const cursor=document.querySelector('.x-cursor');
const transition=document.querySelector('.x-transition');
const progressBar=document.querySelector('.x-progress i');
const sceneName=document.querySelector('.x-scene-name');
const sceneCount=document.querySelector('.x-scene-count');
const scenes=[...document.querySelectorAll('.x-scene')];

let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,alpha:false,powerPreference:'high-performance'});}catch(err){console.warn('WebGL unavailable',err);throw err;}
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.15:1.7));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(mobile?48:41,innerWidth/innerHeight,.05,160);
scene.add(new THREE.HemisphereLight(0xffffff,0x28231e,2.1));
const key=new THREE.DirectionalLight(0xffffff,5.8);key.position.set(-5,9,7);scene.add(key);
const rim=new THREE.PointLight(0xb7d7ff,90,28,2);rim.position.set(7,3,4);scene.add(rim);
const warm=new THREE.PointLight(0xffb37d,65,25,2);warm.position.set(-7,-1,-2);scene.add(warm);

const chrome=new THREE.MeshPhysicalMaterial({color:0xbfc3c8,metalness:1,roughness:.08,clearcoat:1,clearcoatRoughness:.035,iridescence:1,iridescenceIOR:1.45,iridescenceThicknessRange:[120,360]});
const darkChrome=new THREE.MeshPhysicalMaterial({color:0x17181b,metalness:1,roughness:.12,clearcoat:1,clearcoatRoughness:.04});
const ivory=new THREE.MeshPhysicalMaterial({color:0xf7f2e8,metalness:.28,roughness:.2,clearcoat:1});
const black=new THREE.MeshStandardMaterial({color:0x080807,metalness:.55,roughness:.23});
const glass=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:.05,roughness:.05,transmission:.9,thickness:.5,transparent:true,opacity:.55,ior:1.28});
const cobalt=new THREE.MeshPhysicalMaterial({color:0x244af0,metalness:.5,roughness:.12,clearcoat:1,emissive:0x11247d,emissiveIntensity:.35});
const red=new THREE.MeshPhysicalMaterial({color:0xe14331,metalness:.25,roughness:.18,clearcoat:1});
const pink=new THREE.MeshPhysicalMaterial({color:0xe9a9bb,metalness:.15,roughness:.12,clearcoat:1});
const mint=new THREE.MeshPhysicalMaterial({color:0x88d8bb,metalness:.3,roughness:.15,clearcoat:1});
const gold=new THREE.MeshPhysicalMaterial({color:0x9b7448,metalness:.8,roughness:.16,clearcoat:1});

function mesh(geo,mat=chrome){const m=new THREE.Mesh(geo,mat);m.castShadow=false;m.receiveShadow=false;return m}
function box(x,y,z,mat=chrome){return mesh(new THREE.BoxGeometry(x,y,z,2,2,2),mat)}
function ring(r,t,mat=chrome){return mesh(new THREE.TorusGeometry(r,t,12,120),mat)}
function sphere(r,mat=chrome,seg=40){return mesh(new THREE.SphereGeometry(r,seg,Math.max(16,seg/2)),mat)}

const spacing=14;
const stationX=[2.1,1.7,-2.2,2.3,-2.1,1.2,-1.7];
const stationY=[.1,.2,.0,-.2,.1,.0,.0];
const groups=[];
const root=new THREE.Group();scene.add(root);

function station(i){const g=new THREE.Group();g.position.set(stationX[i],stationY[i],-i*spacing);root.add(g);groups.push(g);return g}

// ORIGIN: liquid metal loop / identity object
{
 const g=station(0);
 const knot=mesh(new THREE.TorusKnotGeometry(2.15,.52,240,32,2,3),chrome);knot.rotation.set(.7,.15,.2);g.add(knot);g.userData.knot=knot;
 const halo=ring(3.55,.025,darkChrome);halo.rotation.x=Math.PI/2;g.add(halo);
 const halo2=ring(4.35,.012,chrome);halo2.rotation.set(Math.PI/2,.45,.2);g.add(halo2);g.userData.rings=[halo,halo2];
 const orb=sphere(.42,ivory);orb.position.set(-2.7,1.65,.2);g.add(orb);g.userData.orb=orb;
}

// SprachPrep: four skill orbits around one learning core
{
 const g=station(1);const core=sphere(1.35,ivory,56);g.add(core);g.userData.core=core;const rs=[];
 [2.1,2.65,3.2,3.75].forEach((r,i)=>{const x=ring(r,.055,i===0?cobalt:(i%2?chrome:ivory));x.rotation.set(Math.PI/2+i*.22,i*.33,i*.18);g.add(x);rs.push(x)});g.userData.rings=rs;
 for(let i=0;i<4;i++){const a=i*Math.PI/2;const dot=sphere(.22,i===0?cobalt:chrome,28);dot.position.set(Math.cos(a)*3.25,Math.sin(a)*1.25,Math.sin(a)*2.3);g.add(dot)}
}

// MAMELAT: impossible architectural city
{
 const g=station(2);const city=new THREE.Group();g.add(city);g.userData.city=city;
 const footprints=[[-1.8,1.8,.85,.85],[-.65,3.6,1.1,1.1],[.7,2.45,.9,1.2],[1.8,4.3,.72,.9],[-2.5,3.2,.62,.76],[2.55,2.6,.62,.72]];
 footprints.forEach(([x,h,w,d],i)=>{const tower=box(w,h,d,i===1?gold:(i%3===0?glass:darkChrome));tower.position.set(x,h/2-1.9,(i%2?-.7:.65));tower.rotation.y=(i-2)*.07;city.add(tower);for(let j=0;j<Math.floor(h*3);j++){const line=box(w*.84,.015,d+.012,ivory);line.position.set(x,-1.72+j*.31,(i%2?-.7:.65));line.material=line.material.clone();line.material.transparent=true;line.material.opacity=.28;city.add(line)}});
 const sun=sphere(.72,gold,40);sun.position.set(2.9,2.5,-1.2);g.add(sun);g.userData.sun=sun;
 const base=box(6.8,.12,5.1,glass);base.position.y=-2;g.add(base);
}

// NEWAPP: device, paper, controlled release
{
 const g=station(3);const pages=[];
 const phone=box(2.05,4.3,.24,darkChrome);phone.position.x=.4;phone.rotation.set(.05,-.28,-.05);g.add(phone);g.userData.phone=phone;
 const screen=box(1.79,3.93,.04,ivory);screen.position.set(.31,.02,.22);screen.rotation.copy(phone.rotation);g.add(screen);
 for(let i=0;i<7;i++){const p=box(2.2,3.25,.035,i%2?ivory:red);p.position.set(-2.2+i*.22,(i-3)*.08,-.6-i*.18);p.rotation.set(.08,(i-3)*.1,-.18+(i-3)*.035);g.add(p);pages.push(p)}g.userData.pages=pages;
 const seal=ring(1.05,.06,red);seal.position.set(2.7,-1.5,.2);seal.rotation.x=Math.PI/2;g.add(seal);g.userData.seal=seal;
}

// AUREL: pearl orbit + chrome editorial ribbon
{
 const g=station(4);const ribbon=mesh(new THREE.TorusKnotGeometry(1.8,.28,220,28,3,5),chrome);ribbon.scale.set(1.35,.85,.9);ribbon.rotation.set(.8,-.2,.35);g.add(ribbon);g.userData.ribbon=ribbon;
 const pearls=new THREE.Group();for(let i=0;i<18;i++){const a=i/18*Math.PI*2;const p=sphere(i%5===0?.3:.18,i%4===0?chrome:ivory,24);p.position.set(Math.cos(a)*3.25,Math.sin(a*2)*.72,Math.sin(a)*2.15);pearls.add(p)}g.add(pearls);g.userData.pearls=pearls;
 const blush=sphere(.9,pink,48);blush.position.set(-2.5,-1.25,.7);g.add(blush);g.userData.blush=blush;
}

// AEGIS: evidence lattice
{
 const g=station(5);const core=mesh(new THREE.IcosahedronGeometry(1.5,2),darkChrome);g.add(core);g.userData.core=core;
 const nodePositions=[];for(let i=0;i<14;i++){const a=i*.93;const y=mix(-2.8,2.8,(i%7)/6);const r=2.8+(i%3)*.45;nodePositions.push(new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r*.6))}
 const nodes=new THREE.Group();nodePositions.forEach((p,i)=>{const n=sphere(i%4===0?.18:.11,i%3===0?mint:ivory,18);n.position.copy(p);nodes.add(n)});g.add(nodes);g.userData.nodes=nodes;
 const lm=new THREE.LineBasicMaterial({color:0xcfffe5,transparent:true,opacity:.42});for(let i=0;i<nodePositions.length-1;i++){const geo=new THREE.BufferGeometry().setFromPoints([nodePositions[i],nodePositions[i+1],new THREE.Vector3(0,0,0)]);g.add(new THREE.Line(geo,lm))}
 const wire=mesh(new THREE.IcosahedronGeometry(3.9,1),new THREE.MeshBasicMaterial({color:0xd8ffe6,wireframe:true,transparent:true,opacity:.15}));g.add(wire);g.userData.wire=wire;
}

// Sineklik: kinetic window system
{
 const g=station(6);const frame=new THREE.Group();const panels=[];g.add(frame);g.userData.frame=frame;
 const outerV=[-3.1,3.1].map(x=>{const m=box(.12,5.4,.16,darkChrome);m.position.x=x;return m});const outerH=[-2.65,2.65].map(y=>{const m=box(6.3,.12,.16,darkChrome);m.position.y=y;return m});frame.add(...outerV,...outerH);
 for(let x=-2.4;x<=2.4;x+=.8){const v=box(.028,4.95,.025,mint);v.position.x=x;frame.add(v)}for(let y=-2.0;y<=2.0;y+=.62){const h=box(5.95,.028,.025,mint);h.position.y=y;frame.add(h)}
 for(let i=0;i<6;i++){const p=box(.82,4.7,.045,i%2?glass:mint);p.position.x=-2.05+i*.82;p.userData.baseX=p.position.x;frame.add(p);panels.push(p)}g.userData.panels=panels;
 const breeze=new THREE.Group();for(let i=0;i<28;i++){const s=sphere(.035,ivory,10);s.position.set(mix(-4,4,Math.random()),mix(-2.4,2.4,Math.random()),mix(-1.5,2.5,Math.random()));breeze.add(s)}g.add(breeze);g.userData.breeze=breeze;
}

// Portal architecture between worlds
const portals=[];
for(let i=0;i<6;i++){
 const p=new THREE.Group();p.position.z=-(i+.5)*spacing;p.position.x=(stationX[i]+stationX[i+1])*.5;
 for(let j=0;j<5;j++){const r=ring(3.5+j*.58,.018,j===2?chrome:darkChrome);r.position.z=j*.18;r.scale.y=.82+j*.03;p.add(r)}root.add(p);portals.push(p)
}

// Dust that makes camera travel legible
const dustCount=mobile?650:1600;const dustPos=new Float32Array(dustCount*3);for(let i=0;i<dustCount;i++){dustPos[i*3]=mix(-10,10,Math.random());dustPos[i*3+1]=mix(-7,7,Math.random());dustPos[i*3+2]=mix(8,-94,Math.random())}const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xffffff,size:mobile?.025:.035,transparent:true,opacity:.34,sizeAttenuation:true}));scene.add(dust);

const palette=['#eee9df','#163ccf','#e7ddcc','#e14331','#efc3cf','#10110f','#a9dfca'];
const names=['ORIGIN','SPRACHPREP','MAMELAT','NEWAPP','AUREL','AEGIS','SINEKLIK'];
const bgColors=palette.map(c=>new THREE.Color(c));
const tempColor=new THREE.Color();
const look=new THREE.Vector3();
const camX=[6.2,-4.8,5.1,-4.7,5.2,-4.6,5.3];
const camY=[2.1,1.5,1.8,1.2,1.55,2.2,1.5];
let px=0,py=0,tpx=0,tpy=0,lastY=scrollY,velocity=0,time=0,hoverProject=-1;

function sceneFloat(){return clamp(scrollY/Math.max(1,innerHeight),0,6)}
function updateDOM(idx){
 const whole=Math.round(idx);const frac=idx-Math.floor(idx);const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const page=clamp(scrollY/max);
 document.documentElement.style.setProperty('--progress',`${(page*100).toFixed(2)}%`);if(progressBar)progressBar.style.height=`${page*100}%`;
 if(sceneName)sceneName.textContent=names[whole]||'BUILD';if(sceneCount)sceneCount.textContent=`0${whole} / 06`;
 document.body.className=`cinema-home scene-${(names[whole]||'build').toLowerCase()}`;
 scenes.forEach((el,i)=>{const d=idx-i;const strength=clamp(1-Math.abs(d));el.style.setProperty('--scene-strength',strength.toFixed(3));const title=el.querySelector('.x-project-title');if(title){const parts=[...title.querySelectorAll('span')];if(parts[0])parts[0].style.transform=`translate3d(${d*-8}vw,${Math.abs(d)*8}vh,0)`;if(parts[1])parts[1].style.transform=`translate3d(${d*7}vw,${Math.abs(d)*-5}vh,0)`;title.style.opacity=String(clamp(1-Math.abs(d)*1.45,.08,1))}});
 const hero=[...document.querySelectorAll('.x-hero-title span')];if(hero.length){hero[0].style.transform=`translate3d(${idx*-7}vw,${idx*2.5}vh,0)`;hero[1].style.transform=`translate3d(${idx*8}vw,${idx*-2}vh,0)`;document.querySelector('.x-hero-title').style.opacity=String(clamp(1-idx*1.2,0,1))}
 return frac;
}

if(fine){addEventListener('pointermove',e=>{tpx=(e.clientX/innerWidth-.5)*2;tpy=(e.clientY/innerHeight-.5)*2;if(cursor){cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`}});document.querySelectorAll('.x-project-link').forEach((el,i)=>{el.addEventListener('pointerenter',()=>{hoverProject=i+1;cursor?.classList.add('open')});el.addEventListener('pointerleave',()=>{hoverProject=-1;cursor?.classList.remove('open')})});document.querySelectorAll('button,a:not(.x-project-link)').forEach(el=>{el.addEventListener('pointerenter',()=>cursor?.classList.add('open'));el.addEventListener('pointerleave',()=>cursor?.classList.remove('open'))})}

for(const link of document.querySelectorAll('a[href^="/projects/"]')){link.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const x=e.clientX||innerWidth/2,y=e.clientY||innerHeight/2;transition?.style.setProperty('--tx',`${x}px`);transition?.style.setProperty('--ty',`${y}px`);transition?.classList.add('go');setTimeout(()=>{location.href=link.href},520)})}

function animateObjects(idx){
 const local6=clamp(idx-5,0,1);
 groups.forEach((g,i)=>{const focus=clamp(1-Math.abs(idx-i),0,1);const hover=hoverProject===i?1:0;const s=1+focus*.08+hover*.09;g.scale.lerp(new THREE.Vector3(s,s,s),.07)});
 const o=groups[0].userData;o.knot.rotation.x=time*.16;o.knot.rotation.y=time*.24;o.orb.position.y=1.65+Math.sin(time*1.7)*.18;o.rings[0].rotation.z=time*.06;o.rings[1].rotation.y=.45-time*.05;
 const s=groups[1].userData;s.core.rotation.y=-time*.2;s.rings.forEach((r,i)=>{r.rotation.z=time*(i%2?-.12:.1)+i*.35;r.rotation.y+=.0015*(i+1)});
 const m=groups[2].userData;m.city.rotation.y=Math.sin(time*.23)*.08;m.sun.position.y=2.5+Math.sin(time*.7)*.22;
 const n=groups[3].userData;n.phone.rotation.y=-.28+Math.sin(time*.45)*.11;n.pages.forEach((p,i)=>{p.rotation.y=(i-3)*.1+Math.sin(time*.8+i*.36)*.08;p.position.y=(i-3)*.08+Math.sin(time*.7+i)*.06});n.seal.rotation.z=time*.2;
 const a=groups[4].userData;a.ribbon.rotation.y=-.2+time*.11;a.ribbon.rotation.z=.35+Math.sin(time*.4)*.13;a.pearls.rotation.y=-time*.12;a.blush.position.y=-1.25+Math.sin(time*.8)*.14;
 const ag=groups[5].userData;ag.core.rotation.x=time*.13;ag.core.rotation.y=-time*.19;ag.nodes.rotation.y=time*.07;ag.wire.rotation.set(time*.04,time*.06,time*.03);
 const si=groups[6].userData;si.frame.rotation.y=Math.sin(time*.3)*.08;si.panels.forEach((p,i)=>{p.rotation.y=(i%2?1:-1)*local6*.74;p.position.z=Math.sin(local6*Math.PI)*Math.abs(i-2.5)*.12});si.breeze.rotation.z=time*.025;si.breeze.position.x=Math.sin(time*.5)*.35;
 portals.forEach((p,i)=>{p.rotation.z=time*(i%2?.025:-.02)});
 dust.rotation.z=Math.sin(time*.08)*.015;
}

function render(){
 requestAnimationFrame(render);time+=reduce?.002:.008;const idx=sceneFloat();updateDOM(idx);animateObjects(idx);
 const i=Math.floor(idx),j=Math.min(6,i+1),f=idx-i;const eased=f*f*(3-2*f);
 px=mix(px,tpx,.045);py=mix(py,tpy,.045);const yNow=scrollY;velocity=mix(velocity,yNow-lastY,.12);lastY=yNow;
 const objectX=mix(stationX[i],stationX[j],eased),objectY=mix(stationY[i],stationY[j],eased),objectZ=-idx*spacing;
 const baseX=mix(camX[i],camX[j],eased),baseY=mix(camY[i],camY[j],eased);
 camera.position.x=mix(camera.position.x,baseX+(mobile?0:px*.35),.07);camera.position.y=mix(camera.position.y,baseY+(mobile?0:-py*.22),.07);camera.position.z=mix(camera.position.z,objectZ+8.2,.075);
 look.set(objectX+(mobile?0:px*.22),objectY+(mobile?0:-py*.12),objectZ);camera.lookAt(look);camera.rotation.z+=clamp(velocity,-40,40)*.00004;
 const targetFov=(mobile?48:41)+Math.min(10,Math.abs(velocity)*.055);camera.fov=mix(camera.fov,targetFov,.08);camera.updateProjectionMatrix();
 tempColor.copy(bgColors[i]).lerp(bgColors[j],eased);renderer.setClearColor(tempColor,1);scene.fog=new THREE.FogExp2(tempColor,mobile?.035:.028);
 rim.color.copy(tempColor).lerp(new THREE.Color(0xffffff),.52);warm.intensity=45+Math.sin(time*.4)*8;
 renderer.render(scene,camera)
}

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.15:1.7))});
render();
