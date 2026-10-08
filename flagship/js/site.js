/* Shared behaviour for every Flagship page: chrome, language, cart, checkout, modals, pitch tour. */
(function () {
  const K = window.KANTAN;
  const ROOT = document.documentElement.dataset.root;
  const IMG = K.IMG;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const money = n => 'RM' + n.toFixed(2);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const bloom = (text = '', cls = '') => `<span class="bloom ${cls}"><svg class="bloom__line" aria-hidden="true"><use href="#bloom-line"/></svg><svg class="bloom__fill" aria-hidden="true"><use href="#bloom"/></svg><span class="bloom__text">${text}</span></span>`;

  /* ---------------- language ---------------- */
  let lang = store.get('kantan-lang', 'en');
  const tr = key => (K.t[lang] && K.t[lang][key]) || K.t.en[key] || key;
  function applyLang(scope = document) {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang === 'ms' ? 'ms' : 'en';
    $$('[data-i18n]', scope).forEach(el => { el.textContent = tr(el.dataset.i18n); });
    $$('[data-i18n-ph]', scope).forEach(el => { el.placeholder = tr(el.dataset.i18nPh); });
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
  function setLang(l) {
    lang = l; store.set('kantan-lang', l); applyLang();
    document.dispatchEvent(new CustomEvent('kantan:lang', { detail: l }));
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  /* ---------------- chrome ---------------- */
  const page = document.body.dataset.page;
  const top = `
  <div class="demo-bar"><div class="wrap">
    <span class="demo-bar__label"><svg aria-hidden="true"><use href="#bloom"/></svg><span data-i18n="demo.label">Concept demo of the new kantanfood.com</span></span>
    <button class="tour-toggle" type="button" aria-pressed="false"><span class="tour-toggle__sw" aria-hidden="true"></span><span data-i18n="demo.tour">Show what’s new</span></button>
    <a href="${ROOT}index.html"><span data-i18n="demo.proposal">Read the proposal</span>${icon('i-arrow')}</a>
  </div></div>
  <header class="site-header"><div class="wrap site-header__in">
    <nav class="nav" aria-label="Main">
      <a href="shop.html" data-nav="shop" data-i18n="nav.shop">Shop</a>
      <a href="recipes.html" data-nav="recipes" data-i18n="nav.recipes">Recipes</a>
      <a href="oem.html" data-nav="oem" data-i18n="nav.business">For business</a>
    </nav>
    <button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-expanded="false">${icon('i-menu')}</button>
    <a class="logo" href="index.html" aria-label="Kantan home"><img src="${IMG}brand/logo.webp" alt="Kantan" width="418" height="193"></a>
    <div class="actions">
      <a class="where-link" href="index.html#where">${icon('i-pin')}<span data-i18n="nav.where">Where to buy</span></a>
      <div class="lang" role="group" aria-label="Language" data-feature="lang"><button type="button" data-lang="en">EN</button><button type="button" data-lang="ms">BM</button><button type="button" data-lang="zh">中文</button></div>
      <button class="icon-btn cart-btn" type="button" aria-label="Open cart" data-feature="cart">${icon('i-bag')}<span class="cart-count">0</span></button>
    </div>
  </div></header>
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true" data-lenis-prevent>
    <div class="mobile-menu__top"><img src="${IMG}brand/logo.webp" alt="Kantan" width="110"><button class="icon-btn menu-close" type="button" aria-label="Close menu">${icon('i-close')}</button></div>
    <nav aria-label="Mobile">
      <a href="index.html">Home</a><a href="shop.html" data-i18n="nav.shop">Shop</a><a href="recipes.html" data-i18n="nav.recipes">Recipes</a>
      <a href="oem.html" data-i18n="nav.business">For business</a><a href="wholesale.html">Trade portal</a><a href="index.html#where" data-i18n="nav.where">Where to buy</a>
    </nav>
    <div class="lang" role="group" aria-label="Language" style="align-self:flex-start"><button type="button" data-lang="en">EN</button><button type="button" data-lang="ms">BM</button><button type="button" data-lang="zh">中文</button></div>
  </div>`;

  const year = 2026;
  const foot = `
  <footer class="site-footer">
    <span class="footer-bloom">${bloom('Halal', 'bloom--spin')}</span>
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand"><img src="${IMG}brand/logo.webp" alt="Kantan" width="190">
          <p>Halal Malaysian cooking pastes and OEM manufacturing, made in Subang Jaya since 2020.</p>
          <p class="small">26, Jalan TP 3/2, Subang Jaya, 47620 Selangor<br>+60 13-607 7962 &nbsp; hello@kantanfood.com</p>
        </div>
        <div class="footer-col"><h4 data-i18n="foot.shop">Shop</h4><ul><li><a href="shop.html">All pastes</a></li><li><a href="shop.html#bundle">Build a bundle</a></li><li><a href="shop.html#gifts">Festive gift boxes</a></li><li><a href="shop.html#pantry">Monthly pantry box</a></li></ul></div>
        <div class="footer-col"><h4 data-i18n="foot.cook">Cook</h4><ul><li><a href="recipes.html">Recipes</a></li><li><a href="recipes.html">Video tutorials</a></li><li><a href="product.html">Rendang Paste</a></li></ul></div>
        <div class="footer-col"><h4 data-i18n="foot.biz">Business</h4><ul><li><a href="oem.html">OEM & private label</a></li><li><a href="oem.html#quote">Get a quote</a></li><li><a href="wholesale.html">Trade portal</a></li><li><a href="oem.html#shows">Trade shows</a></li></ul></div>
        <div class="footer-col"><h4 data-i18n="foot.company">Company</h4><ul><li><a href="index.html#story">Our story</a></li><li><a href="oem.html#certs">Certificates</a></li><li><a href="index.html#where">Where to buy</a></li><li><a href="#" data-chat-open>Contact us</a></li></ul></div>
      </div>
      <div class="footer-row">
        <div class="cert-row"><img src="${IMG}brand/cert-halal.webp" alt="Halal Malaysia"><img src="${IMG}brand/cert-mesti.webp" alt="MeSTI"><img src="${IMG}brand/cert-haccp.webp" alt="HACCP"><img src="${IMG}brand/cert-gmp.webp" alt="GMP"></div>
        <div class="pay-row"><b data-i18n="foot.pay">Pay with</b><span>DuitNow QR</span><span>FPX</span><span>Touch ’n Go</span><span>GrabPay</span><span>Visa</span><span>Mastercard</span></div>
      </div>
      <div class="legal"><span>© ${year} Kantan Food Asia Sdn Bhd (202001007266 / 1363586-H)</span><span>Concept demo for discussion. Not the live website.</span></div>
    </div>
  </footer>
  <div class="scrim" id="scrim"></div>
  <aside class="drawer" id="cart" aria-label="Cart" aria-hidden="true">
    <div class="drawer__head"><h2 data-i18n="cart.title">Your cart</h2><button class="icon-btn" type="button" data-close-cart aria-label="Close cart">${icon('i-close')}</button></div>
    <div class="drawer__body" id="cart-lines" data-lenis-prevent></div>
    <div class="drawer__foot">
      <div class="ship-bar" id="ship-bar"><span id="ship-text"></span><div class="ship-bar__track"><div class="ship-bar__fill"></div></div></div>
      <div class="subtotal"><span data-i18n="cart.sub">Subtotal</span><span id="cart-sub">RM0.00</span></div>
      <button class="btn" type="button" id="checkout-btn" data-feature="pay"><span data-i18n="cart.checkout">Check out</span>${icon('i-arrow')}</button>
    </div>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite">${icon('i-check')}<span></span></div>
  <div class="tour-count">${icon('i-sparkle')}<span id="tour-count"></span></div>`;

  document.body.insertAdjacentHTML('afterbegin', top);
  document.body.insertAdjacentHTML('beforeend', foot);
  $$('[data-nav]').forEach(a => { if (a.dataset.nav === page) a.setAttribute('aria-current', 'page'); });

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    if (window.gsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  function scrollToEl(target, offset = -90) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.2 });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.hasAttribute('data-chat-open')) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
    const target = document.getElementById(url.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    history.replaceState(null, '', url.hash);
  });
  window.addEventListener('load', () => {
    if (location.hash) setTimeout(() => scrollToEl(document.getElementById(location.hash.slice(1)), -90), 350);
  });

  /* ---------------- overlays ---------------- */
  const scrim = $('#scrim');
  let openLayer = null;
  /* Lenis stop() already blocks wheel scrolling; hiding overflow as well would trigger a ScrollTrigger refresh and jump the page. */
  function lockScroll(on) { if (lenis) { on ? lenis.stop() : lenis.start(); } else document.documentElement.style.overflow = on ? 'hidden' : ''; }
  function closeLayer() {
    if (!openLayer) return;
    const layer = openLayer; openLayer = null;
    layer.classList.remove('open'); layer.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('show'); lockScroll(false);
    if (layer.dataset.temp) setTimeout(() => layer.remove(), 400);
    if (layer._return) layer._return.focus({ preventScroll: true });
  }
  function showLayer(layer) {
    if (openLayer && openLayer !== layer) closeLayer();
    layer._return = document.activeElement;
    openLayer = layer; layer.classList.add('open'); layer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('show'); lockScroll(true);
    setTimeout(() => { const f = layer.querySelector('input, button, a, [tabindex]'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  scrim.addEventListener('click', closeLayer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLayer(); closeTourPop(); } });

  function modal(html, width = 560) {
    const m = document.createElement('div');
    m.className = 'modal'; m.dataset.temp = '1'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="modal__box" style="--mw:${width}px" data-lenis-prevent><button class="icon-btn modal__close" type="button" aria-label="Close">${icon('i-close')}</button><div class="modal__content">${html}</div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('.modal__close')) closeLayer(); });
    requestAnimationFrame(() => showLayer(m));
    return m;
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.querySelector('span').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* mobile menu */
  const mm = $('#mobile-menu');
  $('.menu-btn').addEventListener('click', () => { mm.classList.add('open'); mm.setAttribute('aria-hidden', 'false'); lockScroll(true); });
  $('.menu-close').addEventListener('click', () => { mm.classList.remove('open'); mm.setAttribute('aria-hidden', 'true'); lockScroll(false); });
  $$('#mobile-menu nav a').forEach(a => a.addEventListener('click', () => { mm.classList.remove('open'); lockScroll(false); }));

  /* ---------------- cart ---------------- */
  const FREE_AT = 50;
  let cart = store.get('kantan-cart', []);
  const product = id => K.byId[id] || K.extras[id];
  const cartTotal = () => cart.reduce((s, l) => s + (product(l.id) ? product(l.id).price * l.qty : 0), 0);

  function renderCart() {
    cart = cart.filter(l => product(l.id) && l.qty > 0);
    store.set('kantan-cart', cart);
    const count = cart.reduce((s, l) => s + l.qty, 0);
    $$('.cart-count').forEach(c => { c.textContent = count; });
    const lines = $('#cart-lines');
    if (!cart.length) {
      lines.innerHTML = `<div class="empty-note"><img src="${IMG}kantan/lineup.webp" alt=""><p data-i18n="cart.empty">${esc(tr('cart.empty'))}</p><a class="btn btn--dark btn--sm" href="shop.html"><span data-i18n="hero.shop">${esc(tr('hero.shop'))}</span></a></div>`;
    } else {
      lines.innerHTML = cart.map(l => {
        const p = product(l.id);
        const sub = l.note ? `<div class="small muted">${esc(l.note)}</div>` : (p.weight ? `<div class="small muted">${p.weight}</div>` : '');
        return `<div class="cart-line" data-id="${l.id}" data-key="${esc(l.key || l.id)}">
          <img src="${p.pack}" alt="">
          <div><h3>${esc(p.name)}</h3>${sub}<div class="price">${money(p.price)}</div></div>
          <div class="qty"><button type="button" data-q="-1" aria-label="Less">${icon('i-minus')}</button><output>${l.qty}</output><button type="button" data-q="1" aria-label="More">${icon('i-plus')}</button></div>
        </div>`;
      }).join('');
    }
    const total = cartTotal();
    $('#cart-sub').textContent = money(total);
    const bar = $('#ship-bar');
    const pct = Math.min(100, (total / FREE_AT) * 100);
    bar.style.setProperty('--p', pct + '%');
    bar.querySelector('.ship-bar__fill').style.width = pct + '%';
    bar.classList.toggle('done', total >= FREE_AT);
    $('#ship-text').textContent = total >= FREE_AT ? tr('cart.free') : `${money(FREE_AT - total)} ${tr('cart.more')}`;
    $('#checkout-btn').disabled = !cart.length;
  }
  $('#cart-lines').addEventListener('click', e => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const key = b.closest('.cart-line').dataset.key;
    const line = cart.find(l => (l.key || l.id) === key);
    if (line) { line.qty += Number(b.dataset.q); renderCart(); }
  });

  function flyFrom(srcEl) {
    if (reduced || !srcEl) return;
    const target = $('.cart-btn');
    const s = srcEl.getBoundingClientRect(), t = target.getBoundingClientRect();
    if (!s.width) return;
    const img = document.createElement('img');
    img.className = 'fly'; img.src = srcEl.currentSrc || srcEl.src; img.alt = '';
    img.style.left = (s.left + s.width / 2 - 35) + 'px'; img.style.top = (s.top + s.height / 2 - 35) + 'px';
    document.body.appendChild(img);
    const dx = t.left + t.width / 2 - (s.left + s.width / 2), dy = t.top + t.height / 2 - (s.top + s.height / 2);
    img.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * .55}px, ${dy - 120}px) scale(.8) rotate(-12deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.25) rotate(8deg)`, opacity: .6 }
    ], { duration: 820, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => {
      img.remove();
      $$('.cart-count').forEach(c => { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); });
    };
  }

  function addToCart(id, qty = 1, srcEl, opts = {}) {
    const key = opts.key || id;
    const line = cart.find(l => (l.key || l.id) === key);
    if (line) line.qty += qty; else cart.push({ id, qty, key, note: opts.note });
    renderCart();
    flyFrom(srcEl);
    const p = product(id);
    toast(`${tr('cart.added')}: ${p.name}`);
  }
  function openCart() { showLayer($('#cart')); }
  $('.cart-btn').addEventListener('click', openCart);
  $('[data-close-cart]').addEventListener('click', closeLayer);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    e.preventDefault();
    const src = b.dataset.srcImg ? $(b.dataset.srcImg) : (b.closest('[data-card]') || b.parentElement).querySelector('img');
    addToCart(b.dataset.add, Number(b.dataset.qty || 1), src);
  });

  /* ---------------- checkout ---------------- */
  $('#checkout-btn').addEventListener('click', () => {
    const total = cartTotal();
    const ship = total >= FREE_AT ? 0 : 8;
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const m = modal(`
      <h2 class="h3">Checkout</h2>
      <p class="small muted">Delivering to Nur Aisyah, Jalan SS 15/4, Subang Jaya (demo address)</p>
      <div class="brief" style="margin-top:14px">
        <div><dt>${count} item${count > 1 ? 's' : ''}</dt><dd>${money(total)}</dd></div>
        <div><dt>Shipping</dt><dd>${ship ? money(ship) + ' (West Malaysia)' : 'Free (West Malaysia)'}</dd></div>
        <div><dt>Total</dt><dd><b>${money(total + ship)}</b></dd></div>
      </div>
      <fieldset class="pay-opts" style="border:0;padding:0"><legend class="label" style="font-weight:800;margin-bottom:8px">Pay with</legend>
        <label class="pay-opt"><input type="radio" name="pay" value="duitnow" checked>${icon('i-qr')}<span>DuitNow QR<small>Scan with any Malaysian bank or e-wallet app</small></span></label>
        <label class="pay-opt"><input type="radio" name="pay" value="fpx">${icon('i-bank')}<span>FPX online banking<small>Maybank2u, CIMB Clicks, Public Bank and more</small></span></label>
        <label class="pay-opt"><input type="radio" name="pay" value="tng">${icon('i-wallet')}<span>Touch ’n Go eWallet or GrabPay</span></label>
        <label class="pay-opt"><input type="radio" name="pay" value="card">${icon('i-card')}<span>Visa or Mastercard</span></label>
      </fieldset>
      <button class="btn" type="button" style="width:100%" data-pay>Pay ${money(total + ship)}</button>
      <p class="small muted" style="text-align:center;margin:10px 0 0">Runs through Kantan’s existing senangPay account. Payment is confirmed instantly.</p>`, 520);
    $('[data-pay]', m).addEventListener('click', () => {
      const method = $('input[name="pay"]:checked', m).value;
      const box = $('.modal__content', m);
      if (method === 'duitnow') {
        box.innerHTML = `<h2 class="h3">Scan to pay</h2><p class="small muted">Open any banking or e-wallet app and scan.</p>
          <div style="display:grid;place-items:center;margin:18px 0"><div id="pay-qr" style="padding:12px;background:#fff;border-radius:16px;border:1.5px solid var(--pandan)"></div></div>
          <p style="text-align:center;font-weight:700">Waiting for payment… <span class="small muted">(the demo confirms by itself)</span></p>`;
        if (window.QRCode) new QRCode($('#pay-qr', m), { text: 'Kantan concept demo - not a real payment', width: 180, height: 180, colorDark: '#173A29', colorLight: '#ffffff' });
        setTimeout(() => paid(box, total + ship), 2600);
      } else {
        box.innerHTML = `<div class="paid"><span class="typing"><i></i><i></i><i></i></span><p style="font-weight:700">${method === 'fpx' ? 'Connecting to your bank…' : 'Confirming payment…'}</p></div>`;
        setTimeout(() => paid(box, total + ship), 1700);
      }
    });
  });
  function paid(box, amount) {
    const ref = 'KF-26-' + String(Math.floor(10000 + Math.random() * 89999));
    box.innerHTML = `<div class="paid">${bloom('✓')}<h2 class="h3">Order ${ref} confirmed</h2>
      <p class="small muted" style="margin:0">${money(amount)} received instantly. There is no receipt to email. A WhatsApp update is on its way.</p>
      <ol class="track" style="list-style:none;padding:0">
        <li class="done"><span><b>Paid</b><br><span class="small muted">Just now</span></span></li>
        <li><span><b>Packing in Subang Jaya</b><br><span class="small muted">Today</span></span></li>
        <li><span><b>Shipped with tracking</b><br><span class="small muted">Tracking link sent on WhatsApp</span></span></li>
        <li><span><b>Delivered</b><br><span class="small muted">Usually 1–3 working days in West Malaysia</span></span></li>
      </ol>
      <button class="btn btn--dark" type="button" data-done>Continue shopping</button></div>`;
    cart = []; renderCart();
    box.querySelector('[data-done]').addEventListener('click', closeLayer);
  }

  /* ---------------- pitch tour ---------------- */
  let tourOn = store.get('kantan-tour', false);
  const pop = document.createElement('div');
  pop.className = 'tour-pop'; pop.hidden = true; pop.setAttribute('role', 'dialog');
  document.body.appendChild(pop);
  function closeTourPop() { pop.hidden = true; }
  function buildTour() {
    $$('.tour-dot').forEach(d => d.remove());
    const els = $$('[data-feature]').filter(el => K.features[el.dataset.feature] && el.offsetParent !== null);
    els.forEach((el, i) => {
      const cs = getComputedStyle(el);
      if (cs.position === 'static') el.style.position = 'relative';
      const small = el.offsetHeight < 140;
      const dot = document.createElement('button');
      dot.type = 'button'; dot.className = 'tour-dot';
      dot.style.setProperty('--tx', small ? '-14px' : '14px');
      dot.style.setProperty('--ty', small ? '-16px' : '14px');
      dot.setAttribute('aria-label', 'What’s new: ' + K.features[el.dataset.feature][0]);
      dot.innerHTML = `<svg aria-hidden="true"><use href="#bloom"/></svg><span>${i + 1}</span>`;
      dot.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); showTourPop(dot, el.dataset.feature); });
      if (el.matches('img, input, svg')) el.parentElement.appendChild(dot); else el.appendChild(dot);
    });
    $('#tour-count').textContent = `${els.length} new features on this page. Tap a pink flower.`;
  }
  function showTourPop(dot, key) {
    const [title, body, tier] = K.features[key];
    pop.innerHTML = `<button type="button" aria-label="Close">${icon('i-close')}</button><span class="tier tier--${tier}">In ${tier}</span><h3>${esc(title)}</h3><p>${esc(body)}</p>`;
    pop.hidden = false;
    pop.querySelector('button').onclick = closeTourPop;
    const r = dot.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight;
    let x = Math.min(window.innerWidth - w - 12, Math.max(12, r.left - 10));
    let y = r.bottom + 10;
    if (y + h > window.innerHeight - 12) y = Math.max(12, r.top - h - 10);
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
  }
  function setTour(on) {
    tourOn = on; store.set('kantan-tour', on);
    document.body.classList.toggle('tour-on', on);
    $('.tour-toggle').setAttribute('aria-pressed', String(on));
    closeTourPop();
    if (on) buildTour();
  }
  $('.tour-toggle').addEventListener('click', () => setTour(!tourOn));
  document.addEventListener('click', e => { if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('.tour-dot')) closeTourPop(); });
  window.addEventListener('scroll', closeTourPop, { passive: true });
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (tourOn) buildTour(); }, 300); });

  /* ---------------- shared bits ---------------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (b) setLang(b.dataset.lang);
  });
  function chilis(n) { return `<span class="chilis" role="img" aria-label="Spice level ${n} of 3">${[1, 2, 3].map(i => i > n ? icon('i-chili', 'icon off') : icon('i-chili-fill', 'icon on')).join('')}</span>`; }
  function facts(f, opts = {}) {
    return `<div class="facts">
      <span class="fact">${icon('i-users')}<span><span data-i18n="fl.serves">${tr('fl.serves')}</span> ${f.serves}</span></span>
      <span class="fact">${chilis(f.spice)}</span>
      <span class="fact">${icon('i-clock')}<span>${f.time} <span data-i18n="fl.min">${tr('fl.min')}</span></span></span>
    </div>`;
  }

  window.Site = { $, $$, icon, money, esc, bloom, tr, applyLang, addToCart, openCart, modal, closeLayer, showLayer, toast, store, scrollToEl, chilis, facts, reduced, get lenis() { return lenis; }, get lang() { return lang; }, refreshTour() { if (tourOn) buildTour(); } };

  applyLang();
  renderCart();
  if (tourOn) { document.body.classList.add('tour-on'); $('.tour-toggle').setAttribute('aria-pressed', 'true'); }
  window.addEventListener('load', () => { if (tourOn) buildTour(); });
})();
