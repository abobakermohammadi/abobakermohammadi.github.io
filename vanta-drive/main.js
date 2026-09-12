import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const canvas = document.querySelector('#scene');
const boot = document.querySelector('#boot');
const railFill = document.querySelector('#railFill');
const railIndex = document.querySelector('#railIndex');
const speedValue = document.querySelector('#speedValue');
const powerValue = document.querySelector('#powerValue');
const speedHeading = document.querySelector('#speedHeading');
const speedLines = document.querySelector('#speedLines');
const paintBtn = document.querySelector('#paintBtn');
const chapters = [...document.querySelectorAll('.chapter')];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a, b, t) => a + (b - a) * t;
const inverseLerp = (a, b, v) => clamp((v - a) / (b - a));
const ease = t => t * t * (3 - 2 * t);
const easeInOutCubic = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050507);
scene.fog = new THREE.FogExp2(0x050507, 0.032);

const camera = new THREE.PerspectiveCamera(39, innerWidth / innerHeight, 0.05, 180);
camera.position.set(6, 2.8, 7);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.65));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.04;
renderer.shadowMap.enabled = innerWidth > 700;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), innerWidth < 700 ? .6 : .9, .62, .83);
composer.addPass(bloom);

const world = new THREE.Group();
scene.add(world);

const hemi = new THREE.HemisphereLight(0xbfd7ff, 0x220b05, 1.45);
scene.add(hemi);

const key = new THREE.SpotLight(0xffffff, 120, 35, Math.PI * .23, .42, 1.1);
key.position.set(-5, 8, 5);
key.target.position.set(0, 0, 0);
key.castShadow = true;
key.shadow.mapSize.set(1024,1024);
scene.add(key, key.target);

const rim = new THREE.SpotLight(0xff3b14, 145, 32, Math.PI * .2, .5, 1.4);
rim.position.set(7, 4, 1);
rim.target.position.set(0, .5, 0);
scene.add(rim, rim.target);

const cool = new THREE.PointLight(0x70eaff, 42, 18, 2);
cool.position.set(-5, 1.5, -4);
scene.add(cool);

const paintMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x120e10,
  metalness: .82,
  roughness: .19,
  clearcoat: 1,
  clearcoatRoughness: .055,
  envMapIntensity: 1.4
});
const carbon = new THREE.MeshStandardMaterial({ color: 0x09090c, metalness: .6, roughness: .34 });
const darkMetal = new THREE.MeshStandardMaterial({ color: 0x202027, metalness: .92, roughness: .22 });
const tireMat = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: .82, metalness: .05 });
const seatMat = new THREE.MeshStandardMaterial({ color: 0x17171b, roughness: .55, metalness: .15 });
const glass = new THREE.MeshPhysicalMaterial({
  color: 0x9ec7d9,
  transparent: true,
  opacity: .16,
  metalness: .05,
  roughness: .05,
  transmission: .82,
  thickness: .16,
  clearcoat: 1,
  side: THREE.FrontSide
});
const headlightMat = new THREE.MeshStandardMaterial({ color: 0xdffeff, emissive: 0xbaffff, emissiveIntensity: 9, toneMapped: false });
const tailMat = new THREE.MeshStandardMaterial({ color: 0xff2600, emissive: 0xff1800, emissiveIntensity: 8, toneMapped: false });
const neonBlue = new THREE.MeshBasicMaterial({ color: 0x9ffcff, toneMapped: false });
const neonRed = new THREE.MeshBasicMaterial({ color: 0xff3518, toneMapped: false });

function rounded(w,h,d,r=.12, mat=paintMaterial) {
  return new THREE.Mesh(new RoundedBoxGeometry(w,h,d,6,r), mat);
}

