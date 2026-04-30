/* CinemaVerse - COMPLETE MAIN.JS - FULL IMPLEMENTATION 2025 */

const K = '5391e2b90f8bb45eb55606fbcf77a07d';
const B = 'https://api.themoviedb.org/3';
const I = 'https://image.tmdb.org/t/p/';
const GM = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',18:'Drama',14:'Fantasy',27:'Horror',9648:'Mystery',10749:'Romance',878:'Sci-Fi',53:'Thriller',10752:'War',37:'Western',36:'History'};
const GENRE_DATA = [
  {id:28,n:'Action',ic:'💥',c:'#e8192c'}, {id:27,n:'Horror',ic:'👻',c:'#7b2d8b'},
  {id:35,n:'Comedy',ic:'😂',c:'#f59e0b'}, {id:18,n:'Drama',ic:'🎭',c:'#3b82f6'},
  {id:878,n:'Sci-Fi',ic:'🚀',c:'#06b6d4'}, {id:10749,n:'Romance',ic:'💕',c:'#ec4899'},
  {id:12,n:'Adventure',ic:'🗺️',c:'#22c55e'}, {id:53,n:'Thriller',ic:'⚡',c:'#f97316'},
  {id:9648,n:'Mystery',ic:'🕵️',c:'#64748b'}, {id:80,n:'Crime',ic:'🔪',c:'#dc2626'},
  {id:14,n:'Fantasy',ic:'🧙',c:'#8b5cf6'}, {id:16,n:'Animation',ic:'🎨',c:'#14b8a6'},
  {id:10752,n:'War',ic:'⚔️',c:'#78716c'}, {id:36,n:'History',ic:'🏛️',c:'#d97706'}
];

let heroMs = [], curHero = null, curModal = null, heroIdx = 0, heroTmr = null;
let WL = JSON.parse(localStorage.getItem('cv_wl') || '[]');
let nTimer = null, sTimer = null, gPage = 1, gEP = '', gTitle = '', gBack = 'main';
let peopleScrollInterval = null;
let moviesDB = {}; // Store movie objects by ID for reference

/* ══════════ CANVAS ══════════ */
const CV = document.getElementById('bgc'), CX = CV.getContext('2d');
let pts = [], shps = [];
function rszCV() { CV.width = innerWidth; CV.height = innerHeight; }
class Pt {
  constructor() { this.re(); }
  re() { this.x = Math.random() * CV.width; this.y = Math.random() * CV.height; this.r = Math.random() * 1.7 + .3; this.vx = (Math.random() - .5) * .28; this.vy = (Math.random() - .5) * .28; this.a = Math.random() * .38 + .05; this.c = Math.random() > .72 ? '#e8192c' : '#f1f3ff'; }
  up() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > CV.width || this.y < 0 || this.y > CV.height) this.re(); }
  dr() { CX.beginPath(); CX.arc(this.x, this.y, this.r, 0, Math.PI * 2); CX.fillStyle = this.c; CX.globalAlpha = this.a; CX.fill(); }
}
class Sh {
  constructor() { this.x = Math.random() * CV.width; this.y = Math.random() * CV.height; this.sz = Math.random() * 190 + 55; this.rot = Math.random() * Math.PI * 2; this.rs = (Math.random() - .5) * .0028; this.a = Math.random() * .038 + .008; this.t = Math.floor(Math.random() * 3); this.c = Math.random() > .5 ? '#e8192c' : '#1a1f30'; this.vx = (Math.random() - .5) * .13; this.vy = (Math.random() - .5) * .13; }
  up() { this.x += this.vx; this.y += this.vy; this.rot += this.rs; if (this.x < -this.sz) this.x = CV.width + this.sz; if (this.x > CV.width + this.sz) this.x = -this.sz; if (this.y < -this.sz) this.y = CV.height + this.sz; if (this.y > CV.height + this.sz) this.y = -this.sz; }
  dr() { CX.save(); CX.translate(this.x, this.y); CX.rotate(this.rot); CX.globalAlpha = this.a; CX.strokeStyle = this.c; CX.lineWidth = 1; CX.beginPath(); if (this.t === 0) { const s = this.sz; CX.moveTo(0, -s / 2); CX.lineTo(s / 2, s / 2); CX.lineTo(-s / 2, s / 2); CX.closePath(); } else if (this.t === 1) { for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; CX[i ? 'lineTo' : 'moveTo'](Math.cos(a) * this.sz / 2, Math.sin(a) * this.sz / 2); } CX.closePath(); } else { CX.moveTo(0, -this.sz / 2); CX.lineTo(this.sz * .3, 0); CX.lineTo(0, this.sz / 2); CX.lineTo(-this.sz * .3, 0); CX.closePath(); } CX.stroke(); CX.restore(); }
}
function initCV() { rszCV(); pts = Array.from({length:110}, () => new Pt()); shps = Array.from({length:13}, () => new Sh()); }
function animCV() { CX.clearRect(0, 0, CV.width, CV.height); shps.forEach(s => { s.up(); s.dr(); }); pts.forEach(p => { p.up(); p.dr(); }); requestAnimationFrame(animCV); }

