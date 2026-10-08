/* Tanya Kantan: a scripted stand-in for the AI assistant. Keyword intents in EN / BM / 中文. */
(function () {
  const K = window.KANTAN, S = window.Site;
  const { $, icon, esc, bloom, tr } = S;

  const L = {
    en: {
      hello: 'Hi, I’m Tanya Kantan. I can suggest a recipe, track an order or help you start your own paste brand. What would you like to do?',
      chips: ['What can I cook with rendang paste?', 'Is Kantan Halal?', 'Track my order', 'I want my own paste brand', 'Which paste is the spiciest?'],
      halal: 'Yes. Every Kantan paste is made in our JAKIM Halal-certified kitchen (MS1500) in Subang Jaya. The kitchen also holds MeSTI, HACCP and GMP certification.',
      halalLink: 'See the certificates',
      recipeIntro: f => `Here’s a favourite with ${f.short} paste:`,
      watch: 'Watch the video', add: p => `Add paste ${p}`,
      spicy: 'Assam Pedas is the hottest, 3 of 3 chillies. Laksa, Prawn Mee and Meat Curry sit at 2. Rendang, Satay, Fish Curry, Siam Laksa and Shrimp Sambal are the mildest at 1.',
      ship: 'Shipping is free on orders over RM50 in West Malaysia, and orders leave Subang Jaya with tracking. In Singapore, our distributor Alfon International can help. Our East Malaysia distributor covers Miri, Bintulu, Sabah and Brunei.',
      where: 'You’ll find Kantan in every MaxValu and in selected AEON stores. We also have distributors in Singapore, Hong Kong, Indonesia, Brunei and East Malaysia.', whereLink: 'Open the map',
      price: 'Each paste is RM13.90. In the bundle builder you can pick any 6 for RM45.60 or any 18 for RM137.80.', priceLink: 'Build a bundle',
      trackAsk: 'Sure. What’s your order number? It starts with KF, for example KF-26-04817.',
      trackDone: n => `Order ${n} is on its way.`, track: ['Paid', 'Packed in Subang Jaya', 'Shipped with tracking', 'Out for delivery tomorrow'],
      oemStart: 'Great, let’s put together a quick brief for our OEM team. What kind of business are you?',
      oemBiz: ['Restaurant or café', 'Caterer', 'Retail food brand', 'Exporter or distributor'],
      oemWhat: 'What would you like us to make?', oemWhatC: ['A Kantan recipe', 'My own recipe', 'Not sure yet'],
      oemVol: 'Roughly how much per month?', oemVolC: ['Under 100 kg', '100–500 kg', 'More than 500 kg'],
      oemWhen: 'When do you need the first batch?', oemWhenC: ['Within a month', 'In 1–3 months', 'Just exploring'],
      oemWho: 'Last one: your name and WhatsApp number, so our team can reach you.', oemWhoPh: 'Name and WhatsApp number',
      oemSum: 'Here’s your brief:', oemLabels: ['Business', 'Product', 'Volume', 'Timeline', 'Contact'],
      oemSend: 'Send to Kantan sales', oemSent: 'Sent. A Kantan OEM specialist will WhatsApp you within one working day. While you wait, the catalogue is worth a look.', oemCat: 'Get the OEM catalogue',
      demoNote: 'Demo only. On the live site this lead goes to sales on WhatsApp and into the CRM.',
      fallback: 'I can help with recipes, orders, delivery, Halal certificates and OEM manufacturing. Try one of these:',
      human: 'Talk to a person'
    },
    ms: {
      hello: 'Hai, saya Tanya Kantan. Saya boleh cadangkan resipi, semak pesanan atau bantu anda mulakan jenama pes sendiri. Apa yang anda perlukan?',
      chips: ['Masak apa dengan pes rendang?', 'Adakah Kantan Halal?', 'Semak pesanan saya', 'Saya mahu jenama pes sendiri', 'Pes mana paling pedas?'],
      halal: 'Ya. Semua pes Kantan dihasilkan di dapur kami di Subang Jaya yang disahkan Halal JAKIM (MS1500). Dapur kami juga mempunyai pensijilan MeSTI, HACCP dan GMP.',
      halalLink: 'Lihat sijil',
      recipeIntro: f => `Ini resipi kegemaran dengan pes ${f.short}:`,
      watch: 'Tonton video', add: p => `Tambah pes ${p}`,
      spicy: 'Asam Pedas paling pedas, 3 daripada 3 cili. Laksa, Mi Udang dan Kari Daging di tahap 2. Rendang, Sate, Kari Ikan, Laksa Siam dan Sambal Udang Kering paling lembut, tahap 1.',
      ship: 'Penghantaran percuma untuk pesanan melebihi RM50 di Semenanjung, dihantar dari Subang Jaya dengan nombor pengesanan. Di Singapura, pengedar kami Alfon International boleh membantu. Pengedar Malaysia Timur kami meliputi Miri, Bintulu, Sabah dan Brunei.',
      where: 'Kantan ada di semua MaxValu dan kedai AEON terpilih. Kami juga ada pengedar di Singapura, Hong Kong, Indonesia, Brunei dan Malaysia Timur.', whereLink: 'Buka peta',
      price: 'Setiap pes RM13.90. Dalam pembina set, pilih mana-mana 6 untuk RM45.60 atau 18 untuk RM137.80.', priceLink: 'Bina set',
      trackAsk: 'Boleh. Apa nombor pesanan anda? Ia bermula dengan KF, contohnya KF-26-04817.',
      trackDone: n => `Pesanan ${n} sedang dalam perjalanan.`, track: ['Dibayar', 'Dibungkus di Subang Jaya', 'Dihantar dengan nombor pengesanan', 'Sampai esok'],
      oemStart: 'Bagus, mari kita sediakan ringkasan untuk pasukan OEM kami. Apakah jenis perniagaan anda?',
      oemBiz: ['Restoran atau kafe', 'Katering', 'Jenama makanan runcit', 'Pengeksport atau pengedar'],
      oemWhat: 'Apa yang anda mahu kami hasilkan?', oemWhatC: ['Resipi Kantan', 'Resipi saya sendiri', 'Belum pasti'],
      oemVol: 'Anggaran kuantiti sebulan?', oemVolC: ['Bawah 100 kg', '100–500 kg', 'Lebih 500 kg'],
      oemWhen: 'Bila anda perlukan kelompok pertama?', oemWhenC: ['Dalam sebulan', 'Dalam 1–3 bulan', 'Sekadar meninjau'],
      oemWho: 'Akhir sekali: nama dan nombor WhatsApp anda supaya pasukan kami boleh hubungi.', oemWhoPh: 'Nama dan nombor WhatsApp',
      oemSum: 'Ini ringkasan anda:', oemLabels: ['Perniagaan', 'Produk', 'Kuantiti', 'Masa', 'Hubungi'],
      oemSend: 'Hantar kepada jualan Kantan', oemSent: 'Dihantar. Pakar OEM Kantan akan WhatsApp anda dalam satu hari bekerja. Sementara itu, lihat katalog kami.', oemCat: 'Dapatkan katalog OEM',
      demoNote: 'Demo sahaja. Di laman sebenar, maklumat ini terus ke WhatsApp pasukan jualan dan CRM.',
      fallback: 'Saya boleh bantu tentang resipi, pesanan, penghantaran, sijil Halal dan pembuatan OEM. Cuba ini:',
      human: 'Bercakap dengan staf'
    },
    zh: {
      hello: '您好，我是 Tanya Kantan。我可以推荐食谱、查询订单，或帮您打造自己的酱料品牌。需要什么帮助？',
      chips: ['任当酱可以煮什么？', 'Kantan 是清真的吗？', '查询我的订单', '我想做自己的酱料品牌', '哪款最辣？'],
      halal: '是的。所有 Kantan 酱料都在我们位于梳邦再也、获得 JAKIM 清真认证（MS1500）的厨房生产，同时拥有 MeSTI、HACCP 和 GMP 认证。',
      halalLink: '查看认证',
      recipeIntro: f => `用${f.zh.replace('即煮酱料', '')}酱料做这道菜：`,
      watch: '观看视频', add: p => `加入酱料 ${p}`,
      spicy: '亚叁辣酱最辣，三颗辣椒。咖喱叻沙、亚叁叻沙、虾面和咖喱肉是两颗。任当、沙爹、咖喱鱼、暹罗叻沙和叁巴虾米最温和，一颗。',
      ship: '西马订单满 RM50 免运费，从梳邦再也发货并附追踪号码。新加坡可联系我们的经销商 Alfon International。东马经销商覆盖美里、民都鲁、沙巴和文莱。',
      where: '全线 MaxValu 及部分 AEON 均有售。我们在新加坡、香港、印尼、文莱和东马也有经销商。', whereLink: '打开地图',
      price: '每包 RM13.90。在套装组合里，任选 6 包 RM45.60，任选 18 包 RM137.80。', priceLink: '组合套装',
      trackAsk: '好的，请告诉我订单号码。以 KF 开头，例如 KF-26-04817。',
      trackDone: n => `订单 ${n} 正在配送中。`, track: ['已付款', '梳邦再也包装中', '已发货（附追踪号码）', '明天送达'],
      oemStart: '太好了，我们来为 OEM 团队准备一份简要需求。请问您的业务类型是？',
      oemBiz: ['餐厅或咖啡馆', '餐饮外烩', '零售食品品牌', '出口商或经销商'],
      oemWhat: '您希望我们生产什么？', oemWhatC: ['Kantan 现有配方', '我自己的配方', '还不确定'],
      oemVol: '每月大约需要多少？', oemVolC: ['少于 100 公斤', '100–500 公斤', '超过 500 公斤'],
      oemWhen: '第一批货什么时候需要？', oemWhenC: ['一个月内', '1–3 个月内', '先了解看看'],
      oemWho: '最后：请留下您的名字和 WhatsApp 号码，方便团队联系您。', oemWhoPh: '名字和 WhatsApp 号码',
      oemSum: '这是您的需求摘要：', oemLabels: ['业务', '产品', '数量', '时间', '联系方式'],
      oemSend: '发送给 Kantan 销售团队', oemSent: '已发送。Kantan OEM 专员会在一个工作日内通过 WhatsApp 联系您。先看看我们的产品目录吧。', oemCat: '获取 OEM 目录',
      demoNote: '仅为演示。正式网站会把这条线索直接发到销售团队的 WhatsApp 和 CRM。',
      fallback: '我可以帮您解答食谱、订单、配送、清真认证和 OEM 生产的问题。试试这些：',
      human: '联系客服'
    }
  };
  const lg = () => L[S.lang] || L.en;

  const fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'chat-fab'; fab.dataset.feature = 'chat';
  fab.innerHTML = `${bloom('K')}<span class="label" data-i18n="chat.open">${tr('chat.open')}</span>`;
  const panel = document.createElement('section');
  panel.className = 'chat'; panel.setAttribute('aria-label', 'Tanya Kantan chat'); panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="chat__head">${bloom('K')}<div><h2 data-i18n="chat.title">Tanya Kantan</h2><p data-i18n="chat.sub">${tr('chat.sub')}</p></div>
      <button class="icon-btn" type="button" data-chat-close aria-label="Close chat">${icon('i-close')}</button></div>
    <div class="chat__lang"><span>${icon('i-globe')}</span><button type="button" data-lang="en">EN</button><button type="button" data-lang="ms">BM</button><button type="button" data-lang="zh">中文</button></div>
    <div class="chat__log" aria-live="polite" data-lenis-prevent></div>
    <div class="chat__chips"></div>
    <form class="chat__form" autocomplete="off"><label class="sr-only" for="chat-in">Message</label><input id="chat-in" type="text" data-i18n-ph="chat.ph" placeholder="${esc(tr('chat.ph'))}"><button type="submit" aria-label="Send">${icon('i-send')}</button></form>`;
  document.body.append(fab, panel);
  S.applyLang();
  const log = $('.chat__log', panel), chipsEl = $('.chat__chips', panel), input = $('#chat-in', panel);
  let started = false, flow = null, data = {};

  function open() {
    panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); fab.classList.add('hide');
    if (!started) { started = true; bot(lg().hello, { chips: lg().chips }); }
    setTimeout(() => input.focus({ preventScroll: true }), 300);
  }
  function close() { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); fab.classList.remove('hide'); }
  fab.addEventListener('click', open);
  $('[data-chat-close]', panel).addEventListener('click', close);
  document.addEventListener('click', e => { if (e.target.closest('[data-chat-open]')) { e.preventDefault(); open(); } });
  document.addEventListener('kantan:lang', () => { if (started && !flow) setChips(lg().chips); });

  const scroll = () => { log.scrollTop = log.scrollHeight; };
  function me(text) { const d = document.createElement('div'); d.className = 'msg msg--me'; d.textContent = text; log.appendChild(d); scroll(); }
  function bot(html, opts = {}) {
    setChips([]);
    const t = document.createElement('div'); t.className = 'msg msg--bot typing'; t.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(t); scroll();
    setTimeout(() => {
      t.remove();
      const d = document.createElement('div'); d.className = 'msg msg--bot';
      d.innerHTML = `<p>${html}</p>${opts.extra || ''}`;
      log.appendChild(d); scroll();
      if (opts.chips) setChips(opts.chips);
      if (opts.after) opts.after(d);
    }, opts.delay || 650 + Math.random() * 450);
  }
  function setChips(list) {
    chipsEl.innerHTML = '';
    list.forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c; b.addEventListener('click', () => handle(c)); chipsEl.appendChild(b); });
  }

  const has = (s, re) => re.test(s.toLowerCase());
  function flavourIn(s) {
    const map = [['rendang', /rendang|任当|仁当/], ['satay', /satay|sate|沙爹/], ['assam-laksa', /assam laksa|asam laksa|亚叁叻沙/], ['curry-laksa', /curry laksa|kari laksa|咖喱叻沙/],
      ['siam-laksa', /siam|暹罗/], ['prawn-mee', /prawn|mi udang|虾面/], ['sambal', /sambal|叁巴|udang kering/], ['assam-pedas', /pedas|亚叁辣|assam prawn/],
      ['fish-curry', /fish|ikan|咖喱鱼|鱼/], ['meat-curry', /curry|kari|咖喱/]];
    const hit = map.find(([, re]) => re.test(s.toLowerCase()));
    return hit ? K.byId[hit[0]] : null;
  }

  function recipeCard(f) {
    const r = K.recipes.find(x => x.id === f.recipe);
    return `<div class="card"><img src="${f.photo}" alt=""><div><strong>${esc(r.title)}</strong>
      <span class="small muted meta"><span>${icon('i-users')}${r.serves}</span><span>${icon('i-clock')}${r.mins} min</span></span>
      <div class="row"><a class="btn btn--sm btn--dark" href="recipes.html#${r.id}">${icon('i-play')}${esc(lg().watch)}</a>
      <button class="btn btn--sm" type="button" data-add="${f.id}">${esc(lg().add(S.money(f.price)))}</button></div></div></div>`;
  }

  function handle(text) {
    const s = text.trim();
    if (!s) return;
    me(s); input.value = '';
    const T = lg();
    if (flow) return step(s);
    if (has(s, /oem|own .*brand|private|label|jenama|kilang|代工|贴牌|品牌|bulk|pukal|批发|wholesale|manufactur/)) {
      flow = 'oem'; data = {}; return bot(T.oemStart, { chips: T.oemBiz });
    }
    if (has(s, /track|order|pesanan|订单|kf-|parcel|bungkusan/)) { flow = 'track'; return bot(T.trackAsk); }
    if (has(s, /halal|清真|jakim|mesti|haccp|gmp/)) return bot(T.halal, { extra: `<p style="margin-top:8px"><a class="link-arrow" href="oem.html#certs">${esc(T.halalLink)}${icon('i-arrow')}</a></p>`, chips: T.chips.slice(0, 1).concat(T.chips.slice(2)) });
    if (has(s, /spic|hot|pedas paling|paling pedas|最辣|辣/)) return bot(T.spicy, { chips: T.chips });
    const f = flavourIn(s);
    if (f || has(s, /cook|masak|煮|recipe|resipi|食谱|dinner|makan/)) {
      const fl = f || K.byId.rendang;
      return bot(T.recipeIntro(fl), { extra: recipeCard(fl), chips: T.chips.filter((_, i) => i !== 0) });
    }
    if (has(s, /ship|deliver|hantar|postage|运费|送货|配送|singapore|sabah|sarawak/)) return bot(T.ship, { chips: T.chips });
    if (has(s, /where|buy|kedai|beli|哪里|买|store|aeon|maxvalu/)) return bot(T.where, { extra: `<p style="margin-top:8px"><a class="link-arrow" href="index.html#where">${esc(T.whereLink)}${icon('i-arrow')}</a></p>`, chips: T.chips });
    if (has(s, /price|harga|berapa|how much|价格|多少钱|bundle|set/)) return bot(T.price, { extra: `<p style="margin-top:8px"><a class="link-arrow" href="shop.html#bundle">${esc(T.priceLink)}${icon('i-arrow')}</a></p>`, chips: T.chips });
    if (has(s, /^(hi|hello|hai|salam|你好|hey)/)) return bot(T.hello, { chips: T.chips });
    bot(T.fallback, { chips: T.chips });
  }

  function step(s) {
    const T = lg();
    if (flow === 'track') {
      flow = null;
      const n = (s.match(/kf-?\d{2}-?\d{3,6}/i) || ['KF-26-04817'])[0].toUpperCase();
      const steps = T.track.map((x, i) => `<li class="${i < 3 ? 'done' : ''}"><span>${esc(x)}</span></li>`).join('');
      return bot(esc(T.trackDone(n)), { extra: `<ol class="track" style="list-style:none;padding:0;margin-top:10px">${steps}</ol>`, chips: T.chips });
    }
    if (flow === 'oem') {
      if (!data.biz) { data.biz = s; return bot(T.oemWhat, { chips: T.oemWhatC }); }
      if (!data.what) { data.what = s; return bot(T.oemVol, { chips: T.oemVolC }); }
      if (!data.vol) { data.vol = s; return bot(T.oemWhen, { chips: T.oemWhenC }); }
      if (!data.when) { data.when = s; input.placeholder = T.oemWhoPh; return bot(T.oemWho); }
      data.who = s; flow = null; input.placeholder = tr('chat.ph');
      const rows = [data.biz, data.what, data.vol, data.when, data.who].map((v, i) => `<div><b>${esc(T.oemLabels[i])}:</b> ${esc(v)}</div>`).join('');
      return bot(T.oemSum, {
        extra: `<div class="summary">${rows}</div><p style="margin-top:10px"><button class="btn btn--sm" type="button" data-send-lead>${icon('i-whatsapp')}${esc(T.oemSend)}</button></p>`,
        after: d => d.querySelector('[data-send-lead]').addEventListener('click', e => {
          e.currentTarget.disabled = true;
          S.toast(T.demoNote);
          bot(T.oemSent, { extra: `<p style="margin-top:8px"><a class="link-arrow" href="oem.html#catalogue">${esc(T.oemCat)}${icon('i-arrow')}</a></p>`, chips: T.chips });
        })
      });
    }
  }

  $('.chat__form', panel).addEventListener('submit', e => { e.preventDefault(); handle(input.value); });
  window.Chat = { open, ask: q => { open(); setTimeout(() => handle(q), started ? 100 : 1300); } };
  if (new URLSearchParams(location.search).has('chat')) setTimeout(open, 900);
})();