function makeCar() {
  const car = new THREE.Group();
  car.position.y = .1;

  const shell = new THREE.Group();
  car.add(shell);

  const belly = rounded(3.0, .52, 4.95, .24);
  belly.position.y = .18;
  belly.scale.x = .96;
  shell.add(belly);

  const shoulder = rounded(2.72, .48, 4.18, .2);
  shoulder.position.set(0, .48, -.05);
  shell.add(shoulder);

  const nose = rounded(2.55, .34, 1.72, .22);
  nose.position.set(0, .54, -2.25);
  nose.rotation.x = -.035;
  shell.add(nose);

  const rear = rounded(2.74, .48, 1.28, .22);
  rear.position.set(0, .53, 2.12);
  shell.add(rear);

  const splitter = rounded(2.96, .08, 1.12, .05, carbon);
  splitter.position.set(0, -.06, -2.42);
  shell.add(splitter);

  const diffuser = rounded(2.75, .12, .86, .04, carbon);
  diffuser.position.set(0, .0, 2.48);
  diffuser.rotation.x = -.09;
  shell.add(diffuser);

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 30), glass);
  canopy.scale.set(1.16, .58, 1.52);
  canopy.position.set(0, 1.02, .05);
  canopy.renderOrder = 3;
  shell.add(canopy);

  const roofSpine = rounded(.15, .11, 2.28, .04, carbon);
  roofSpine.position.set(0, 1.48, .08);
  shell.add(roofSpine);

  const sillL = rounded(.20, .22, 2.45, .05, carbon);
  const sillR = sillL.clone();
  sillL.position.set(-1.48, .18, .05);
  sillR.position.set(1.48, .18, .05);
  shell.add(sillL, sillR);

  const lights = [];
  for (const x of [-.82, .82]) {
    const light = rounded(.68, .065, .08, .025, headlightMat);
    light.position.set(x, .60, -3.07);
    light.rotation.z = x < 0 ? -.07 : .07;
    shell.add(light);
    lights.push(light);
  }
  for (const x of [-.78, .78]) {
    const light = rounded(.86, .06, .075, .025, tailMat);
    light.position.set(x, .66, 2.78);
    shell.add(light);
  }

  const leftDoor = new THREE.Group();
  const rightDoor = new THREE.Group();
  leftDoor.position.set(-1.2, .78, -.05);
  rightDoor.position.set(1.2, .78, -.05);
  const doorGeo = new RoundedBoxGeometry(.97, .15, 2.22, 6, .09);
  const ld = new THREE.Mesh(doorGeo, paintMaterial);
  const rd = new THREE.Mesh(doorGeo, paintMaterial);
  ld.position.x = -.48;
  rd.position.x = .48;
  ld.rotation.z = .02;
  rd.rotation.z = -.02;
  leftDoor.add(ld);
  rightDoor.add(rd);
  car.add(leftDoor, rightDoor);

  const hood = new THREE.Group();
  hood.position.set(0, .73, -1.45);
  const hoodPanel = rounded(2.25, .11, 1.55, .11);
  hoodPanel.position.z = -.78;
  hood.add(hoodPanel);
  car.add(hood);

  const trunk = new THREE.Group();
  trunk.position.set(0, .75, 1.62);
  const trunkPanel = rounded(2.12, .12, 1.05, .1);
  trunkPanel.position.z = .54;
  trunk.add(trunkPanel);
  car.add(trunk);

  const cockpit = new THREE.Group();
  cockpit.position.y = .38;
  car.add(cockpit);

  for (const x of [-.48, .48]) {
    const base = rounded(.62, .22, .86, .13, seatMat);
    base.position.set(x, .38, .38);
    base.rotation.x = -.08;
    const back = rounded(.62, .95, .18, .12, seatMat);
    back.position.set(x, .88, .72);
    back.rotation.x = -.18;
    cockpit.add(base, back);
  }

  const dash = rounded(2.14, .22, .38, .08, carbon);
  dash.position.set(0, .74, -.7);
  cockpit.add(dash);

  const screenMat = new THREE.MeshBasicMaterial({ color: 0x0b1517, toneMapped: false });
  const screen = rounded(.84, .31, .025, .035, screenMat);
  screen.position.set(0, .91, -.91);
  cockpit.add(screen);

  const uiBars = new THREE.Group();
  for (let i=0; i<9; i++) {
    const bar = rounded(.045, mix(.06,.23,Math.random()), .012, .008, i % 3 === 0 ? neonRed : neonBlue);
    bar.position.set(-.3 + i*.075, .91, -.93);
    uiBars.add(bar);
  }
  cockpit.add(uiBars);

  const wheel = new THREE.Mesh(new THREE.TorusGeometry(.28, .045, 12, 44), darkMetal);
  wheel.position.set(-.58, .77, -.79);
  wheel.rotation.x = Math.PI / 2;
  wheel.rotation.z = -.08;
  cockpit.add(wheel);

  const spoke = rounded(.48, .045, .045, .018, darkMetal);
  spoke.position.copy(wheel.position);
  spoke.rotation.z = -.08;
  cockpit.add(spoke);

  const wheels = [];
  const wheelPositions = [
    [-1.47, -.19, -1.83], [1.47, -.19, -1.83],
    [-1.47, -.19, 1.72], [1.47, -.19, 1.72]
  ];
  for (const [x,y,z] of wheelPositions) {
    const spin = new THREE.Group();
    spin.position.set(x,y,z);
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(.59,.59,.34,40,1,true), tireMat);
    tire.rotation.z = Math.PI / 2;
    const side1 = new THREE.Mesh(new THREE.TorusGeometry(.48,.11,14,40), tireMat);
    side1.rotation.y = Math.PI / 2;
    side1.position.x = x < 0 ? -.175 : .175;
    const rimMesh = new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.37,12), darkMetal);
    rimMesh.rotation.z = Math.PI / 2;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.4,24), neonRed);
    hub.rotation.z = Math.PI / 2;
    spin.add(tire, side1, rimMesh, hub);
    car.add(spin);
    wheels.push(spin);
  }

  const wing = new THREE.Group();
  wing.position.set(0, .82, 2.18);
  const wingBlade = rounded(2.25, .1, .38, .04, carbon);
  const wingStemL = rounded(.08, .55, .08, .025, darkMetal);
  const wingStemR = wingStemL.clone();
  wingStemL.position.set(-.75, -.24, .02);
  wingStemR.position.set(.75, -.24, .02);
  wing.add(wingBlade, wingStemL, wingStemR);
  wing.position.y -= .36;
  car.add(wing);

  const underGlow = new THREE.PointLight(0xff3518, 0, 8, 2);
  underGlow.position.set(0,-.25,.25);
  car.add(underGlow);

  shell.traverse(o => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });

  return { car, shell, leftDoor, rightDoor, hood, trunk, wheels, wing, underGlow, uiBars };
}