/* ═══ FLOWER CURSOR ═══ */
const CE=document.getElementById('cur'),FE=document.getElementById('cur-flower');
let mx=0,my=0,rx=0,ry=0,flRot=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  CE.style.transform=`translate(${mx-4}px,${my-4}px)`;
});
function animCur(){
  rx+=(mx-rx)*.13;ry+=(my-ry)*.13;
  flRot+=0.5; // slow continuous spin
  const hw=FE.offsetWidth/2,hh=FE.offsetHeight/2;
  FE.style.transform=`translate(${rx-hw}px,${ry-hh}px)`;
  FE.querySelector('svg').style.transform=`rotate(${flRot}deg)`;
  requestAnimationFrame(animCur);
}
const hovSel='button,a,.card,.mag-card,.cinema-card,.spotlight-card,.t10-card,.asp,.asmp,.gm-tile,.genre-big-tile,.hdot,.mchip,.tab';
document.addEventListener('mouseover',e=>{if(e.target.closest(hovSel))FE.classList.add('hov');});
document.addEventListener('mouseout',e=>{if(e.target.closest(hovSel))FE.classList.remove('hov');});
document.addEventListener('mousedown',()=>{FE.classList.add('clk');});
document.addEventListener('mouseup',()=>{FE.classList.remove('clk');});
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>50));

/* ══════════ API ══════════ */
async function api(ep) { 
  const sep = ep.includes('?') ? '&' : '?'; 
  const r = await fetch(`${B}${ep}${sep}api_key=${K}&language=en-US`); 
  if (!r.ok) throw new Error('API Error: ' + r.status); 
  return r.json(); 
}
const img = (p, s = 'w500') => p ? `${I}${s}${p}` : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%2313151f" width="200" height="300"/><text fill="%237a8094" x="100" y="155" text-anchor="middle" font-size="11" font-family="sans-serif">No image</text></svg>';

/* ══════════ ROUTING ══════════ */
function setPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function goHome() { setPage('main-page'); }
function goToWatchlist() { renderWL(); setPage('watchlist-page'); }
function goToGenres() { renderGenreBig(); setPage('genres-page'); }
function goToSearch() { setPage('search-page'); }
function goToGenrePage(ep, title, back = 'main') { gEP = ep; gTitle = title; gBack = back; gPage = 1; setPage('genre-page'); loadGPage(true); }

/* ══════════ UTILS ══════════ */
function updBadge() { 
  const c = WL.length;
  document.getElementById('wl-badge')?.classList.toggle('on', c > 0);
  document.getElementById('wl-badge2')?.classList.toggle('on', c > 0);
  document.getElementById('wl-badge') && (document.getElementById('wl-badge').textContent = c);
  document.getElementById('wl-badge2') && (document.getElementById('wl-badge2').textContent = c);
}
function toast(msg) { 
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(() => t.classList.remove('on'), 3200);
}
function wlAdd(m) { WL.unshift(m); localStorage.setItem('cv_wl', JSON.stringify(WL)); updBadge(); }
function wlRm(id) { WL = WL.filter(w => w.id !== id); localStorage.setItem('cv_wl', JSON.stringify(WL)); updBadge(); }

