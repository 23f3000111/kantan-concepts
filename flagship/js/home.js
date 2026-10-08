/* Home page: hero entrance, flavour showcase, steps line, counters, recipes, reviews, map, club form. */
(function () {
  const K = window.KANTAN, S = window.Site;
  const { $, $$, icon, money, esc, tr } = S;
  const motion = !S.reduced && window.gsap && window.ScrollTrigger;

  /* ---------- hero: the one orchestrated load moment ---------- */
  if (motion) {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero-in', { opacity: 1, y: 0, duration: 1.2, stagger: .14 })
      .from('.hero__seal', { scale: 0, rotate: -120, duration: 1.1 }, .35)
      .from('.hero__pack', { y: 70, rotate: -24, opacity: 0, duration: 1.2 }, .45);
  } else {
    $$('.hero-in').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ---------- flavour showcase ---------- */
  const F = K.flavours, n = F.length;
  const sec = $('#flavours'), stage = $('.flavours__stage', sec);
  const texts = $('.flavours__texts', sec), visual = $('.flavours__visual', sec), index = $('.flavours__index', sec);

  texts.innerHTML = F.map((f, i) => `
    <article class="fl-text" data-i="${i}" style="--c:${f.flood};--ci:${f.ink}" aria-hidden="true">
      <h3 class="fl-text__name"><a href="product.html?f=${f.id}" style="text-decoration:none">${esc(f.short)}</a></h3>
      <p class="fl-text__alt"><span lang="ms">${esc(f.ms)}</span><span class="zh" lang="zh">${esc(f.zh)}</span></p>
      <p class="fl-text__line">${esc(f.line)}</p>
      ${S.facts(f)}
      <div class="fl-buy">
        <span class="fl-price">${money(f.price)}</span>
        <button class="btn btn--flood" type="button" data-add="${f.id}" data-src-img="#fl-pack-${i} img"><span data-i18n="fl.add">${tr('fl.add')}</span>${icon('i-bag')}</button>
        <a class="link-arrow" href="recipes.html#${f.recipe}"><span data-i18n="fl.recipe">${tr('fl.recipe')}</span>${icon('i-arrow')}</a>
      </div>
    </article>`).join('');
  visual.innerHTML = F.map((f, i) => `<div class="fl-dish" data-i="${i}"><img src="${f.dish}" alt="" loading="lazy"></div>`).join('') +
    F.map((f, i) => `<div class="fl-pack" id="fl-pack-${i}" data-i="${i}"><img src="${f.pack}" alt="${esc(f.name)} pack" loading="${i ? 'lazy' : 'eager'}"></div>`).join('');
  index.innerHTML = F.map((f, i) => `<button type="button" data-go="${i}" aria-current="false"><i style="--c:${f.flood}"></i>${esc(f.short)}</button>`).join('');

  let cur = -1;
  function setActive(i) {
    if (i === cur) return;
    cur = i;
    const f = F[i];
    stage.style.setProperty('--flood', f.flood);
    stage.style.setProperty('--fink', f.ink);
    $$('.fl-text', texts).forEach((el, j) => { const on = j === i; el.classList.toggle('is-active', on); el.setAttribute('aria-hidden', String(!on)); el.inert = !on; });
    $$('.fl-pack, .fl-dish', visual).forEach(el => el.classList.toggle('is-active', Number(el.dataset.i) === i));
    $$('button', index).forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
    $('.cur', sec).textContent = String(i + 1).padStart(2, '0');
    const btn = index.children[i];
    if (btn) index.scrollTo({ left: btn.offsetLeft - index.clientWidth / 2 + btn.clientWidth / 2, behavior: 'smooth' });
  }
  setActive(0);

  let st = null;
  if (motion) {
    st = ScrollTrigger.create({
      trigger: stage, pin: true, start: () => 'top ' + $('.site-header').offsetHeight,
      end: () => '+=' + (n - 1) * window.innerHeight * 0.7,
      snap: { snapTo: 1 / (n - 1), duration: { min: .2, max: .6 }, delay: .08, ease: 'power2.inOut' },
      onUpdate: self => {
        setActive(Math.round(self.progress * (n - 1)));
        visual.style.setProperty('--rot', (self.progress * 260).toFixed(1) + 'deg');
      }
    });
  } else {
    sec.classList.add('flavours--static');
    $$('.fl-text', texts).forEach(el => { el.classList.add('is-active'); el.setAttribute('aria-hidden', 'false'); el.inert = false; });
  }
  index.addEventListener('click', e => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    const i = Number(b.dataset.go);
    if (st) {
      const y = st.start + (st.end - st.start) * (i / (n - 1)) + 2;
      if (S.lenis) S.lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y });
    } else setActive(i);
  });

  /* ---------- steps: the reference's hand-drawn arrow, drawn on scroll ---------- */
  const path = $('.squiggle__path'), head = $('.squiggle__head');
  if (path && motion) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len; path.style.strokeDashoffset = len; head.style.opacity = 0;
    ScrollTrigger.create({
      trigger: '.steps', start: 'top 75%', end: 'top 15%', scrub: .6,
      onUpdate: self => { path.style.strokeDashoffset = len * (1 - self.progress); head.style.opacity = self.progress > .96 ? 1 : 0; }
    });
  }

  /* ---------- counters ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const el = en.target, end = Number(el.dataset.count), suf = el.dataset.suffix || '';
    if (S.reduced) { el.textContent = end + suf; return; }
    const t0 = performance.now(), dur = 1500;
    const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => io.observe(el));

  /* ---------- recipes ---------- */
  $('#home-recipes').innerHTML = ['rendang-chicken', 'assam-laksa', 'satay-chicken'].map(id => {
    const r = K.recipes.find(x => x.id === id), f = K.byId[r.paste];
    return `<a class="recipe-card" href="recipes.html#${r.id}">
      <div class="recipe-card__img"><img src="${f.photo}" alt="${esc(r.title)}" loading="lazy" width="480" height="480"><span class="play">${icon('i-play')}</span></div>
      <h3>${esc(r.title)}</h3>
      <div class="recipe-meta"><span>${icon('i-users')}<span data-i18n="rec.serves">${tr('rec.serves')}</span> ${r.serves}</span><span>${icon('i-clock')}${r.mins} <span data-i18n="rec.mins">${tr('rec.mins')}</span></span><span>${icon('i-bowl')}${esc(f.short)}</span></div>
    </a>`;
  }).join('');

  /* ---------- reviews (real quotes from Kantan's marketplace store) ---------- */
  const stars = `<span class="stars" aria-label="5 out of 5">${icon('i-star').repeat(5)}</span>`;
  const rv = K.reviews.map(r => `<figure class="review">${stars}<q${r.lang ? ` lang="${r.lang}"` : ''}>${esc(r.text)}</q><cite>${esc(r.who)}, verified buyer</cite></figure>`);
  const ph = (src, alt) => `<div class="review-photo"><img src="${K.IMG}${src}" alt="${alt}" loading="lazy"></div>`;
  $('#home-reviews').innerHTML = [rv[0], ph('kantan/shopper.webp', 'A customer holding a Kantan Curry Laksa pack'), rv[1], rv[2], ph('photos/rendang.webp', 'Beef rendang in a blue and white bowl'), rv[3], rv[4], rv[6], ph('photos/curry-chicken.webp', 'Curry chicken in a white bowl'), rv[5]].join('');

  /* ---------- where to buy ---------- */
  const W = {
    stores: [
      { t: 'MaxValu', s: 'Every outlet in Malaysia', ll: [3.12, 101.64], z: 10 },
      { t: 'AEON', s: 'Selected stores', ll: [3.07, 101.6], z: 10 },
      { t: 'Kantan kitchen, Subang Jaya', s: '26, Jalan TP 3/2, 47620 Selangor', ll: [3.0405, 101.5855], z: 14 }
    ],
    online: [
      { t: 'kantanfood.com', s: 'Free shipping over RM50 in West Malaysia', ll: [3.6, 102.2], z: 6 },
      { t: 'WhatsApp orders', s: '+60 13-607 7962', ll: [3.0405, 101.5855], z: 11 }
    ],
    dist: [
      { t: 'East Malaysia and Brunei', s: 'Miri, Bintulu, Sabah and Brunei', ll: [4.5, 114.6], z: 7 },
      { t: 'Singapore', s: 'Alfon International Pte Ltd', ll: [1.3521, 103.8198], z: 11 },
      { t: 'Hong Kong', s: 'Distribution partner', ll: [22.3193, 114.1694], z: 11 },
      { t: 'Indonesia', s: 'Distribution partner, Jakarta', ll: [-6.2088, 106.8456], z: 10 }
    ]
  };
  const pins = [
    { ll: [3.0405, 101.5855], t: '<b>Kantan kitchen</b><br>Subang Jaya, Selangor', hq: true },
    { ll: [4.3995, 113.9914], t: '<b>Miri</b><br>East Malaysia distributor' },
    { ll: [3.17, 113.0419], t: '<b>Bintulu</b><br>East Malaysia distributor' },
    { ll: [5.9804, 116.0735], t: '<b>Sabah</b><br>East Malaysia distributor' },
    { ll: [4.9031, 114.9398], t: '<b>Brunei</b><br>Distributor' },
    { ll: [1.3521, 103.8198], t: '<b>Singapore</b><br>Alfon International Pte Ltd' },
    { ll: [22.3193, 114.1694], t: '<b>Hong Kong</b><br>Distribution partner' },
    { ll: [-6.2088, 106.8456], t: '<b>Indonesia</b><br>Distribution partner' }
  ];
  let map = null;
  const list = $('#where-list');
  function renderWhere(key) {
    $$('[data-where]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.where === key)));
    list.innerHTML = W[key].map((p, i) => `<li tabindex="0" data-i="${i}" data-k="${key}">${icon(key === 'online' ? 'i-bag' : key === 'dist' ? 'i-truck' : 'i-pin')}<div><b>${esc(p.t)}</b><span>${esc(p.s)}</span></div></li>`).join('');
  }
  function fly(key, i) {
    const p = W[key][i];
    $$('li', list).forEach(li => li.classList.toggle('is-on', Number(li.dataset.i) === i));
    if (map) map.flyTo(p.ll, p.z, { duration: S.reduced ? 0 : 1.2 });
  }
  $$('[data-where]').forEach(b => b.addEventListener('click', () => { renderWhere(b.dataset.where); fly(b.dataset.where, 0); }));
  list.addEventListener('click', e => { const li = e.target.closest('li'); if (li) fly(li.dataset.k, Number(li.dataset.i)); });
  list.addEventListener('keydown', e => { const li = e.target.closest('li'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); fly(li.dataset.k, Number(li.dataset.i)); } });
  renderWhere('stores');

  function initMap() {
    if (map || !window.L) return;
    map = L.map('map', { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([3.6, 106], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18
    }).addTo(map);
    const mk = hq => L.divIcon({ className: 'map-pin' + (hq ? ' hq' : ''), html: `<svg aria-hidden="true"><use href="#bloom"/></svg>`, iconSize: hq ? [40, 40] : [30, 30] });
    pins.forEach(p => L.marker(p.ll, { icon: mk(p.hq), title: p.t.replace(/<[^>]+>/g, ' ') }).addTo(map).bindPopup(p.t));
    L.circle([3.1, 101.62], { radius: 26000, color: '#D91B5C', weight: 1.5, fillColor: '#D91B5C', fillOpacity: .12 }).addTo(map).bindPopup('<b>MaxValu & AEON</b><br>Klang Valley and beyond');
    map.setView([4, 108.5], 5);
  }
  const mio = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { initMap(); mio.disconnect(); } }, { rootMargin: '400px' });
  mio.observe($('#map'));

  /* ---------- recipe club ---------- */
  $('#club-form').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); S.toast(tr('club.done')); });

  window.addEventListener('load', () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); S.refreshTour(); });
})();