const CAR = makeCar();
world.add(CAR.car);

function makeStudio() {
  const studio = new THREE.Group();
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x070709, roughness: .34, metalness: .64 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(18, 96), floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.y = -.54;
  floor.receiveShadow = true;
  studio.add(floor);

  for (let i=0; i<8; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2 + i*1.55, .008, 4, 128), new THREE.MeshBasicMaterial({color: i%2 ? 0x17171d : 0x23232a}));
    ring.rotation.x = Math.PI/2;
    ring.position.y = -.525;
    studio.add(ring);
  }

  for (const x of [-7,-4.5,4.5,7]) {
    const bar = rounded(.08, 7, .08, .02, x < 0 ? neonBlue : neonRed);
    bar.position.set(x, 2.5, -1.5 + Math.random()*3);
    bar.material = bar.material.clone();
    bar.material.transparent = true;
    bar.material.opacity = .34;
    studio.add(bar);
  }

  const halo = new THREE.Mesh(new THREE.TorusGeometry(5.8,.025,8,180), neonRed);
  halo.position.set(0,2,-4.5);
  halo.rotation.x = .18;
  studio.add(halo);

  return studio;
}
const studio = makeStudio();
world.add(studio);

function makeTunnel() {
  const tunnel = new THREE.Group();
  tunnel.visible = false;

  const roadMat = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: .72, metalness: .22 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(11, 170), roadMat);
  road.rotation.x = -Math.PI/2;
  road.position.set(0,-.52,-70);
  tunnel.add(road);

  for (const x of [-2.1, 2.1]) {
    const lane = new THREE.Mesh(new THREE.PlaneGeometry(.035,160), new THREE.MeshBasicMaterial({color:0x394147, transparent:true, opacity:.75}));
    lane.rotation.x = -Math.PI/2;
    lane.position.set(x,-.505,-70);
    tunnel.add(lane);
  }

  const centerStrips = [];
  for (let i=0; i<36; i++) {
    const dash = rounded(.045,.012,1.5,.006, neonBlue);
    dash.position.set(0,-.49,-3-i*4.6);
    dash.material = dash.material.clone();
    dash.material.transparent = true;
    dash.material.opacity = .62;
    tunnel.add(dash);
    centerStrips.push(dash);
  }

  const gates = [];
  for (let i=0; i<27; i++) {
    const gate = new THREE.Group();
    const mat = i % 4 === 0 ? neonRed : neonBlue;
    const left = rounded(.055,5.6,.055,.016,mat);
    const right = left.clone();
    const top = rounded(9.4,.055,.055,.016,mat);
    left.position.set(-4.7,2.15,0);
    right.position.set(4.7,2.15,0);
    top.position.set(0,4.95,0);
    gate.add(left,right,top);
    gate.position.z = -8 - i*6.4;
    gate.userData.baseZ = gate.position.z;
    gate.traverse(o => {
      if (o.isMesh) {
        o.material = o.material.clone();
        o.material.transparent = true;
        o.material.opacity = i % 4 === 0 ? .65 : .26;
      }
    });
    tunnel.add(gate);
    gates.push(gate);
  }

  const pylons = [];
  for (let i=0; i<45; i++) {
    for (const side of [-1,1]) {
      const pylon = rounded(.7, mix(1.3,7,Math.random()), .7, .08, carbon);
      pylon.position.set(side * mix(6.5,11,Math.random()), pylon.geometry.parameters?.height ? 1 : mix(.5,3,Math.random()), -5-i*4.2 + Math.random()*2);
      pylon.scale.y = mix(.6,2.4,Math.random());
      pylon.userData.baseZ = pylon.position.z;
      tunnel.add(pylon);
      pylons.push(pylon);
    }
  }

  return { tunnel, gates, centerStrips, pylons };
}
const TUNNEL = makeTunnel();
world.add(TUNNEL.tunnel);