/* ══════════ HERO ══════════ */
async function loadHero() { 
  try { 
    const d = await api('/trending/movie/week'); 
    heroMs = d.results.slice(0,8).filter(m => m.backdrop_path); 
    document.getElementById('hero-nav').innerHTML = heroMs.map((_,i) => `<div class="hdot${i===0?' on':''}" onclick="setHero(${i})"></div>`).join(''); 
    setHero(0); 
    heroTmr = setInterval(() => setHero((heroIdx+1)%heroMs.length), 7500); 
  } catch(e) { console.error('Hero load:', e); } 
}
function setHero(i) { 
  heroIdx = i; const m = heroMs[i]; if (!m) return; 
  curHero = m;
  document.getElementById('hero-bg').style.backgroundImage = `url(${img(m.backdrop_path,'original')})`; 
  document.getElementById('hero-h').textContent = m.title || m.name || 'Untitled'; 
  document.getElementById('hero-rt').textContent = m.vote_average?.toFixed(1) || '—'; 
  document.getElementById('hero-yr').textContent = (m.release_date || m.first_air_date || '').slice(0,4) || '—'; 
  document.getElementById('hero-desc').textContent = m.overview || 'No description available.'; 
  const gs = (m.genre_ids || []).slice(0,2).map(id => GM[id]).filter(Boolean); 
  document.getElementById('hero-gn').textContent = gs.join(' · ') || '—'; 
  document.querySelectorAll('.hdot').forEach((d,j) => d.classList.toggle('on', j === i)); 
  document.getElementById('hero-play').onclick = () => openModal(m); 
  document.getElementById('hero-wl-btn').onclick = heroWLToggle; 
  refreshHeroBtn(); 
}
function heroWLToggle() { 
  if (!curHero) return; 
  const saved = WL.some(w => w.id === curHero.id); 
  if (saved) { wlRm(curHero.id); toast(`Removed from list`); } else { wlAdd(curHero); toast(`Added to list`); } 
  refreshHeroBtn(); 
}
function refreshHeroBtn() { 
  if (!curHero) return; 
  const b = document.getElementById('hero-wl-btn'); 
  const s = WL.some(w => w.id === curHero.id); 
  b.textContent = s ? '✓ In List' : '+ My List'; 
  b.className = s ? 'btn-gr' : 'btn-g'; 
}

/* ══════════ CARDS & ROWS ══════════ */
// Helper function to store movie in moviesDB and return ID
function storeMovie(m) {
  const id = 'm_' + m.id;
  moviesDB[id] = m;
  return id;
}

// Get movie from moviesDB by ID (called from onclick handlers)
function getMovie(id) {
  return moviesDB[id] || null;
}

function skels(id, n = 8) { const r = document.getElementById(id); if (r) r.innerHTML = Array(n).fill('<div class="skel"></div>').join(''); }
async function loadRow(id, ep) { 
  skels(id); 
  try { 
    const d = await api(ep); 
    const r = document.getElementById(id); 
    if (r) r.innerHTML = (d.results || []).map(m => cardH(m)).join('') || '<div style="padding:18px;color:var(--muted);">No results</div>'; 
  } catch (e) { console.error('loadRow', e); document.getElementById(id).innerHTML = '<div style="padding:18px;color:var(--muted);">Load error</div>'; } 
}
function cardH(m, fullW = false) { 
  const s = WL.some(w => w.id === m.id); 
  const t = m.title || m.name || 'Untitled'; 
  const y = (m.release_date || m.first_air_date || '').slice(0,4); 
  const movieId = storeMovie(m); // Store movie and get ID
  return `<div class="card${fullW ? ' style="width:100%"' : ''}" onclick="openModalById('${movieId}')">
    <button class="card-heart${s ? ' saved' : ''}" onclick="event.stopPropagation();cardHeartById('${movieId}')">${s ? '♥' : '♡'}</button>
    <div class="card-star">★ ${m.vote_average?.toFixed(1) || '—'}</div>
    <img class="card-img" src="${img(m.poster_path)}" alt="${t}" loading="lazy">
    <div class="card-ov"><div class="card-play">▶</div><div class="card-name">${t}</div><div class="card-yr">${y}</div></div>
  </div>`; 
}
function switchTab(btn, rowId, ep) { 
  btn.closest('.tabs').querySelectorAll('.tab').forEach(b => b.classList.remove('on')); 
  btn.classList.add('on'); 
  loadRow(rowId, ep); 
}
function scrollR(id, dir) { const r = document.getElementById(id); if (r) r.scrollBy({left: dir * 560, behavior: 'smooth'}); }

