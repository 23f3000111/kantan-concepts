/* Proposal page: before/after slider, offer list with links into the demo, revenue calculator. */
(function () {
  const $ = s => document.querySelector(s);
  const icon = id => `<svg class="icon" aria-hidden="true"><use href="#${id}"/></svg>`;

  /* before / after */
  const ba = $('#ba'), range = $('#ba-range');
  const setX = v => ba.style.setProperty('--x', v + '%');
  range.addEventListener('input', () => setX(range.value));
  setX(range.value);

  /* what you get */
  const offers = [
    { title: 'A premium, animated redesign', shot: 'shot-flavours', link: 'flagship/index.html#flavours', cta: 'See the flavour showcase', items: [
      ['Colour-shift flavour showcase', 'Each paste floods the screen in its own pack colour as you scroll.', 'Revamp'],
      ['Two clear paths on the homepage', 'Cook at home or make your own brand, chosen in the first five seconds.', 'Refresh'],
      ['Paste-to-plate story', 'Your own cooking footage, told in three steps.', 'Flagship'],
      ['Heritage story and stockist map', 'Aunty Annie, the founders, and every place to buy Kantan.', 'Revamp'],
      ['Faster, not slower', 'Target: 85+ on Google’s mobile test, up from 32–36.', 'Refresh'],
      ['Your torch-ginger flower as the signature', 'Bunga kantan becomes badges, markers and loaders across the site.', 'Refresh']
    ] },
    { title: 'Tanya Kantan, an AI assistant', shot: 'shot-chat', link: 'flagship/index.html?chat=1', cta: 'Chat with it', items: [
      ['English, BM and 中文', 'Replies in the language the customer writes in.', 'Revamp'],
      ['Recipes that sell', 'Suggests a dish and adds the paste to the cart.', 'Revamp'],
      ['Order and delivery answers', 'Tracks orders and explains shipping without a staff member.', 'Revamp'],
      ['OEM leads, pre-qualified', 'Asks business type, volume and timeline, then hands over on WhatsApp.', 'Revamp'],
      ['On WhatsApp too', 'The same assistant answers on WhatsApp Business.', 'Flagship']
    ] },
    { title: 'A shop that sells more', shot: 'shot-shop', link: 'flagship/shop.html#bundle', cta: 'Build a bundle', items: [
      ['Build-your-own 6 or 18 pack', 'Any flavours at bundle prices, not a fixed assortment.', 'Revamp'],
      ['Slide-out cart with free-shipping bar', 'Shows how much more unlocks free shipping.', 'Refresh'],
      ['Instant payment confirmation', 'DuitNow QR, FPX, Touch ’n Go and GrabPay through senangPay.', 'Refresh'],
      ['Photo reviews with stars', 'Shown on the product and as stars in Google.', 'Refresh'],
      ['Festive boxes and pantry subscription', 'Raya, CNY and Deepavali boxes, and a monthly box.', 'Revamp']
    ] },
    { title: 'An OEM lead engine', shot: 'shot-quote', link: 'flagship/oem.html#quote', cta: 'Try the quote builder', items: [
      ['Five-step quote builder', 'Turns “request a quote” into a full brief your team can price.', 'Revamp'],
      ['Catalogue download', 'Buyers leave an email to get the PDF.', 'Revamp'],
      ['Clickable certificates and specs', 'Halal, MeSTI, HACCP and GMP details in one place.', 'Revamp'],
      ['Trade-show QR kit', 'Booth visitors land on a page with the catalogue and a meeting slot.', 'Flagship'],
      ['Wholesale portal', 'Tiered prices, one-tap reorder and invoices for trade customers.', 'Flagship']
    ] },
    { title: 'Foundations', shot: 'shot-product', link: 'flagship/product.html', cta: 'See a product page', items: [
      ['English, BM and 中文 versions', 'Clean product names and proper language versions for Google.', 'Revamp'],
      ['Recipes and products Google can feature', 'Structured data for recipe, price and rating results.', 'Revamp'],
      ['Every audit issue fixed', 'Broken files, overlapping buttons, missing image descriptions.', 'Refresh'],
      ['Latest WordPress, secured and backed up', 'Updated core and plugins, daily backups, uptime checks.', 'Refresh'],
      ['Google Ads conversion tracking', 'Quote requests and WhatsApp taps counted as conversions.', 'Revamp']
    ] }
  ];
  $('#offers').innerHTML = offers.map(o => `<article class="offer">
      <div class="offer__head"><h3 class="h3">${o.title}</h3>
        <a class="offer__shot" href="${o.link}"><img src="assets/img/proposal/${o.shot}.webp" alt="" loading="lazy" width="1440" height="900"></a>
        <a class="link-arrow" href="${o.link}" style="width:fit-content">${o.cta}${icon('i-arrow')}</a></div>
      <ul>${o.items.map(([t, d, tier]) => `<li>${icon('i-check')}<span><b>${t}</b>${d}<br><span class="tier tier--${tier}">${tier}</span></span></li>`).join('')}</ul>
    </article>`).join('');

  /* revenue calculator */
  const num = id => Math.max(0, Number($(id).value) || 0);
  function calc() {
    const oem = num('#c-oem') * num('#c-val');
    const web = num('#c-ord') * num('#c-aov') * 12;
    $('#c-out').textContent = 'RM' + (oem + web).toLocaleString('en-MY');
    $('#c-note').textContent = `RM${oem.toLocaleString('en-MY')} from OEM clients and RM${web.toLocaleString('en-MY')} from online orders.`;
  }
  $('#calc').addEventListener('input', calc);
  calc();
})();