function makeParticles() {
  const count = innerWidth < 700 ? 260 : 520;
  const positions = new Float32Array(count * 3);
  for (let i=0; i<count; i++) {
    positions[i*3] = (Math.random()-.5)*26;
    positions[i*3+1] = Math.random()*9 - 1;
    positions[i*3+2] = -Math.random()*100 + 14;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const mat = new THREE.PointsMaterial({ color:0xffffff, size:.035, transparent:true, opacity:.23, sizeAttenuation:true });
  const pts = new THREE.Points(geo,mat);
  scene.add(pts);
  return pts;
}
const particles = makeParticles();

const paintSchemes = [
  { body:0x120e10, accent:'#ff3b14', rim:0xff3518 },
  { body:0x0c1b24, accent:'#83efff', rim:0x83efff },
  { body:0x4a0707, accent:'#ffbd6d', rim:0xffbd6d },
  { body:0xd9d6cf, accent:'#ff3518', rim:0xff3518 }
];
let paintIndex = 0;
paintBtn.addEventListener('click', () => {
  paintIndex = (paintIndex + 1) % paintSchemes.length;
  const p = paintSchemes[paintIndex];
  paintMaterial.color.setHex(p.body);
  document.documentElement.style.setProperty('--accent', p.accent);
  rim.color.set(p.accent);
});

const pointer = new THREE.Vector2();
const pointerSmooth = new THREE.Vector2();
window.addEventListener('pointermove', e => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / innerHeight) * 2 + 1;
}, {passive:true});

let targetProgress = 0;
let progress = 0;
let scrollVelocity = 0;
let lastTarget = 0;

function readScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  targetProgress = max > 0 ? clamp(scrollY / max) : 0;
}
window.addEventListener('scroll', readScroll, {passive:true});
readScroll();

function setCamera(pos, target, pointerStrength=0) {
  camera.position.set(
    pos[0] + pointerSmooth.x * pointerStrength,
    pos[1] + pointerSmooth.y * pointerStrength * .35,
    pos[2]
  );
  camera.lookAt(target[0], target[1], target[2]);
}