/* ══════════ TOP 10 ══════════ */
async function loadTop10() { 
  try { 
    const d = await api('/trending/movie/day'); 
    document.getElementById('t10-row').innerHTML = d.results.slice(0,10).map((m,i) => {
      const movieId = storeMovie(m);
      return `<div class="t10-card" onclick="openModalById('${movieId}')"><img class="t10-img" src="${img(m.poster_path,'w200')}" alt="${m.title}" loading="lazy"><div class="t10-num">${i+1}</div></div>`; 
    }).join(''); 
  } catch(e) { console.error('Top10', e); } 
}

/* ══════════ SPOTLIGHT ══════════ */
async function loadSpotlight() { 
  try { 
    const d = await api('/movie/now_playing'); 
    const ms = (d.results || []).filter(m => m.backdrop_path).slice(0,3); 
    if (!ms.length) return; 
    const grid = document.getElementById('spotlight-grid'); 
    const count = ms.length;
    // Dynamically adjust grid columns based on item count
    grid.style.gridTemplateColumns = count === 1 ? '1fr' : '1fr 1fr';
    grid.style.maxWidth = count === 1 ? '540px' : count === 2 ? '780px' : '100%';
    grid.style.margin = '0 auto';
    const makeCard = (m, tall = false) => { 
      const s = WL.some(w => w.id === m.id); 
      const movieId = storeMovie(m);
      const gs = (m.genre_ids || []).slice(0,1).map(id => GM[id]).filter(Boolean); 
      const showDesc = tall && count >= 2;
      return `<div class="spotlight-card${tall && count >= 2 ? ' tall' : ''}" onclick="openModalById('${movieId}')">
        <img class="spotlight-img" src="${img(m.backdrop_path, 'w780')}" alt="${m.title || m.name}" loading="lazy">
        <button class="spotlight-heart${s ? ' saved' : ''}" onclick="event.stopPropagation();spotHeartById('${movieId}')">${s ? '♥' : '♡'}</button>
        <div class="spotlight-ov">
          <div class="spotlight-genre">${gs[0] || 'Film'}</div>
          <div class="spotlight-title">${m.title || m.name}</div>
          ${showDesc ? `<div class="spotlight-desc">${m.overview || ''}</div>` : ''}
          <div class="spotlight-meta">
            <span class="spotlight-star">★ ${m.vote_average?.toFixed(1) || '—'}</span>
            <span class="spotlight-yr">${(m.release_date || '').slice(0,4)}</span>
          </div>
        </div>
      </div>`; 
    }; 
    // First card gets tall class only if 2+ items
    grid.innerHTML = makeCard(ms[0], count >= 2) + ms.slice(1).map(m => makeCard(m)).join(''); 
  } catch(e) { console.error('Spotlight', e); } 
}

/* ══════════ GENRE MOSAIC ══════════ */
function renderGenreMosaic() { 
  document.getElementById('genre-mosaic').innerHTML = GENRE_DATA.map(g => `<div class="gm-tile" onclick="goToGenrePage('/discover/movie?with_genres=${g.id}&sort_by=popularity.desc','${g.n}','main')" style="border-color:${g.c}">
    <div class="gm-icon" style="color:${g.c}">${g.ic}</div>
    <div class="gm-name">${g.n}</div>
  </div>`).join(''); 
}

/* ══════════ PEOPLE ══════════ */
async function loadPeople() { 
  try { 
    const d = await api('/person/popular'); 
    const row = document.getElementById('ppl-row'); 
    if (row) { 
      // Filter only people with profile images
      const validPeople = (d.results || []).filter(p => p.profile_path).slice(0, 20); 
      if (validPeople.length === 0) { 
        row.innerHTML = '<div style="padding:18px;color:var(--muted);">No people found</div>'; 
        return; 
      } 
      row.innerHTML = `<div class="inner-scroll">${validPeople.map(p => `<div class="person-card" onclick="openModal({id:${p.id},name:'${p.name}',profile_path:'${p.profile_path}',known_for_department:'${p.known_for_department}'})">
        <img class="person-av" src="${img(p.profile_path, 'w185')}" alt="${p.name}" loading="lazy">
        <div class="person-name">${p.name}</div>
        <div class="person-dept">${p.known_for_department}</div>
      </div>`).join('') + validPeople.map(p => `<div class="person-card" onclick="openModal({id:${p.id},name:'${p.name}',profile_path:'${p.profile_path}',known_for_department:'${p.known_for_department}'})">
        <img class="person-av" src="${img(p.profile_path, 'w185')}" alt="${p.name}" loading="lazy">
        <div class="person-name">${p.name}</div>
        <div class="person-dept">${p.known_for_department}</div>
      </div>`).join('')}</div>`; 
      initPeopleAutoScroll(); 
    } 
  } catch(e) { console.error('People', e); } 
}

