/* Product page, driven by ?f=<flavour id>. Defaults to Rendang, the only paste with its full pack panel online. */
(function () {
  const K = window.KANTAN, S = window.Site;
  const { $, $$, icon, money, esc } = S;
  const id = new URLSearchParams(location.search).get('f');
  const f = K.byId[id] || K.byId.rendang;
  const r = K.recipes.find(x => x.id === f.recipe);
  const isRendang = f.id === 'rendang';

  document.title = `${f.name} | Kantan Food (concept)`;
  const pdp = $('.pdp');
  pdp.style.setProperty('--c', f.flood);
  pdp.style.setProperty('--ci', f.ink);
  $('#crumb').textContent = f.short;
  $('#p-ms').textContent = f.ms;
  $('#p-name').textContent = f.name;
  $('#p-sub').innerHTML = `<span lang="zh">${esc(f.zh)}</span>&nbsp;&nbsp;${f.weight}`;
  $('#p-stars').innerHTML = icon('i-star').repeat(5);
  $('#sum-stars').innerHTML = icon('i-star').repeat(5);
  $('#p-price').textContent = money(f.price);
  $('#p-line').textContent = f.line;
  $('#p-facts').innerHTML = S.facts(f);
  $('#p-claims').innerHTML = ['Halal certified', 'No lard', 'Gluten-free', 'No preservatives', 'No artificial colouring', 'No artificial flavouring']
    .map((c, i) => `<span class="tag${i === 0 ? ' tag--pink' : ''}">${icon(i === 0 ? 'i-shield' : 'i-check')}${c}</span>`).join('');
  $('#p-trade').textContent = ` ${f.short} also comes in 1 kg retort pouches, 10 to a carton, for kitchens that cook in volume.`;

  /* ---------- gallery ---------- */
  const shots = [
    { src: f.pack, alt: `${f.name} pack` },
    { src: f.dish, alt: `${f.short} served`, contain: true },
    ...(isRendang ? [
      { src: K.IMG + 'kantan/rendang-info.webp', alt: 'Rendang Paste ingredients and serving information' },
      { src: K.IMG + 'kantan/rendang-points.webp', alt: 'No lard, gluten-free, no preservatives, no artificial colouring or flavouring' }
    ] : []),
    { src: f.photo, alt: `${r.title}` },
    { video: r.video, src: f.photo, alt: `${r.title} video` }
  ].slice(0, 6);
  const main = $('#g-main'), thumbs = $('#g-thumbs');
  function show(i) {
    const s = shots[i];
    $$('button', thumbs).forEach((b, j) => b.setAttribute('aria-current', String(i === j)));
    if (s.video) {
      main.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${s.video}?autoplay=1&rel=0" title="${esc(s.alt)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      main.innerHTML = `<img src="${s.src}" alt="${esc(s.alt)}" style="${s.contain ? 'object-fit:contain;padding:10%;' : ''}">`;
    }
  }
  thumbs.innerHTML = shots.map((s, i) => `<button type="button" class="${s.video ? 'vid' : ''}" aria-label="${esc(s.alt)}"><img src="${s.src}" alt="" style="${s.contain ? 'object-fit:contain;background:var(--c)' : ''}">${s.video ? icon('i-play') : ''}</button>`).join('');
  thumbs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show([...thumbs.children].indexOf(b)); });
  show(0);

  /* ---------- buy ---------- */
  let qty = 1;
  $$('[data-pq]').forEach(b => b.addEventListener('click', () => { qty = Math.max(1, qty + Number(b.dataset.pq)); $('#p-qty').textContent = qty; }));
  $('#p-add').addEventListener('click', () => S.addToCart(f.id, qty, $('#g-main img') || $('#g-thumbs img')));
  $('#sb-img').src = f.pack;
  $('#sb-name').textContent = f.name;
  $('#sb-price').textContent = money(f.price);
  $('#sb-add').addEventListener('click', () => S.addToCart(f.id, 1, $('#sb-img')));
  const sticky = $('#sticky-buy');
  new IntersectionObserver(([en]) => {
    const show = !en.isIntersecting && en.boundingClientRect.top < 0;
    sticky.classList.toggle('show', show);
    sticky.setAttribute('aria-hidden', String(!show));
  }).observe($('#buy-row'));

  /* ---------- details ---------- */
  const inside = isRendang
    ? `<p>Oil, lemongrass, onion, desiccated coconut, sugar, curry powder, garlic, chilli powder, salt, galangal, candlenut, turmeric, tamarind, flavour enhancer (E621), chilli, soy sauce, lime leaves, curry leaves and spices.</p><p><b>Allergy advice:</b> contains nuts.</p>`
    : `<p>The full ingredient list and nutrition panel are printed on the pack.</p>`;
  const faqs = isRendang ? [
    ['What does rendang paste taste like?', 'Rich, savoury and mildly spicy, made with traditional Malaysian herbs and spices.'],
    ['Can I use it with other proteins?', 'Yes. It works with beef, chicken, lamb and plant-based alternatives.'],
    ['Do you offer bulk supply or OEM?', 'Yes. Kantan supplies 1 kg packs for kitchens and makes custom and private-label pastes with a low minimum order.']
  ] : [
    ['Is it Halal?', 'Yes. It is made in Kantan’s JAKIM Halal-certified kitchen in Subang Jaya.'],
    ['How many people does one pack serve?', `One pack serves ${f.serves} people.`],
    ['Do you offer bulk supply or OEM?', 'Yes. Kantan supplies 1 kg packs for kitchens and makes custom and private-label pastes with a low minimum order.']
  ];
  $('#p-acc').innerHTML = `
    <details open><summary>What’s inside${icon('i-chevron')}</summary><div class="acc__body">${inside}<p>Every Kantan paste is made without lard, preservatives, artificial colouring or artificial flavouring, and is gluten-free.</p></div></details>
    <details><summary>Storage${icon('i-chevron')}</summary><div class="acc__body"><p>Keeps for 12 months unopened at room temperature, away from sunlight. Once opened, keep it in the fridge.</p></div></details>
    <details><summary>Questions${icon('i-chevron')}</summary><div class="acc__body">${faqs.map(([q, a]) => `<p><b>${esc(q)}</b><br>${esc(a)}</p>`).join('')}</div></details>`;

  /* ---------- recipe ---------- */
  $('#cook-title').textContent = r.title;
  $('#recipe-link').href = 'recipes.html#' + r.id;
  const video = $('#video');
  video.innerHTML = `<img src="${f.photo}" alt="${esc(r.title)}"><button class="play" type="button" aria-label="Play the ${esc(r.title)} video">${icon('i-play')}</button>`;
  video.querySelector('.play').addEventListener('click', () => {
    video.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${r.video}?autoplay=1&rel=0" title="${esc(r.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  });
  const qtyText = i => i.n == null ? 'To taste' : `${i.n}${i.unit && i.unit !== 'pack' ? ' ' + i.unit : i.unit === 'pack' ? ' pack' : ''}`;
  $('#ing').innerHTML = r.ingredients.map(i => `<li><b>${qtyText(i)}</b><span>${esc(i.item)}</span></li>`).join('');
  $('#steps').innerHTML = r.steps.map(s => `<li><span>${esc(s)}</span></li>`).join('');

  /* ---------- reviews ---------- */
  const stars = `<span class="stars" aria-label="5 out of 5">${icon('i-star').repeat(5)}</span>`;
  $('#rev-list').innerHTML = K.reviews.slice(0, 6).map(v => `<figure class="review">${stars}<q${v.lang ? ` lang="${v.lang}"` : ''}>${esc(v.text)}</q><cite>${esc(v.who)}, verified buyer</cite></figure>`).join('');
  $('#write-rev').addEventListener('click', () => {
    const m = S.modal(`<h2 class="h3">Review ${esc(f.short)}</h2>
      <div class="star-input" role="radiogroup" aria-label="Your rating">${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? 's' : ''}" data-s="${n}">${icon('i-star')}</button>`).join('')}</div>
      <div class="field" style="margin-top:14px"><label for="rv-text">Your review</label><textarea class="textarea" id="rv-text" placeholder="What did you cook with it?"></textarea></div>
      <label class="drop" style="margin-top:12px">${icon('i-upload')}<span>Add a photo of your dish<br><span class="small muted">Photo reviews show first</span></span><input type="file" accept="image/*" class="sr-only"></label>
      <button class="btn" type="button" style="width:100%;margin-top:16px" data-send>Post review</button>`, 520);
    let rating = 0;
    $$('[data-s]', m).forEach(b => b.addEventListener('click', () => {
      rating = Number(b.dataset.s);
      $$('[data-s]', m).forEach(x => { const on = Number(x.dataset.s) <= rating; x.classList.toggle('on', on); x.setAttribute('aria-checked', String(Number(x.dataset.s) === rating)); });
    }));
    $('[data-send]', m).addEventListener('click', () => {
      if (!rating) { S.toast('Choose a star rating first.'); return; }
      S.closeLayer(); S.toast('Thanks! Your review appears after a quick check.');
    });
  });

  /* ---------- pairs ---------- */
  const others = K.flavours.filter(x => x.id !== f.id).sort((a, b) => (b.group === f.group) - (a.group === f.group)).slice(0, 4);
  $('#pairs').innerHTML = others.map(o => `<article class="p-card" data-card style="--c:${o.flood}">
      <a class="p-card__img" href="product.html?f=${o.id}" aria-label="${esc(o.name)}"><img class="packimg" src="${o.pack}" alt="" loading="lazy"><img class="dish" src="${o.dish}" alt="" loading="lazy"></a>
      <h3><a href="product.html?f=${o.id}">${esc(o.short)}</a></h3>
      <div class="p-card__row"><span class="p-card__price">${money(o.price)}</span><button class="add-round" type="button" data-add="${o.id}" aria-label="Add ${esc(o.short)} to cart">${icon('i-plus')}</button></div>
    </article>`).join('');

  /* ---------- structured data so Google can show price, rating and recipe ---------- */
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: f.name, image: location.origin + f.pack, brand: { '@type': 'Brand', name: 'Kantan' },
    offers: { '@type': 'Offer', priceCurrency: 'MYR', price: f.price.toFixed(2), availability: 'https://schema.org/InStock' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '8' }
  });
  document.head.appendChild(ld);
  S.applyLang();
})();
