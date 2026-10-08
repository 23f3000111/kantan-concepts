/* Recipe hub: filters, search, recipe modal with serving scaler, and cook mode. */
(function () {
  const K = window.KANTAN, S = window.Site;
  const { $, $$, icon, money, esc } = S;
  const R = K.recipes;
  let cat = 'all', quick = false, q = '';

  function card(r) {
    const f = K.byId[r.paste];
    return `<button type="button" class="recipe-card" id="${r.id}" data-open="${r.id}">
      <div class="recipe-card__img"><img src="${f.photo}" alt="" loading="lazy" width="480" height="480"><span class="play">${icon('i-play')}</span></div>
      <h3>${esc(r.title)}</h3>
      <div class="recipe-meta"><span>${icon('i-users')}Serves ${r.serves}</span><span>${icon('i-clock')}${r.mins} min</span><span>${icon('i-bowl')}${esc(f.short)}</span></div>
    </button>`;
  }
  function render() {
    const list = R.filter(r => (cat === 'all' || r.cat === cat) && (!quick || r.mins <= 15) &&
      (!q || (r.title + ' ' + K.byId[r.paste].name + ' ' + r.ingredients.map(i => i.item).join(' ')).toLowerCase().includes(q)));
    $('#r-grid').innerHTML = list.map(card).join('');
    $('#r-empty').hidden = list.length > 0;
    S.refreshTour();
  }
  $$('[data-cat]').forEach(b => b.addEventListener('click', () => { cat = b.dataset.cat; $$('[data-cat]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); render(); }));
  $('[data-quick]').addEventListener('click', e => { quick = !quick; e.currentTarget.setAttribute('aria-pressed', String(quick)); render(); });
  $('#r-search').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); render(); });
  render();

  /* ---------- recipe modal ---------- */
  const fmt = n => (Math.round(n * 10) / 10).toString().replace(/\.0$/, '');
  function qty(i, factor) {
    if (i.n == null) return 'To taste';
    const v = i.n * factor;
    if (i.unit === 'pack') return `${fmt(v)} pack${v > 1 ? 's' : ''}`;
    return `${i.unit ? fmt(Math.round(v)) : fmt(v)}${i.unit ? ' ' + i.unit : ''}`;
  }
  function open(id) {
    const r = R.find(x => x.id === id);
    if (!r) return;
    const f = K.byId[r.paste];
    let serves = r.serves;
    const m = S.modal(`
      <div class="split" style="gap:28px;align-items:start">
        <div class="stack" style="--gap:14px">
          <div class="video-frame" id="rv"><img src="${f.photo}" alt=""><button class="play" type="button" aria-label="Play video">${icon('i-play')}</button></div>
          <div class="upsell" data-card><img src="${f.pack}" alt="" width="58"><div><b>${esc(f.name)}</b><br><span class="small muted">${money(f.price)} &nbsp; ${f.weight}</span></div>
            <button class="btn btn--sm" type="button" data-add="${f.id}" style="margin-left:auto">${icon('i-bag')}Add</button></div>
        </div>
        <div class="stack" style="--gap:18px">
          <h2 class="h2" style="font-size:clamp(34px,4vw,54px)">${esc(r.title)}</h2>
          <p class="muted" style="margin:0">${esc(r.note)}</p>
          <div class="recipe-meta" style="padding:0"><span>${icon('i-clock')}${r.mins} min</span><span>${icon('i-bowl')}${esc(f.short)} paste</span></div>
          <div class="servings" data-feature="scaler">Servings
            <div class="qty"><button type="button" data-sv="-1" aria-label="Fewer servings">${icon('i-minus')}</button><output id="sv">${serves}</output><button type="button" data-sv="1" aria-label="More servings">${icon('i-plus')}</button></div></div>
          <ul class="ing-list" id="ing"></ul>
          <ol class="num-list">${r.steps.map(s => `<li><span>${esc(s)}</span></li>`).join('')}</ol>
          <button class="btn btn--dark" type="button" id="cook" data-feature="cook-mode">${icon('i-screen')}Start cook mode</button>
        </div>
      </div>`, 1040);
    const ing = () => { $('#ing', m).innerHTML = r.ingredients.map(i => `<li><b>${qty(i, serves / r.serves)}</b><span>${esc(i.item)}</span></li>`).join(''); $('#sv', m).textContent = serves; };
    ing();
    $$('[data-sv]', m).forEach(b => b.addEventListener('click', () => { serves = Math.max(1, Math.min(20, serves + Number(b.dataset.sv))); ing(); }));
    $('#rv .play', m).addEventListener('click', () => { $('#rv', m).innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${r.video}?autoplay=1&rel=0" title="${esc(r.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; });
    $('#cook', m).addEventListener('click', () => cookMode(r));
    history.replaceState(null, '', '#' + r.id);
    setTimeout(() => S.refreshTour(), 500);
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) { e.preventDefault(); open(b.dataset.open); } });
  if (location.hash) setTimeout(() => open(location.hash.slice(1)), 400);

  /* ---------- cook mode ---------- */
  async function cookMode(r) {
    S.closeLayer();
    let i = 0, lock = null;
    try { if ('wakeLock' in navigator) lock = await navigator.wakeLock.request('screen'); } catch (e) { /* not supported */ }
    const el = document.createElement('div');
    el.className = 'cook'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Cook mode');
    document.body.appendChild(el);
    if (S.lenis) S.lenis.stop();
    const paint = () => {
      el.innerHTML = `<div class="cook__top"><span class="accent" style="color:var(--santan);font-size:28px">${esc(r.title)}</span>
          <span class="small" style="display:inline-flex;gap:6px;align-items:center;opacity:.8">${icon('i-sun')}${lock ? 'Screen stays on' : 'Keep your screen awake'}</span>
          <button class="icon-btn" type="button" data-x aria-label="Exit cook mode">${icon('i-close')}</button></div>
        <div class="cook__step"><small>Step ${i + 1} of ${r.steps.length}</small><p>${esc(r.steps[i])}</p></div>
        <div><div class="cook__bar"><i style="--p:${((i + 1) / r.steps.length) * 100}%"></i></div>
          <div class="cook__nav"><button class="btn btn--light" type="button" data-p ${i ? '' : 'disabled'}>${icon('i-arrow-left')}Back</button>
          <button class="btn" type="button" data-n>${i === r.steps.length - 1 ? 'Done, time to eat' : 'Next step'}${icon('i-arrow')}</button></div></div>`;
      el.querySelector('[data-n]').focus();
    };
    const close = () => { el.remove(); if (S.lenis) S.lenis.start(); if (lock) lock.release(); document.removeEventListener('keydown', key); };
    const key = e => { if (e.key === 'ArrowRight') nav(1); if (e.key === 'ArrowLeft') nav(-1); if (e.key === 'Escape') close(); };
    const nav = d => { if (d > 0 && i === r.steps.length - 1) { close(); S.toast('Selamat makan!'); return; } i = Math.max(0, Math.min(r.steps.length - 1, i + d)); paint(); };
    el.addEventListener('click', e => { if (e.target.closest('[data-x]')) close(); if (e.target.closest('[data-n]')) nav(1); if (e.target.closest('[data-p]')) nav(-1); });
    document.addEventListener('keydown', key);
    paint();
  }
})();
