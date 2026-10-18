const toggleButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
const year = document.getElementById('year');

// Projects system
const PROJECTS_JSON = 'projects.json';
const LOCAL_KEY = 'ncg_projects_local';
const projectGrid = document.getElementById('project-grid');
const projectForm = document.getElementById('project-form');
const exportButton = document.getElementById('export-json');
const clearLocalButton = document.getElementById('clear-local');

let remoteProjects = [];
let localProjects = [];

function renderProjects() {
  const combined = [...remoteProjects, ...localProjects];
  projectGrid.innerHTML = combined.map((p, i) => {
    const safeLink = p.link ? `<a class="project-link" href="${p.link}" target="_blank" rel="noreferrer">Visit</a>` : '';
    return `
      <article class="project-card">
        <div class="project-visual visual-${(i%3)+1}"></div>
        <div class="project-body">
          <span class="tag">${escapeHtml(p.category || 'Project')}</span>
          <h3>${escapeHtml(p.title || 'Untitled')}</h3>
          <p>${escapeHtml(p.description || '')}</p>
          <div style="margin-top:0.8rem">${safeLink}</div>
        </div>
      </article>
    `;
  }).join('\n');
}

function escapeHtml(str){
  if(!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if(raw) {
      localProjects = JSON.parse(raw);
    } else {
      localProjects = [];
    }
  } catch(e) {
    console.warn('Failed to parse local projects', e);
    localProjects = [];
  }
}

function saveLocal() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(localProjects));
}

function fetchRemote() {
  fetch(PROJECTS_JSON, { cache: 'no-store' })
    .then(res => {
      if(!res.ok) throw new Error('projects.json not found');
      return res.json();
    })
    .then(data => {
      if(Array.isArray(data)) remoteProjects = data;
      else remoteProjects = [];
      renderProjects();
    })
    .catch(() => {
      remoteProjects = [];
      renderProjects();
    });
}

function addProject(entry) {
  localProjects.unshift(entry);
  saveLocal();
  renderProjects();
}

function exportCombinedToClipboard() {
  const combined = [...remoteProjects, ...localProjects];
  const json = JSON.stringify(combined, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    alert('Combined projects JSON copied to clipboard — paste into projects.json in the repo to persist.');
  }, () => {
    // fallback
    const area = document.createElement('textarea');
    area.value = json;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    alert('Combined projects JSON copied to clipboard.');
  });
}

function clearLocal() {
  if(!confirm('Clear locally stored projects? This cannot be undone.')) return;
  localProjects = [];
  saveLocal();
  renderProjects();
}

// Initialize
if (toggleButton && nav) {
  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggleButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

// Projects boot
if(projectGrid) {
  loadLocal();
  fetchRemote();
}

if(projectForm) {
  projectForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const title = form.title.value.trim();
    const category = form.category.value.trim();
    const description = form.description.value.trim();
    const link = form.link.value.trim();
    if(!title) { alert('Please provide a project title'); return; }
    addProject({ title, category, description, link });
    form.reset();
  });
}

if(exportButton) exportButton.addEventListener('click', exportCombinedToClipboard);
if(clearLocalButton) clearLocalButton.addEventListener('click', clearLocal);

// When there is no remote projects.json, render will still show local projects.

