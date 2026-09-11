import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const modernRoutes = [
  'index.html',
  'projects/sprachprep/index.html',
  'projects/mamelat/index.html',
  'projects/newapp/index.html',
  'projects/aegis/index.html',
  'projects/sineklik/index.html',
  'projects/aurel/index.html',
  'ledger/index.html',
  'contact/index.html'
];
const required = [
  ...modernRoutes,
  '404.html',
  'styles.css',
  'proof.css',
  'app.js',
  'favicon.svg',
  'assets/mamelat-mark.svg',
  'assets/aegis-mark.svg',
  'data/projects.json',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'card/index.html',
  'abobaker/index.html'
];
const authoredText = required.filter(file => /\.(?:html|css|js|json|xml|txt|webmanifest|svg)$/.test(file));
const errors = [];

const exists = file => fs.existsSync(path.join(root, file));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

for (const file of required) {
  if (!exists(file)) errors.push(`Missing required file: ${file}`);
}

for (const file of authoredText.filter(exists)) {
  const text = read(file);
  for (const marker of ['TODO', 'FIXME', 'Lorem', 'placeholder', 'dummy', 'stub']) {
    if (text.includes(marker)) errors.push(`${file}: contains dirty marker "${marker}"`);
  }
  if (/[\w.+-]+@(gmail|outlook|yahoo)\.[a-z]{2,}/i.test(text)) {
    errors.push(`${file}: contains a consumer email address; use an explicitly public contact channel instead`);
  }
}

for (const file of modernRoutes.filter(exists)) {
  const html = read(file);
  if (!/<link\s+rel="canonical"\s+href="https:\/\/abobakermohammadi\.github\.io\//.test(html)) {
    errors.push(`${file}: missing canonical URL`);
  }
}

function localTarget(raw) {
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return 'index.html';
  const relative = clean.replace(/^\//, '');
  if (clean.endsWith('/')) return path.join(relative, 'index.html');
  return relative;
}

for (const file of [...modernRoutes, '404.html', 'card/index.html', 'abobaker/index.html'].filter(exists)) {
  const html = read(file);
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"']*)"/g)].map(match => match[1]);
  for (const ref of refs) {
    const target = localTarget(ref);
    if (!exists(target)) errors.push(`${file}: local reference ${ref} resolves to missing ${target}`);
  }
}

try {
  const manifest = JSON.parse(read('data/projects.json'));
  if (!Array.isArray(manifest.projects) || manifest.projects.length < 6) errors.push('data/projects.json: expected at least six verified project records');
  const featured = manifest.projects.filter(project => project.featured);
  if (featured.length !== 6) errors.push(`data/projects.json: expected exactly six featured projects, found ${featured.length}`);
  const ids = new Set();
  for (const project of manifest.projects) {
    if (!project.id || ids.has(project.id)) errors.push(`data/projects.json: missing or duplicate id ${project.id || '<empty>'}`);
    ids.add(project.id);
    if (project.featured && !project.caseStudy) errors.push(`data/projects.json: featured project ${project.id} has no caseStudy`);
  }
} catch (error) {
  errors.push(`data/projects.json: invalid JSON (${error.message})`);
}

try {
  JSON.parse(read('manifest.webmanifest'));
} catch (error) {
  errors.push(`manifest.webmanifest: invalid JSON (${error.message})`);
}

const sitemap = exists('sitemap.xml') ? read('sitemap.xml') : '';
for (const file of modernRoutes) {
  const route = file === 'index.html' ? '/' : `/${file.replace(/index\.html$/, '')}`;
  const url = `https://abobakermohammadi.github.io${route}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`sitemap.xml: missing ${url}`);
}

for (const legacy of ['card/index.html', 'abobaker/index.html']) {
  if (!exists(legacy)) continue;
  const html = read(legacy);
  if (!html.includes('noindex,follow')) errors.push(`${legacy}: retired route must remain noindex`);
  if (!html.includes("location.replace('/')")) errors.push(`${legacy}: retired route must hard-redirect to /`);
}

if (errors.length) {
  console.error(`Site verification failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site verification passed: ${required.length} required files, ${modernRoutes.length} canonical routes, local references, manifests and sitemap checked.`);