function introCamera(p) {
  const t = ease(inverseLerp(0,.18,p));
  const angle = mix(.65, 4.25, t);
  const radius = mix(7.8,6.4,t);
  const pos = [Math.sin(angle)*radius, mix(2.75,1.7,t), Math.cos(angle)*radius];
  setCamera(pos,[0,.45,0],.26);
}

function accessCamera(p) {
  const t = ease(inverseLerp(.18,.39,p));
  const a = [-5.72,1.78,-1.15];
  const b = [-4.15,1.36,-1.75];
  setCamera([mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)],[0,.58,-.1],.14);
}

function cockpitCamera(p) {
  const t = easeInOutCubic(inverseLerp(.39,.63,p));
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.15,1.36,-1.75),
    new THREE.Vector3(-2.1,1.38,-2.75),
    new THREE.Vector3(0,1.32,-3.35),
    new THREE.Vector3(0,1.08,-1.0),
    new THREE.Vector3(0,1.02,.18)
  ], false, 'catmullrom', .42);
  const pos = curve.getPoint(t);
  const targetOutside = new THREE.Vector3(0,.78,-.1);
  const targetInside = new THREE.Vector3(0,.82,-8);
  const lookT = ease(inverseLerp(.52,.63,p));
  const target = targetOutside.clone().lerp(targetInside,lookT);
  camera.position.copy(pos);
  camera.position.x += pointerSmooth.x * .04 * t;
  camera.position.y += pointerSmooth.y * .03 * t;
  camera.lookAt(target);
}

function driveCamera(p) {
  const t = ease(inverseLerp(.63,.84,p));
  const shake = Math.sin(performance.now()*.018) * .004 * t;
  camera.position.set(pointerSmooth.x*.055, 1.01 + pointerSmooth.y*.025 + shake, .18 + t*.06);
  camera.lookAt(pointerSmooth.x*.24, .82 + pointerSmooth.y*.05, -12);
}

function finaleCamera(p) {
  const t = easeInOutCubic(inverseLerp(.84,1,p));
  const angle = mix(Math.PI, Math.PI*1.68, t);
  const r = mix(4.8,8.6,t);
  const carZ = CAR.car.position.z;
  const pos = [Math.sin(angle)*r, mix(1.1,3.6,t), carZ + Math.cos(angle)*r + 3.0];
  setCamera(pos,[0,.35,carZ-2.5],.12);
}

