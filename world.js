import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(pointer:fine)').matches;
const mobile=innerWidth<760;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const canvas=document.querySelector('#am-world');
const cursor=document.querySelector('.museum-cursor');
const transition=document.querySelector('.museum-transition');
const sceneName=document.querySelector('.museum-scene-name');
const sceneCount=document.querySelector('.museum-scene-count');
const scenes=[...document.querySelectorAll('.museum-scene')];

const renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,alpha:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.1:1.55));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=.92;
renderer.setClearColor(0xffffff,0);

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(mobile?46:40,innerWidth/innerHeight,.05,80);
camera.position.set(0,.1,10.8);
scene.add(new THREE.HemisphereLight(0xffffff,0xc9c0af,3.5));
const key=new THREE.DirectionalLight(0xffffff,5.5);key.position.set(-5,8,7);scene.add(key);
const fill=new THREE.DirectionalLight(0xdce8ff,3.2);fill.position.set(6,1,5);scene.add(fill);
const warm=new THREE.PointLight(0xffd6a8,24,22,2);warm.position.set(-5,-3,4);scene.add(warm);

const chrome=new THREE.MeshPhysicalMaterial({color:0xa8aaad,metalness:.92,roughness:.18,clearcoat:1,clearcoatRoughness:.06});
const pearl=new THREE.MeshPhysicalMaterial({color:0xf7f4ec,metalness:.16,roughness:.22,clearcoat:1,clearcoatRoughness:.08});
const accentMat=new THREE.MeshPhysicalMaterial({color:0x3157ff,metalness:.32,roughness:.16,clearcoat:1,clearcoatRoughness:.06});
const darkMat=new THREE.MeshPhysicalMaterial({color:0x1b1b19,metalness:.72,roughness:.2,clearcoat:.9});
const glass=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.08,metalness:.02,transmission:.86,thickness:.7,transparent:true,opacity:.62,ior:1.25});

const sculpture=new THREE.Group();scene.add(sculpture);
const tiles=[];
const tileCount=mobile?22:30;
for(let i=0;i<tileCount;i++){
  const mat=i%7===0?accentMat:(i%5===0?pearl:(i%11===0?darkMat:chrome));
  const tile=new THREE.Mesh(new THREE.BoxGeometry(.54,1.28,.16),mat);
  sculpture.add(tile);tiles.push(tile);
}
const core=new THREE.Mesh(new THREE.SphereGeometry(1.02,48,28),glass);sculpture.add(core);
const halo=new THREE.Mesh(new THREE.TorusGeometry(2.15,.022,10,140),accentMat);halo.rotation.x=Math.PI/2;sculpture.add(halo);
const halo2=new THREE.Mesh(new THREE.TorusGeometry(2.7,.012,8,140),chrome);halo2.rotation.set(Math.PI/2,.42,.15);sculpture.add(halo2);

const dustCount=mobile?100:220;
const dustArray=new Float32Array(dustCount*3);
for(let i=0;i<dustCount;i++){dustArray[i*3]=mix(-8,8,Math.random());dustArray[i*3+1]=mix(-5,5,Math.random());dustArray[i*3+2]=mix(-6,3,Math.random())}
const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(dustArray,3));
const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0x383630,size:.018,transparent:true,opacity:.13,sizeAttenuation:true}));scene.add(dust);

const accents=['#3157ff','#3157ff','#9a7048','#e24b38','#a95872','#16845e','#26705d'];
const tints=['#e8ebff','#e7ebff','#efe5d7','#fde7e1','#f6e0e7','#e3f2e9','#e2f3ec'];
const names=['INDEX','SPRACHPREP','MAMELAT','NEWAPP','AUREL','AEGIS','SINEKLIK'];
const objectX=[2.7,2.65,-2.7,2.65,-2.65,2.65,-2.65];
const accentColors=accents.map(c=>new THREE.Color(c));
const tempAccent=new THREE.Color();