/* ══════════ MAGAZINE GRID (Action & Drama) ══════════ */
async function loadMag(id, genreId) { 
  try { 
    const d = await api(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`); 
    const ms = (d.results || []).slice(0,5); 
    if (!ms.length) return; 
    const row = document.getElementById(id); 
    if (!row) return; 
    const makeMagCard = (m, big = false) => { 
      const s = WL.some(w => w.id === m.id); 
      const movieId = storeMovie(m);
      const gs = (m.genre_ids || []).slice(0,1).map(gid => GM[gid]).filter(Boolean); 
      return `<div class="mag-card${big ? ' big' : ''}" onclick="openModalById('${movieId}')">
        <img class="mag-img" src="${img(m.backdrop_path, 'w780')}" alt="${m.title || m.name}" loading="lazy">
        <button class="mag-heart${s ? ' saved' : ''}" onclick="event.stopPropagation();magHeartById('${movieId}')">${s ? '♥' : '♡'}</button>
        <div class="mag-ov">
          <div class="mag-tag">${gs[0] || 'Film'}</div>
          <div class="mag-title">${m.title || m.name}</div>
          <div class="mag-bottom">
            <span class="mag-star">★ ${m.vote_average?.toFixed(1) || '—'}</span>
            <span class="mag-yr">${(m.release_date || '').slice(0,4)}</span>
          </div>
        </div>
      </div>`; 
    }; 
    row.innerHTML = makeMagCard(ms[0], true) + ms.slice(1).map(m => makeMagCard(m)).join(''); 
  } catch(e) { console.error('loadMag', e); } 
}
function magHeart(el, m) { 
  const movie = typeof m === 'string' ? JSON.parse(m.replace(/\\"/g, '"')) : m; 
  const saved = WL.some(w => w.id === movie.id); 
  if (saved) { wlRm(movie.id); el.textContent = '♡'; el.classList.remove('saved'); toast('Removed'); } 
  else { wlAdd(movie); el.textContent = '♥'; el.classList.add('saved'); toast('Added!'); } 
}

function magHeartById(id) {
  const m = getMovie(id);
  if (!m) return;
  const el = event.currentTarget;
  const saved = WL.some(w => w.id === m.id);
  if (saved) { wlRm(m.id); el.textContent = '♡'; el.classList.remove('saved'); toast('Removed'); } 
  else { wlAdd(m); el.textContent = '♥'; el.classList.add('saved'); toast('Added!'); } 
}
function initPeopleAutoScroll() { 
  const row = document.getElementById('ppl-row'); 
  if (!row) return; 
  row.style.overflow = 'hidden'; 
}

/* ══════════ MODAL ══════════ */
async function openModal(m) { 
  curModal = m; 
  document.getElementById('m-backdrop').src = img(m.backdrop_path || m.profile_path, 'original'); 
  document.getElementById('m-title').textContent = m.title || m.name || 'Details'; 
  
  // Populate meta (rating, year, runtime)
  const r = m.vote_average?.toFixed(1) || '—';
  const y = (m.release_date || m.first_air_date || '').slice(0,4) || '—';
  document.getElementById('m-meta').innerHTML = `
    <span class="mbadge star">★ ${r}</span>
    <span class="mbadge">${y}</span>
    ${m.runtime ? `<span class="mbadge">${Math.floor(m.runtime/60)}h ${m.runtime%60}m</span>` : ''}
    ${m.number_of_seasons ? `<span class="mbadge">${m.number_of_seasons} Seasons</span>` : ''}
  `;
  
  // Populate genre chips
  const gs = (m.genre_ids || []).slice(0,3).map(id => GM[id]).filter(Boolean);
  document.getElementById('m-chips').innerHTML = gs.map(g => `<span class="mchip">${g}</span>`).join('');
  
// Populate description
  const desc = m.overview || m.biography || 'No description available.';
  document.getElementById('m-desc').textContent = desc;
  
// Sim row - get similar movies
  try {
    const ep = m.media_type === 'tv' || m.first_air_date ? `/tv/${m.id}/similar` : `/movie/${m.id}/similar`;
    const sd = await api(ep);
    const row = document.getElementById('sim-row');
    if (row) {
      row.innerHTML = (sd.results || []).slice(0,6).map(sm => {
        const movieId = storeMovie(sm);
        return `<div class="sim-card" onclick="openModalById('${movieId}')">
          <img src="${img(sm.poster_path, 'w200')}" alt="${sm.title || sm.name}" loading="lazy">
          <p>${sm.title || sm.name}</p>
        </div>`;
      }).join('');
    }
  } catch(e) { console.error('sim', e); }
  
  document.getElementById('modal-ov').classList.add('open'); 
}
function closeModal() { document.getElementById('modal-ov').classList.remove('open'); }

/* ══════════ SPOTLIGHT HEART ══════════ */
function spotHeart(el, m) { 
  const movie = typeof m === 'string' ? JSON.parse(m.replace(/\\"/g, '"')) : m; 
  const saved = WL.some(w => w.id === movie.id); 
  if (saved) { wlRm(movie.id); el.textContent = '♡'; el.classList.remove('saved'); toast('Removed'); } 
  else { wlAdd(movie); el.textContent = '♥'; el.classList.add('saved'); toast('Added!'); } 
}

function spotHeartById(id) {
  const m = getMovie(id);
  if (!m) return;
  const el = event.currentTarget;
  const saved = WL.some(w => w.id === m.id);
  if (saved) { wlRm(m.id); el.textContent = '♡'; el.classList.remove('saved'); toast('Removed'); } 
  else { wlAdd(m); el.textContent = '♥'; el.classList.add('saved'); toast('Added!'); } 
}

/* ══════════ CARD HEART ══════════ */
function cardHeart(el, m) { 
  const movie = typeof m === 'string' ? JSON.parse(m.replace(/\\"/g, '"')) : m; 
  const saved = WL.some(w => w.id === movie.id); 
  if (saved) { wlRm(movie.id); el.textContent = '♡'; el.classList.remove('saved'); toast('Removed'); } 
  else { wlAdd(movie); el.textContent = '♥'; el.classList.add('saved'); toast('Added!'); } 
}

// New functions that use movie ID reference (for fixed cards)
function openModalById(id) {
  const m = getMovie(id);
  if (m) openModal(m);
}

function cardHeartById(id) {
  const m = getMovie(id);
  if (!m) return;
  const el = event.currentTarget;
  const saved = WL.some(w => w.id === m.id);
  if (saved) {
    wlRm(m.id);
    el.textContent = '♡';
    el.classList.remove('saved');
    toast('Removed');
  } else {
    wlAdd(m);
    el.textContent = '♥';
    el.classList.add('saved');
    toast('Added!');
  }
}

/* ══════════ WATCH TRAILER ══════════ */
function watchTrailer() { 
  if (curModal) {
    const movieName = encodeURIComponent(curModal.title || curModal.name || '');
    // Open YouTube directly in new tab
    window.open(`https://www.youtube.com/results?search_query=${movieName} trailer`, '_blank');
  }
}

/* ══════════ WATCHLIST PAGE ══════════ */
function renderWL() { 
  const grid = document.getElementById('wl-grid'); 
  if (!grid) return; 
  if (WL.length === 0) { 
    grid.innerHTML = '<div class="wl-empty"><span class="wl-empty-icon">🎬</span><p>Your list is empty</p></div>'; 
    return; 
  } 
  grid.innerHTML = WL.map(m => cardH(m)).join(''); 
}

/* ══════════ GENRES PAGE ══════════ */
function renderGenreBig() { 
  document.getElementById('genre-big').innerHTML = GENRE_DATA.map(g => `<div class="genre-big-tile" onclick="goToGenrePage('/discover/movie?with_genres=${g.id}&sort_by=popularity.desc','${g.n}','genres')" style="border-color:${g.c}">
    <div class="genre-big-icon" style="color:${g.c}">${g.ic}</div>
    <div class="genre-big-name">${g.n}</div>
  </div>`).join(''); 
}

/* ══════════ GENRE RESULT PAGE ══════════ */
function skelsG() { document.getElementById('gp-grid').innerHTML = Array(8).fill('<div class="skel"></div>').join(''); }
async function loadGPage(reset = false) { 
  if (reset) { gPage = 1; document.getElementById('pgnum')?.remove(); } 
  skelsG(); 
  try { 
    const d = await api(gEP + '&page=' + gPage); 
    const total = d.total_pages || 1; 
    document.getElementById('gp-grid').innerHTML = (d.results || []).map(m => cardH(m)).join('') || '<div style="padding:18px;color:var(--muted);">No results</div>'; 
    if (total > 1 && !document.getElementById('pgnum')) { 
      document.querySelector('.pghdr > div:last-child')?.insertAdjacentHTML('beforeend', `<button id="pgnum" class="btn-g" onclick="gPage++;loadGPage()">Next →</button>`); 
    } 
  } catch (e) { console.error('loadGPage', e); } 
}

/* ══════════ SEARCH ══════════ */
let nsTimer = null;
function handleNavSearch(q) { 
  clearTimeout(nsTimer); 
  const drop = document.getElementById('nav-drop'); 
  if (!q || q.length < 2) { drop.classList.remove('vis'); return; } 
  nsTimer = setTimeout(async () => { 
    try { 
      const d = await api('/search/multi?q=' + encodeURIComponent(q)); 
      const rs = (d.results || []).slice(0,8); 
      if (!rs.length) { drop.classList.remove('vis'); return; } 
      drop.innerHTML = rs.map(m => {
        const t = m.title || m.name || 'Unknown';
        const imgUrl = m.media_type === 'person' ? m.profile_path : m.poster_path || m.backdrop_path;
        const size = m.media_type === 'person' ? 'w185' : 'w92';
        return `<div class="drop-item" onclick="openModal({id:${m.id},name:'${t.replace(/'/g,"\\'")},${m.media_type === 'person' ? "profile_path" : "backdrop_path"}:'${imgUrl || ''}',media_type:'${m.media_type}'})">
          <img src="${img(imgUrl, size)}" alt="${t}">
          <div class="drop-item-info"><h4>${t}</h4><span>${m.media_type === 'person' ? m.known_for_department : (m.release_date || m.first_air_date || '').slice(0,4) || '—'}</span></div>
        </div>`;
      }).join('') + '<div class="drop-see-all" onclick="goToSearch()">See all results →</div>';
      drop.classList.add('vis'); 
    } catch(e) { console.error('nav search', e); } 
  }, 360); 
}
let spTimer = null;
function handlePageSearch(q) { 
  clearTimeout(spTimer); 
  const grid = document.getElementById('sp-grid'); 
  const status = document.getElementById('sp-status'); 
  if (!q || q.length < 2) { grid.innerHTML = ''; status.textContent = 'Start typing to search...'; return; } 
  status.textContent = 'Searching...'; 
  spTimer = setTimeout(async () => { 
    try { 
      const d = await api('/search/multi?q=' + encodeURIComponent(q)); 
      const rs = d.results || []; 
      if (!rs.length) { status.textContent = 'No results found'; grid.innerHTML = ''; return; } 
      status.textContent = ''; 
      grid.innerHTML = rs.slice(0,20).map(m => cardH(m)).join(''); 
    } catch(e) { console.error('page search', e); status.textContent = 'Search error'; } 
  }, 500); 
}

/* ══════════ BOTTOM NAV (MOBILE) ══════════ */
function setBnav(id) { 
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('on')); 
  document.getElementById(id)?.classList.add('on'); 
}

/* ══════════ FULL INIT ══════════ */
async function init() { 
  initCV(); 
  animCV(); 
  animCur(); 
  updBadge(); 
  renderGenreMosaic(); 
  await loadHero(); 
  loadRow('tr-row','/trending/movie/week'); 
  loadTop10(); 
  loadSpotlight(); 
  loadRow('mov-row','/movie/popular'); 
  loadRow('hor-row','/discover/movie?with_genres=27'); 
  loadRow('sf-row','/discover/movie?with_genres=878'); 
  loadRow('com-row','/discover/movie?with_genres=35'); 
  loadMag('mag-action', 28); 
  loadMag('mag-drama', 18); 
  loadPeople(); 
  console.log('CinemaVerse loaded!');
}
window.addEventListener('load', init); 
window.addEventListener('resize', rszCV);