function updateCar(p, dt) {
  const open = ease(inverseLerp(.19,.32,p)) * (1 - ease(inverseLerp(.43,.53,p)));
  CAR.leftDoor.rotation.z = -1.22 * open;
  CAR.rightDoor.rotation.z = 1.22 * open;
  CAR.leftDoor.rotation.y = .08 * open;
  CAR.rightDoor.rotation.y = -.08 * open;
  CAR.hood.rotation.x = -.72 * open;
  CAR.trunk.rotation.x = .62 * open;

  const drive = ease(inverseLerp(.61,.86,p));
  const launch = easeInOutCubic(inverseLerp(.84,1,p));
  const speed = Math.round(342 * drive * (1 - launch*.08));
  const power = Math.round(880 * Math.pow(drive,.72));
  speedValue.textContent = String(speed).padStart(3,'0');
  powerValue.textContent = String(power);
  speedHeading.innerHTML = `${speed}<br><em>KM/H</em>`;

  for (const wheel of CAR.wheels) wheel.rotation.x -= dt * (1.4 + drive*18);
  CAR.wing.position.y = .46 + ease(inverseLerp(.57,.71,p))*.36;
  CAR.wing.rotation.x = -.18 * ease(inverseLerp(.61,.72,p));
  CAR.underGlow.intensity = drive * 24;

  CAR.car.position.z = -launch * 13.5;
  CAR.car.position.y = .1 + Math.sin(performance.now()*.007)*.012*drive;
  CAR.car.rotation.y = launch * -.13;
  CAR.car.rotation.x = launch * -.025;

  CAR.uiBars.children.forEach((bar,i) => {
    const pulse = .6 + Math.sin(performance.now()*.006+i*.8)*.4;
    bar.scale.y = .55 + pulse * (.45 + drive*.35);
  });

  const studioFade = 1 - ease(inverseLerp(.52,.66,p));
  studio.visible = studioFade > .01;
  studio.traverse(o => {
    if (o.material && o.material.transparent) o.material.opacity *= 1;
  });

  TUNNEL.tunnel.visible = p > .52;
  const tunnelAlpha = ease(inverseLerp(.54,.65,p));
  if (TUNNEL.tunnel.visible) {
    TUNNEL.tunnel.scale.setScalar(.96 + tunnelAlpha*.04);
    const travel = drive * 115 + launch*45;
    for (const gate of TUNNEL.gates) {
      let z = gate.userData.baseZ + (travel % 172);
      if (z > 8) z -= 172;
      gate.position.z = z;
    }
    TUNNEL.centerStrips.forEach((dash,i) => {
      let z = -3 - i*4.6 + (travel % 165);
      if (z > 5) z -= 165;
      dash.position.z = z;
    });
    TUNNEL.pylons.forEach(pylon => {
      let z = pylon.userData.baseZ + (travel % 188);
      if (z > 8) z -= 188;
      pylon.position.z = z;
    });
  }

  const pos = particles.geometry.attributes.position.array;
  const particleSpeed = dt * (1 + drive*48);
  for (let i=0; i<pos.length/3; i++) {
    pos[i*3+2] += particleSpeed;
    if (pos[i*3+2] > 16) pos[i*3+2] = -100 - Math.random()*20;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  particles.material.opacity = mix(.16,.58,drive);
  particles.material.size = mix(.025,.07,drive);

  speedLines.style.opacity = String(clamp((drive-.2)*1.2));
  speedLines.style.transform = `scaleX(${mix(1.4,2.4,drive)}) translateX(${Math.sin(performance.now()*.006)*drive*1.2}px)`;

  key.intensity = mix(120,48,drive);
  cool.intensity = mix(42,75,drive);
  bloom.strength = mix(.78,1.12,drive);
}

function updateStory(p) {
  const idx = p < .17 ? 0 : p < .39 ? 1 : p < .61 ? 2 : p < .83 ? 3 : 4;
  chapters.forEach((el,i) => {
    const start = Number(el.dataset.start);
    const end = Number(el.dataset.end);
    const inside = p >= start && p <= end;
    el.classList.toggle('active',inside);
    if (inside) {
      const local = inverseLerp(start,end,p);
      const fadeIn = clamp(local/.14);
      const fadeOut = clamp((1-local)/.14);
      const op = Math.min(fadeIn,fadeOut,1);
      el.style.opacity = String(op);
      const y = mix(20,-10,ease(local));
      el.style.transform = `translate3d(0,${y}px,0)`;
    } else {
      el.style.opacity = '0';
    }
  });
  railFill.style.height = `${p*100}%`;
  railIndex.textContent = String(idx+1).padStart(2,'0');
}

let then = performance.now();
function tick(now) {
  const dt = Math.min(.033,(now-then)/1000 || .016);
  then = now;

  const diff = targetProgress - progress;
  scrollVelocity = THREE.MathUtils.lerp(scrollVelocity, (targetProgress-lastTarget)/Math.max(dt,.001), .08);
  lastTarget = targetProgress;
  progress += diff * (1 - Math.pow(.0008,dt));
  progress = clamp(progress);

  pointerSmooth.lerp(pointer,.055);

  updateCar(progress,dt);
  updateStory(progress);

  if (progress < .18) introCamera(progress);
  else if (progress < .39) accessCamera(progress);
  else if (progress < .63) cockpitCamera(progress);
  else if (progress < .84) driveCamera(progress);
  else finaleCamera(progress);

  composer.render();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.2 : 1.65));
  composer.setSize(innerWidth,innerHeight);
}
window.addEventListener('resize',resize,{passive:true});

setTimeout(() => boot.classList.add('done'), 1850);
setTimeout(() => boot.remove(), 2850);

window.addEventListener('keydown',e => {
  if (e.key.toLowerCase() === 'r') scrollTo({top:0,behavior:'smooth'});
  if (e.key.toLowerCase() === 'c') paintBtn.click();
});