function config(sceneIndex,i){
  const n=tileCount;
  const t=i/Math.max(1,n-1);
  let x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1;
  if(sceneIndex===0){
    const a=t*Math.PI*5.2;const r=1.25+t*1.35;x=Math.cos(a)*r;y=(t-.5)*4.4;z=Math.sin(a)*r*.62;ry=-a+.4;rz=Math.sin(a)*.45;sx=.72;sy=.62+Math.sin(t*Math.PI)*.7;
  }else if(sceneIndex===1){
    const ring=i%4;const slot=Math.floor(i/4);const slots=Math.ceil(n/4);const a=slot/slots*Math.PI*2+ring*.42;const r=1.42+ring*.48;x=Math.cos(a)*r;y=Math.sin(a)*r*.58;z=Math.sin(a+.8)*.72;rz=a+Math.PI/2;ry=.4+ring*.18;sx=.5;sy=.48+ring*.08;
  }else if(sceneIndex===2){
    const cols=6;const col=i%cols;const row=Math.floor(i/cols);const h=.65+((i*7)%13)/13*2.7;x=(col-(cols-1)/2)*.58;z=(row-2)*.5-.45;y=-1.7+h*.62;ry=(col-2.5)*.025;sx=.72;sy=h;sz=.78;
  }else if(sceneIndex===3){
    const d=i-(n-1)/2;x=d*.22;y=Math.sin(d*.24)*.32;z=-Math.abs(d)*.035;rz=d*.035;ry=-.22+d*.016;sx=.82;sy=1.8;sz=.55;
  }else if(sceneIndex===4){
    const d=i-(n-1)/2;x=d*.23;y=Math.sin(i*.58)*1.18;z=Math.cos(i*.42)*.78;rz=Math.cos(i*.35)*.5;ry=Math.sin(i*.31)*.65;sx=.52;sy=.52+((i%5)/5)*.7;
  }else if(sceneIndex===5){
    const ga=2.3999632297;const a=i*ga;const yy=1-(i/(n-1))*2;const rr=Math.sqrt(Math.max(0,1-yy*yy));const rad=2.65;x=Math.cos(a)*rr*rad;y=yy*rad;z=Math.sin(a)*rr*rad*.72;rx=a*.22;ry=a;sx=.42;sy=.42;sz=.62;
  }else{
    const cols=6;const col=i%cols;const row=Math.floor(i/cols);x=(col-2.5)*.62;y=(2-row)*.64;z=((col+row)%2)*.18-.3;ry=((col+row)%2?1:-1)*.08;sx=.9;sy=.44;sz=.5;
  }
  return {x,y,z,rx,ry,rz,sx,sy,sz};
}

