/* Trade portal demo: sign in, reorder with live totals, tiered price list. All numbers are sample data. */
(function () {
  const K = window.KANTAN, S = window.Site;
  const { $, $$, icon, esc } = S;
  const TIERS = [38, 35, 32];          /* sample RM per kg for 1–9, 10–49 and 50+ cartons */
  const KG = 10;                        /* 10 × 1 kg pouches per carton */
  const last = { rendang: 5, 'meat-curry': 6, 'assam-laksa': 3, 'curry-laksa': 2, satay: 2 };

  const signedIn = () => S.store.get('kantan-trade', false);
  function view() {
    const on = signedIn();
    $('#login-view').hidden = on;
    $('#portal-view').hidden = !on;
    S.refreshTour();
  }
  $('#login-form').addEventListener('submit', e => { e.preventDefault(); S.store.set('kantan-trade', true); view(); window.scrollTo(0, 0); S.toast('Signed in to the demo trade account.'); });
  $('#logout').addEventListener('click', e => { e.preventDefault(); S.store.set('kantan-trade', false); view(); });

  const rm = n => 'RM' + n.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const tierFor = cartons => cartons >= 50 ? 2 : cartons >= 10 ? 1 : 0;

  function renderReorder() {
    const total = Object.values(last).reduce((a, b) => a + b, 0);
    const price = TIERS[tierFor(total)];
    $('#ro-table tbody').innerHTML = Object.entries(last).map(([id, n]) => {
      const f = K.byId[id];
      return `<tr><td style="display:flex;gap:12px;align-items:center"><img src="${f.pack}" alt="" width="40" height="40" style="border-radius:8px">${esc(f.short)}</td>
        <td><div class="qty"><button type="button" data-r="-1" data-id="${id}" aria-label="Fewer cartons of ${esc(f.short)}">${icon('i-minus')}</button><output>${n}</output><button type="button" data-r="1" data-id="${id}" aria-label="More cartons of ${esc(f.short)}">${icon('i-plus')}</button></div></td>
        <td>${rm(price)}</td><td><b>${rm(n * KG * price)}</b></td></tr>`;
    }).join('');
    $('#ro-total').textContent = rm(total * KG * price);
    $('#ro-go').textContent = '';
    $('#ro-go').insertAdjacentHTML('beforeend', `${icon('i-refresh')}Reorder ${total} cartons`);
    $$('#tier-table tbody tr').forEach(tr => tr.classList.remove('is-tier'));
    renderTiers(tierFor(total));
  }
  function renderTiers(active) {
    $('#tier-table tbody').innerHTML = K.flavours.map(f => `<tr class="${''}"><td>${esc(f.short)}</td>${TIERS.map((p, i) => `<td style="${i === active ? 'background:color-mix(in srgb,var(--kunyit) 25%,transparent);font-weight:800' : ''}">${rm(p)} / kg</td>`).join('')}</tr>`).join('');
  }
  $('#ro-table').addEventListener('click', e => {
    const b = e.target.closest('[data-r]');
    if (!b) return;
    last[b.dataset.id] = Math.max(0, last[b.dataset.id] + Number(b.dataset.r));
    renderReorder();
  });
  $('#ro-go').addEventListener('click', () => S.toast('Order TR-26-' + (1000 + Math.floor(Math.random() * 99)) + ' placed. Delivery on Thursday.'));
  document.addEventListener('click', e => { if (e.target.closest('[data-dl]')) S.toast('Demo: downloads the PDF from the live portal.'); });
  $$('.portal__side a[href^="#"]:not(#logout)').forEach(a => a.addEventListener('click', () => {
    $$('.portal__side a').forEach(x => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'page');
  }));

  renderReorder();
  view();
})();
