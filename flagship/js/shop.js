/* Shop: filterable grid, build-your-own bundle, gift boxes, pantry subscription. */
(function () {
  const K = window.KANTAN, S = window.Site;
  const { $, $$, icon, money, esc } = S;
  const F = K.flavours;

  /* ---------- grid ---------- */
  const grid = $('#grid');
  let filter = 'all', sort = 'featured';
  function card(f) {
    return `<article class="p-card" data-card style="--c:${f.flood}">
      <a class="p-card__img" href="product.html?f=${f.id}" aria-label="${esc(f.name)}"><img class="packimg" src="${f.pack}" alt="" loading="lazy" width="380" height="380"><img class="dish" src="${f.dish}" alt="" loading="lazy" width="300" height="300"></a>
      <h3><a href="product.html?f=${f.id}">${esc(f.short)}</a></h3>
      <p class="alt" style="display:flex;flex-wrap:wrap;gap:4px 12px;margin:-4px 0 0"><span lang="ms">${esc(f.ms)}</span><span lang="zh">${esc(f.zh)}</span><span>${f.weight}</span></p>
      ${S.facts(f)}
      <div class="p-card__row"><span class="p-card__price">${money(f.price)}</span>
        <button class="add-round" type="button" data-add="${f.id}" data-src-img="" aria-label="Add ${esc(f.short)} to cart">${icon('i-plus')}</button></div>
    </article>`;
  }
  function renderGrid() {
    let list = F.filter(f => filter === 'all' || f.group === filter);
    if (sort === 'mild') list = [...list].sort((a, b) => a.spice - b.spice);
    if (sort === 'hot') list = [...list].sort((a, b) => b.spice - a.spice);
    if (sort === 'quick') list = [...list].sort((a, b) => a.time - b.time);
    grid.innerHTML = list.map(card).join('');
    $$('.add-round', grid).forEach(b => { b.dataset.srcImg = ''; });
    S.applyLang(grid);
    S.refreshTour();
  }
  $$('[data-filter]').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    $$('[data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderGrid();
  }));
  $('#sort').addEventListener('change', e => { sort = e.target.value; renderGrid(); });
  renderGrid();

  /* ---------- bundle builder ---------- */
  let size = 6;
  const picks = {};
  const PRICE = { 6: 45.6, 18: 137.8 };
  $('#pick').innerHTML = F.map(f => `<div class="pick" data-id="${f.id}">
      <img src="${f.pack}" alt="" loading="lazy" width="380" height="380"><b>${esc(f.short)}</b>
      <div class="qty"><button type="button" data-b="-1" aria-label="One less ${esc(f.short)}">${icon('i-minus')}</button><output>0</output><button type="button" data-b="1" aria-label="One more ${esc(f.short)}">${icon('i-plus')}</button></div>
    </div>`).join('');
  const count = () => Object.values(picks).reduce((a, b) => a + b, 0);
  function renderBundle() {
    const c = count();
    $('#b-count').textContent = c >= size ? `All ${size} picked` : `${c} of ${size} picked`;
    const order = F.flatMap(f => Array(picks[f.id] || 0).fill(f));
    $('#slots').innerHTML = Array.from({ length: size }, (_, i) => `<span>${order[i] ? `<img src="${order[i].pack}" alt="${esc(order[i].short)}">` : ''}</span>`).join('');
    $$('.pick').forEach(p => { p.querySelector('output').textContent = picks[p.dataset.id] || 0; });
    $('#b-price').textContent = money(PRICE[size]);
    $('#b-was').textContent = money(size * 13.9);
    $('#b-save').textContent = 'You save ' + money(size * 13.9 - PRICE[size]);
    $('#b-add').disabled = c !== size;
  }
  $('#pick').addEventListener('click', e => {
    const b = e.target.closest('[data-b]');
    if (!b) return;
    const id = b.closest('.pick').dataset.id, d = Number(b.dataset.b);
    if (d > 0 && count() >= size) { S.toast(`Your ${size}-pack is full. Switch to 18 for more.`); return; }
    picks[id] = Math.max(0, (picks[id] || 0) + d);
    renderBundle();
  });
  $$('[data-size]').forEach(b => b.addEventListener('click', () => {
    size = Number(b.dataset.size);
    $$('[data-size]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    while (count() > size) { const id = Object.keys(picks).reverse().find(k => picks[k] > 0); picks[id]--; }
    renderBundle();
  }));
  $('#b-fill').addEventListener('click', () => {
    let left = size - count();
    while (left-- > 0) { const f = F[Math.floor(Math.random() * F.length)]; picks[f.id] = (picks[f.id] || 0) + 1; }
    renderBundle();
  });
  $('#b-add').addEventListener('click', () => {
    const note = F.filter(f => picks[f.id]).map(f => `${picks[f.id]}× ${f.short}`).join(', ');
    S.addToCart('bundle-' + size, 1, $('#slots img'), { key: 'bundle-' + size + '-' + Date.now(), note });
    Object.keys(picks).forEach(k => { picks[k] = 0; });
    renderBundle();
  });
  renderBundle();

  /* ---------- festive gift boxes ---------- */
  const gifts = [
    { id: 'gift-raya', icon: 'i-gift', title: 'Raya open house', body: 'Rendang, satay, meat curry, assam pedas, fish curry and shrimp sambal, with recipe cards.', price: 'RM59', bg: 'var(--pandan)', fg: 'var(--santan)' },
    { id: 'gift-cny', icon: 'i-gift', title: 'Reunion dinner', body: 'Curry laksa, prawn mee, assam laksa and siam laksa for a noodle night with the family.', price: 'RM59', bg: 'var(--kantan)', fg: '#fff', btn: 'var(--pandan)' },
    { id: 'gift-deepavali', icon: 'i-sun', title: 'Deepavali feast', body: 'Fish curry, meat curry, rendang and sambal in a gift sleeve made for visiting.', price: 'RM59', bg: 'var(--kunyit)', fg: 'var(--pandan-2)' },
    { id: null, icon: 'i-box', title: 'Corporate gifting', body: 'Fifty boxes or more with your company’s sleeve and a card. Quoted on WhatsApp within a day.', price: 'From 50 boxes', bg: 'var(--daun)', fg: 'var(--pandan)' }
  ];
  $('#gift-cards').innerHTML = gifts.map(g => `<article class="f-card" data-card style="background:${g.bg};color:${g.fg};border-color:var(--pandan)">
      <span class="tag" style="justify-self:start">Concept</span>
      <img src="${K.IMG}kantan/lineup.webp" alt="" loading="lazy" style="width:100%;margin-block:6px">
      <h3 style="color:inherit">${esc(g.title)}</h3><p style="color:inherit;opacity:.88">${esc(g.body)}</p>
      <div class="p-card__row" style="padding:0"><span class="f-card__price">${g.price}</span>
      ${g.id ? `<button class="add-round" type="button" data-add="${g.id}" aria-label="Add ${esc(g.title)} box to cart" style="${g.btn ? `background:${g.btn}` : ''}">${icon('i-plus')}</button>` : `<button class="btn btn--sm btn--dark" type="button" data-chat-open>Ask us</button>`}</div>
    </article>`).join('');

  /* ---------- pantry subscription ---------- */
  let freq = 1;
  $$('[data-freq]').forEach(b => b.addEventListener('click', () => {
    freq = Number(b.dataset.freq);
    $$('[data-freq]').forEach(x => { const on = x === b; x.setAttribute('aria-pressed', String(on)); x.style.background = on ? 'var(--santan)' : ''; x.style.color = on ? 'var(--pandan)' : 'var(--santan)'; });
  }));
  $('[data-freq="1"]').click();
  $('#sub-btn').addEventListener('click', () => S.addToCart('pantry', 1, $('#pantry img'), { key: 'pantry', note: freq === 1 ? 'Delivered every month' : 'Delivered every 2 months' }));
})();