function sceneFloat(){return clamp(scrollY/Math.max(1,innerHeight),0,6)}
let px=0,py=0,tpx=0,tpy=0,lastY=scrollY,velocity=0,time=0,hover=false;
if(fine){
  addEventListener('pointermove',e=>{tpx=(e.clientX/innerWidth-.5)*2;tpy=(e.clientY/innerHeight-.5)*2;if(cursor){cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`}});
  document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>cursor?.classList.add('open'));el.addEventListener('pointerleave',()=>cursor?.classList.remove('open'))});
  document.querySelectorAll('.museum-project').forEach(el=>{el.addEventListener('pointerenter',()=>hover=true);el.addEventListener('pointerleave',()=>hover=false)});
}
for(const link of document.querySelectorAll('a[href^="/projects/"]')){
  link.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const x=e.clientX||innerWidth/2,y=e.clientY||innerHeight/2;const accent=getComputedStyle(link.closest('.museum-scene')).getPropertyValue('--accent').trim()||'#111';transition.style.background=accent;transition.style.setProperty('--tx',`${x}px`);transition.style.setProperty('--ty',`${y}px`);transition.classList.add('go');setTimeout(()=>location.href=link.href,500)});
}

function updateDOM(idx){
  const whole=Math.round(idx);
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  document.documentElement.style.setProperty('--progress',`${clamp(scrollY/max)*100}%`);
  if(sceneName)sceneName.textContent=names[whole]||'INDEX';
  if(sceneCount)sceneCount.textContent=`0${whole} / 06`;
  document.documentElement.style.setProperty('--wash-color',tints[whole]||tints[0]);
  document.documentElement.style.setProperty('--wash-x',objectX[whole]>0?'76%':'24%');
  scenes.forEach((el,i)=>{
    const d=idx-i;const title=el.querySelector('h2');
    if(title){title.style.transform=`translate3d(0,${clamp(d,-1,1)*18}px,0)`;title.style.opacity=String(clamp(1-Math.abs(d)*.55,.34,1))}
  });
  const hero=[...document.querySelectorAll('.hero-frame h1 span')];
  if(hero.length){hero[0].style.transform=`translate3d(${idx*-2.1}vw,0,0)`;hero[1].style.transform=`translate3d(${idx*2.4}vw,0,0)`}
}

function render(){
  requestAnimationFrame(render);time+=reduce?.0015:.0075;
  const idx=sceneFloat();updateDOM(idx);
  const a=Math.floor(idx),b=Math.min(6,a+1),f=smooth(idx-a);
  px=mix(px,tpx,.04);py=mix(py,tpy,.04);
  const yNow=scrollY;velocity=mix(velocity,yNow-lastY,.1);lastY=yNow;
  tiles.forEach((tile,i)=>{
    const A=config(a,i),B=config(b,i);
    tile.position.x=mix(tile.position.x,mix(A.x,B.x,f),.1);
    tile.position.y=mix(tile.position.y,mix(A.y,B.y,f),.1);
    tile.position.z=mix(tile.position.z,mix(A.z,B.z,f),.1);
    tile.rotation.x=mix(tile.rotation.x,mix(A.rx,B.rx,f),.09);
    tile.rotation.y=mix(tile.rotation.y,mix(A.ry,B.ry,f),.09);
    tile.rotation.z=mix(tile.rotation.z,mix(A.rz,B.rz,f),.09);
    tile.scale.x=mix(tile.scale.x,mix(A.sx,B.sx,f),.1);
    tile.scale.y=mix(tile.scale.y,mix(A.sy,B.sy,f),.1);
    tile.scale.z=mix(tile.scale.z,mix(A.sz,B.sz,f),.1);
  });
  tempAccent.copy(accentColors[a]).lerp(accentColors[b],f);accentMat.color.copy(tempAccent);
  const targetX=mix(objectX[a],objectX[b],f)*(mobile?.23:1);
  sculpture.position.x=mix(sculpture.position.x,targetX,.07);
  sculpture.position.y=mix(sculpture.position.y,mobile?.65:0,.06);
  sculpture.rotation.x=mix(sculpture.rotation.x,(mobile?0:py*.08)+Math.sin(time*.42)*.035,.05);
  sculpture.rotation.y=mix(sculpture.rotation.y,(mobile?0:px*.11)+Math.sin(time*.27)*.06,.05);
  sculpture.rotation.z=mix(sculpture.rotation.z,clamp(velocity,-30,30)*.0008,.05);
  const scale=(mobile?.72:1)*(hover?1.035:1);sculpture.scale.lerp(new THREE.Vector3(scale,scale,scale),.06);
  core.rotation.y=time*.16;core.rotation.x=-time*.09;halo.rotation.z=time*.1;halo2.rotation.z=-time*.055;halo2.rotation.y=.42+Math.sin(time*.35)*.08;
  halo.scale.setScalar(1+Math.sin(time*.8)*.025);dust.rotation.y=time*.012;
  camera.position.x=mix(camera.position.x,mobile?0:px*.12,.04);camera.position.y=mix(camera.position.y,mobile?.2:-py*.09,.04);
  camera.fov=mix(camera.fov,(mobile?46:40)+Math.min(3,Math.abs(velocity)*.025),.06);camera.updateProjectionMatrix();camera.lookAt(0,0,0);
  renderer.render(scene,camera);
}

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.1:1.55))});
render();
