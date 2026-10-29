/* Demo estática de RetroConsolas — réplica en JS puro de la app Angular. */
(function () {
  const CONSOLES = window.CONSOLES || [];
  const GENERATIONS = window.GENERATIONS || [];
  const app = document.getElementById('app');

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const byId = (id) => CONSOLES.find((c) => c.id === id);
  const manufacturers = () => [...new Set(CONSOLES.map((c) => c.manufacturer))].sort((a, b) => a.localeCompare(b));
  const types = () => [...new Set(CONSOLES.map((c) => c.type))].sort((a, b) => a.localeCompare(b));

  const FEATURED = ['atari-2600','nintendo-nes','sega-genesis','nintendo-snes','sony-playstation','sega-dreamcast','sony-ps2','nintendo-wii','microsoft-xbox-360','nintendo-switch','sony-ps5','microsoft-xbox-series'];

  // estado de filtros del catálogo
  const f = { search: '', brand: '', generation: '', type: '', sort: 'year-asc' };

  function setNav(name) {
    document.querySelectorAll('[data-nav]').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-nav') === name));
  }

  window.go = function (route, arg) {
    window.scrollTo(0, 0);
    if (route === 'home') { setNav('home'); renderHome(); }
    else if (route === 'catalog') { setNav('catalog'); renderCatalog(); }
    else if (route === 'detail') { setNav('catalog'); renderDetail(arg); }
    else if (route === 'brands') { setNav('brands'); renderBrands(); }
    else if (route === 'generations') { setNav('generations'); renderGenerations(); }
  };

  function stats() {
    const years = CONSOLES.map((c) => c.releaseYear);
    return {
      totalConsoles: CONSOLES.length,
      totalBrands: manufacturers().length,
      totalGames: CONSOLES.reduce((a, c) => a + c.topGames.length, 0),
      yearRange: Math.min(...years) + '–' + Math.max(...years),
    };
  }

  function renderHome() {
    const s = stats();
    const feats = FEATURED.map(byId).filter(Boolean);
    app.innerHTML = `
      <section class="hero"><div class="container hero-inner">
        <span class="eyebrow">Enciclopedia de hardware de videojuegos</span>
        <h1>La historia completa de las <span class="grad">consolas de videojuegos</span></h1>
        <p class="lede">Todas las marcas, estilos, modelos y arquitecturas — desde la Magnavox Odyssey de 1972 hasta la generación actual. Cada ficha incluye su arquitectura técnica y el Top de juegos originales.</p>
        <div class="hero-cta">
          <button class="btn" onclick="go('catalog')">Explorar el catálogo</button>
          <button class="btn ghost" onclick="go('generations')">Ver generaciones</button>
        </div>
        <div class="stats">
          <div class="stat"><span class="stat-num">${s.totalConsoles}</span><span class="stat-label">consolas</span></div>
          <div class="stat"><span class="stat-num">${s.totalBrands}</span><span class="stat-label">marcas</span></div>
          <div class="stat"><span class="stat-num">${s.totalGames}</span><span class="stat-label">juegos listados</span></div>
          <div class="stat"><span class="stat-num">${s.yearRange}</span><span class="stat-label">años de historia</span></div>
        </div>
      </div></section>
      <section class="container block">
        <div class="block-head"><h2>Consolas emblemáticas</h2><span class="see-all" onclick="go('catalog')">Ver todas →</span></div>
        <div class="grid featured">
          ${feats.map((c) => `
            <div class="feat card" onclick="go('detail','${c.id}')">
              <span class="feat-year" style="color:${esc(c.accent || 'var(--accent)')}">${c.releaseYear}</span>
              <h3>${esc(c.shortName || c.name)}</h3>
              <p class="feat-maker">${esc(c.manufacturer)}</p>
            </div>`).join('')}
        </div>
      </section>
      <section class="container block">
        <div class="block-head"><h2>Línea de tiempo por generaciones</h2><span class="see-all" onclick="go('generations')">Detalle →</span></div>
        <ol class="timeline">
          ${GENERATIONS.map((g) => {
            const n = CONSOLES.filter((c) => c.generation === g.number).length;
            return `<li class="tl-item card"><div class="tl-num">${g.number}</div>
              <div class="tl-body"><h3>${esc(g.name)} <span class="tl-years">${esc(g.years)}</span></h3>
              <p>${esc(g.summary)}</p><span class="pill">${n} consolas en el catálogo</span></div></li>`;
          }).join('')}
        </ol>
      </section>`;
  }

  function filtered() {
    const q = f.search.trim().toLowerCase();
    let list = CONSOLES.filter((c) => {
      if (f.brand && c.manufacturer !== f.brand) return false;
      if (f.generation && c.generation !== Number(f.generation)) return false;
      if (f.type && c.type !== f.type) return false;
      if (q && !(`${c.name} ${c.manufacturer} ${c.shortName || ''}`.toLowerCase().includes(q))) return false;
      return true;
    });
    list = list.slice().sort((a, b) => {
      switch (f.sort) {
        case 'year-desc': return b.releaseYear - a.releaseYear;
        case 'name': return a.name.localeCompare(b.name);
        case 'games': return b.topGames.length - a.topGames.length;
        default: return a.releaseYear - b.releaseYear;
      }
    });
    return list;
  }

  function renderCatalog() {
    const opt = (v, label, sel) => `<option value="${esc(v)}"${sel ? ' selected' : ''}>${esc(label)}</option>`;
    app.innerHTML = `
      <section class="container page">
        <div class="page-head"><h1>Catálogo de consolas</h1>
          <p class="muted">Explora todas las consolas de la historia. Filtra por marca, generación o tipo, y entra en cada ficha para ver su arquitectura y el Top de juegos.</p></div>
        <div class="filters card">
          <div class="filter"><label>Buscar</label><input id="fx-search" type="search" placeholder="Nombre, marca…" value="${esc(f.search)}"></div>
          <div class="filter"><label>Marca</label><select id="fx-brand"><option value="">Todas</option>${manufacturers().map((m) => opt(m, m, f.brand === m)).join('')}</select></div>
          <div class="filter"><label>Generación</label><select id="fx-gen"><option value="">Todas</option>${GENERATIONS.map((g) => opt(g.number, g.number + 'ª — ' + g.years, f.generation == g.number)).join('')}</select></div>
          <div class="filter"><label>Tipo</label><select id="fx-type"><option value="">Todos</option>${types().map((t) => opt(t, t, f.type === t)).join('')}</select></div>
          <div class="filter"><label>Ordenar</label><select id="fx-sort">
            ${opt('year-asc','Año ↑',f.sort==='year-asc')}${opt('year-desc','Año ↓',f.sort==='year-desc')}${opt('name','Nombre A-Z',f.sort==='name')}${opt('games','Nº de juegos',f.sort==='games')}
          </select></div>
          <button class="btn ghost" style="margin-left:auto" id="fx-reset">Limpiar</button>
        </div>
        <p class="result-count muted" id="fx-count"></p>
        <div class="grid cards" id="fx-cards"></div>
      </section>`;

    const paint = () => {
      const list = filtered();
      document.getElementById('fx-count').textContent = list.length + ' consolas';
      document.getElementById('fx-cards').innerHTML = list.length ? list.map((c) => `
        <div class="console-card card" onclick="go('detail','${c.id}')">
          <div class="card-top" style="border-color:${esc(c.accent || 'var(--accent)')}">
            <span class="year">${c.releaseYear}</span><span class="pill">${esc(c.type)}</span></div>
          <h3 style="color:${esc(c.accent || 'var(--text)')}">${esc(c.shortName || c.name)}</h3>
          <p class="maker">${esc(c.manufacturer)}</p>
          <p class="desc">${esc(c.description)}</p>
          <div class="meta"><span class="pill">Gen ${c.generation}</span>${c.architecture.bits ? `<span class="pill">${esc(c.architecture.bits)}</span>` : ''}<span class="pill">${c.topGames.length} juegos</span></div>
        </div>`).join('') : `<div class="card" style="grid-column:1/-1;padding:2rem;text-align:center">No hay consolas que coincidan con los filtros.</div>`;
    };
    const bind = (id, key) => { const el = document.getElementById(id); el.addEventListener('input', () => { f[key] = el.value; paint(); }); };
    bind('fx-search','search'); bind('fx-brand','brand'); bind('fx-gen','generation'); bind('fx-type','type'); bind('fx-sort','sort');
    document.getElementById('fx-reset').addEventListener('click', () => { Object.assign(f, { search:'', brand:'', generation:'', type:'', sort:'year-asc' }); renderCatalog(); });
    paint();
  }

  function renderDetail(id) {
    const c = byId(id);
    if (!c) { app.innerHTML = `<section class="container page"><h1>Consola no encontrada</h1><button class="btn" onclick="go('catalog')">Ir al catálogo</button></section>`; return; }
    const a = c.architecture;
    const meta = [
      ['Fabricante', c.manufacturer], ['Generación', c.generation + 'ª'], ['Tipo', c.type], ['Región', c.region],
      ['Lanzamiento', c.discontinuedYear ? c.releaseYear + '–' + c.discontinuedYear : '' + c.releaseYear],
    ];
    if (c.unitsSold) meta.push(['Unidades vendidas', c.unitsSold]);
    const specPairs = [['CPU',a.cpu],['GPU / Vídeo',a.gpu],['Sonido',a.sound],['RAM',a.ram],['VRAM',a.vram],['Resolución',a.resolution],['Soporte',a.media],['Bits',a.bits],['Notas',a.notes]].filter(([,v]) => v);
    const row = ([k, v]) => `<div class="spec-row"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`;
    app.innerHTML = `
      <article class="container page">
        <span class="back" onclick="go('catalog')">← Volver al catálogo</span>
        <header class="hero-d card" style="border-color:${esc(c.accent || 'var(--accent)')}">
          <span class="hero-year" style="color:${esc(c.accent || 'var(--accent)')}">${c.releaseYear}</span>
          <h1>${esc(c.name)}</h1>
          <p class="hero-desc">${esc(c.description)}</p>
          <div class="hero-pills"><span class="pill">${esc(c.manufacturer)}</span><span class="pill">Generación ${c.generation}</span><span class="pill">${esc(c.type)}</span>${a.bits ? `<span class="pill">${esc(a.bits)}</span>` : ''}</div>
        </header>
        <div class="columns">
          <section class="card panel"><h2>Ficha general</h2><dl>${meta.map(row).join('')}</dl></section>
          <section class="card panel"><h2>Arquitectura técnica</h2><dl>${specPairs.length ? specPairs.map(row).join('') : '<p class="muted">Sin datos.</p>'}</dl></section>
        </div>
        <section>
          <div class="games-head"><h2>Top ${c.topGames.length} juegos originales</h2><p class="muted">Los títulos más destacados lanzados para ${esc(c.shortName || c.name)}.</p></div>
          <ol class="games-list">
            ${c.topGames.map((g) => `<li class="game"><span class="rank">${g.rank}</span><span class="g-title">${esc(g.title)}</span><span class="g-meta">${g.developer ? `<span class="dev">${esc(g.developer)}</span>` : ''}${g.year ? `<span class="g-year">${g.year}</span>` : ''}</span></li>`).join('')}
          </ol>
        </section>
      </article>`;
  }

  function renderBrands() {
    const brands = manufacturers().map((m) => {
      const cs = CONSOLES.filter((c) => c.manufacturer === m).sort((a, b) => a.releaseYear - b.releaseYear);
      const ys = cs.map((c) => c.releaseYear);
      return { m, count: cs.length, first: Math.min(...ys), last: Math.max(...ys), cs };
    }).sort((a, b) => b.count - a.count);
    app.innerHTML = `
      <section class="container page">
        <div class="page-head"><h1>Marcas y fabricantes</h1><p class="muted">Los fabricantes que han marcado la historia del hardware de videojuegos, ordenados por número de consolas.</p></div>
        <div class="grid brand-grid">
          ${brands.map((b) => `<section class="brand card">
            <div class="brand-head"><h2>${esc(b.m)}</h2><span class="pill">${b.count} consolas</span></div>
            <p class="brand-years muted">${b.first} – ${b.last}</p>
            <ul class="brand-consoles">${b.cs.map((c) => `<li><div class="lnk" onclick="go('detail','${c.id}')"><span class="c-name">${esc(c.shortName || c.name)}</span><span class="c-year">${c.releaseYear}</span></div></li>`).join('')}</ul>
          </section>`).join('')}
        </div>
      </section>`;
  }

  function renderGenerations() {
    app.innerHTML = `
      <section class="container page">
        <div class="page-head"><h1>Generaciones de consolas</h1><p class="muted">La historia del hardware de videojuegos dividida en sus nueve generaciones, con las consolas de cada una.</p></div>
        ${GENERATIONS.map((g) => {
          const cs = CONSOLES.filter((c) => c.generation === g.number).sort((a, b) => a.releaseYear - b.releaseYear);
          return `<section class="gen">
            <div class="gen-head"><div class="gen-num">${g.number}</div>
              <div><h2>${esc(g.name)} <span class="years">${esc(g.years)}</span></h2><p class="muted">${esc(g.summary)}</p></div></div>
            <div class="gen-consoles">${cs.length ? cs.map((c) => `<div class="chip" onclick="go('detail','${c.id}')"><span class="chip-name">${esc(c.shortName || c.name)}</span><span class="chip-meta">${esc(c.manufacturer)} · ${c.releaseYear}</span></div>`).join('') : '<p class="muted">Sin consolas.</p>'}</div>
          </section>`;
        }).join('')}
      </section>`;
  }

  go('home');
})();
