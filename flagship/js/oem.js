/* OEM page: quote builder, process line, certificates, factory tour, catalogue gate, meeting booking, booth QR. */
(function () {
  const K = window.KANTAN, S = window.Site;
  const { $, $$, icon, esc } = S;
  const IMG = K.IMG;

  const ready = [
    ['fish-curry', 'Fish curry'], ['rendang', 'Rendang'], ['assam-laksa', 'Assam laksa'], ['prawn-mee', 'Prawn mee'],
    ['curry-laksa', 'Penang curry laksa'], ['assam-pedas', 'Assam pedas'], ['satay', 'Satay'], ['nasi-lemak', 'Nasi lemak sambal'],
    ['sambal', 'Dried shrimp sambal'], ['meat-curry', 'Meat curry'], ['siam-laksa', 'Siam laksa'], ['spice-platter', 'Your own recipe']
  ];
  $('#dish-wall').innerHTML = ready.map(([id, name]) => `<figure><img src="${IMG}dishes/${id}.webp" alt="" loading="lazy" width="300" height="300"><figcaption>${esc(name)}</figcaption></figure>`).join('');
  $('#q-dishes').innerHTML = ready.map(([id, name]) => `<label><input type="checkbox" name="dish" value="${esc(name)}"><img src="${IMG}dishes/${id}.webp" alt="" loading="lazy">${esc(name)}</label>`).join('');

  /* ---------- quote builder ---------- */
  const form = $('#q-form'), panels = $$('.q-panel', form), stepsEl = $$('#q-steps li');
  const back = $('#q-back'), next = $('#q-next'), err = $('#q-error');
  let step = 1;
  const val = name => { const el = form.querySelector(`[name="${name}"]:checked`); return el ? el.value : ''; };
  const vol = $('#q-vol');
  function updateVol() {
    const v = Number(vol.value);
    $('#q-vol-out').textContent = `${v.toLocaleString('en-MY')} kg a month`;
    $('#q-cartons').textContent = `About ${Math.max(1, Math.round(v / 10)).toLocaleString('en-MY')} cartons a month`;
  }
  vol.addEventListener('input', updateVol); updateVol();
  $('#q-file-in').addEventListener('change', e => { const f = e.target.files[0]; if (f) $('#q-file').textContent = f.name; });

  function go(n) {
    step = n;
    panels.forEach(p => p.classList.toggle('is-on', Number(p.dataset.step) === n));
    stepsEl.forEach((li, i) => { li.classList.toggle('is-on', i + 1 === Math.min(n, 5)); li.classList.toggle('is-done', i + 1 < n); });
    back.hidden = n === 1 || n === 7;
    next.hidden = n === 7;
    next.textContent = n === 5 ? 'Review brief' : n === 6 ? 'Send brief' : 'Next';
    err.textContent = '';
    if (n === 6) {
      const dishes = $$('[name="dish"]:checked', form).map(x => x.value).join(', ');
      const rows = [['Need', val('need')], ['Pastes', dishes], ['Pack', val('pack')], ['Volume', $('#q-vol-out').textContent], ['Timeline', val('when') || 'Not set'],
        ['Market', $('#q-market').value], ['Contact', `${$('#q-name').value}, ${$('#q-co').value}, ${$('#q-wa').value}`]];
      $('#q-brief').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
    }
    if (n === 7) $('#q-ref').textContent = 'Brief KF-OEM-' + (2600 + Math.floor(Math.random() * 99)) + ' received';
    const top = form.getBoundingClientRect().top;
    if (top < 80) S.scrollToEl($('#quote .quote'), -100);
  }
  function check() {
    if (step === 1 && !val('need')) return 'Choose what you need.';
    if (step === 2 && !$$('[name="dish"]:checked', form).length) return 'Pick at least one paste.';
    if (step === 5) {
      const missing = ['#q-name', '#q-co', '#q-wa'].filter(s => !$(s).value.trim());
      $$('#q-name, #q-co, #q-wa').forEach(el => el.closest('.field').classList.toggle('err', !el.value.trim()));
      if (missing.length) return 'Add your name, company and WhatsApp number.';
    }
    return '';
  }
  next.addEventListener('click', () => { const m = check(); if (m) { err.textContent = m; return; } go(step + 1); });
  back.addEventListener('click', () => go(step - 1));
  form.addEventListener('submit', e => e.preventDefault());
  $('#q-pdf').addEventListener('click', () => S.toast('Demo: the live site emails a PDF of this brief.'));

  /* ---------- process line ---------- */
  const line = $('.proc-line');
  if (line && !S.reduced && window.ScrollTrigger) {
    gsap.to(line, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.process', start: 'top 80%', end: 'top 35%', scrub: .5 } });
  } else if (line) line.style.strokeDashoffset = 0;

  /* ---------- counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target, end = Number(el.dataset.count), suf = el.dataset.suffix || '', t0 = performance.now();
    const tick = t => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
    S.reduced ? (el.textContent = end + suf) : requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => io.observe(el));

  /* ---------- certificates ---------- */
  const certs = {
    halal: ['Halal Malaysia', 'cert-halal', [['Issued by', 'JAKIM, Department of Islamic Development Malaysia'], ['Standard', 'MS1500'], ['Reference', '1 065-01/2022'], ['Covers', 'All Kantan retail and OEM pastes']]],
    mesti: ['MeSTI', 'cert-mesti', [['Issued by', 'Ministry of Health Malaysia'], ['Scheme', 'Makanan Selamat Tanggungjawab Industri'], ['Covers', 'Food safety at the Subang Jaya kitchen']]],
    haccp: ['HACCP', 'cert-haccp', [['Certificate', 'SCSB/HACCP/1063'], ['Covers', 'Hazard analysis and critical control points in production']]],
    gmp: ['GMP', 'cert-gmp', [['Issued by', 'Food Safety, Ministry of Health Malaysia'], ['Covers', 'Good manufacturing practice across the kitchen']]]
  };
  $$('[data-cert]').forEach(b => b.addEventListener('click', () => {
    const [title, img, rows] = certs[b.dataset.cert];
    S.modal(`<div style="display:flex;gap:16px;align-items:center;margin-bottom:16px"><img src="${IMG}brand/${img}.webp" alt="" style="height:70px;width:auto"><h2 class="h3" style="margin:0">${title}</h2></div>
      <dl class="brief">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}<div><dt>Valid until</dt><dd>Shown on the certificate PDF</dd></div></dl>
      <button class="btn" type="button" style="margin-top:16px" onclick="Site.toast('Demo: opens the scanned certificate PDF.')">${icon('i-file')}View certificate PDF</button>`, 520);
  }));

  /* ---------- factory tour ---------- */
  $('#tour-play').addEventListener('click', () => S.modal(`<h2 class="h3">Factory tour</h2>
    <div class="video-frame" style="margin:14px 0"><img src="${IMG}kantan/factory-retort.webp" alt=""></div>
    <p class="lede">This 90-second tour is filmed during the Flagship photo and video shoot: the spice room, cooking kettles, filling, sealing and the retort steriliser.</p>`, 720));

  /* ---------- catalogue gate ---------- */
  $('#cat-form').addEventListener('submit', e => {
    e.preventDefault();
    const mail = $('#cat-mail'), co = $('#cat-co');
    const ok = /\S+@\S+\.\S+/.test(mail.value) && co.value.trim();
    mail.closest('.field').classList.toggle('err', !/\S+@\S+\.\S+/.test(mail.value));
    co.closest('.field').classList.toggle('err', !co.value.trim());
    if (!ok) { S.toast('Add a work email and company name.'); return; }
    e.target.outerHTML = `<p class="lede" style="display:flex;gap:10px;align-items:center">${icon('i-check')}Sent. The catalogue is on its way to ${esc(mail.value)}.</p>`;
  });

  /* ---------- meeting booking ---------- */
  function days() {
    const out = [], d = new Date();
    while (out.length < 6) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) out.push(new Date(d)); }
    return out;
  }
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-book]')) return;
    const ds = days();
    const m = S.modal(`<h2 class="h3">Book a meeting</h2><p class="small muted">With Kantan’s OEM team. Pick what suits you.</p>
      <div class="where__tabs" role="group" aria-label="Meeting type" style="margin:12px 0">${['Video call', 'Visit our kitchen', 'At a trade show'].map((x, i) => `<button class="chip" type="button" data-mode aria-pressed="${!i}">${x}</button>`).join('')}</div>
      <div class="label" style="font-weight:800">Day</div><div class="slot-grid" data-group="day">${ds.map((d, i) => `<button type="button" aria-pressed="${!i}">${d.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })}</button>`).join('')}</div>
      <div class="label" style="font-weight:800">Time</div><div class="slot-grid" data-group="time">${['10:00', '11:30', '14:00', '15:30', '17:00', '18:00'].map((t, i) => `<button type="button" aria-pressed="${i === 1}">${t}</button>`).join('')}</div>
      <button class="btn" type="button" style="width:100%" data-confirm>Confirm meeting</button>`, 560);
    m.addEventListener('click', ev => {
      const b = ev.target.closest('.slot-grid button, [data-mode]');
      if (b) { const grp = b.parentElement; $$('button', grp).forEach(x => x.setAttribute('aria-pressed', String(x === b))); }
      if (ev.target.closest('[data-confirm]')) {
        const day = $('[data-group="day"] [aria-pressed="true"]', m).textContent, time = $('[data-group="time"] [aria-pressed="true"]', m).textContent;
        S.closeLayer(); S.toast(`Booked for ${day}, ${time}. A calendar invite is on its way.`);
      }
    });
  });

  /* ---------- booth QR ---------- */
  if (window.QRCode) new QRCode($('#booth-qr'), { text: location.href.split('#')[0] + '?src=booth#shows', width: 130, height: 130, colorDark: '#173A29', colorLight: '#ffffff' });
  S.refreshTour();
})();
