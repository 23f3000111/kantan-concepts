/* Inline SVG sprite. Load as the first thing inside <body> so <use href="#i-..."> resolves on first paint. */
(function () {
  const petals = (n, r, rx, ry) =>
    Array.from({ length: n }, (_, i) =>
      `<ellipse cx="0" cy="${-r}" rx="${rx}" ry="${ry}" transform="rotate(${((360 / n) * i).toFixed(2)})"/>`).join('');

  const stroke = (id, body) =>
    `<symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`;

  const icons = {
    'i-bag': '<path d="M5.5 7.5h13l-1.1 12.5H6.6L5.5 7.5Z"/><path d="M9 7.5a3 3 0 0 1 6 0"/>',
    'i-search': '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
    'i-globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.6 3.7 5.6 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.6-3.7-9S9.6 5.6 12 3Z"/>',
    'i-chat': '<path d="M4 5.5h16v10.5H9.5L4 20V5.5Z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" stroke-width="2.6"/>',
    'i-close': '<path d="M6 6l12 12M18 6 6 18"/>',
    'i-arrow': '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    'i-arrow-left': '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
    'i-chevron': '<path d="m6 9 6 6 6-6"/>',
    'i-play': '<path d="M8 5.2v13.6L19 12 8 5.2Z" fill="currentColor"/>',
    'i-chili': '<path d="M16.6 2.8c0 1.6.6 2.7 2 3.3"/><path d="M18.9 6.4c-1.7-1.3-4-.8-5.1 1-1.1 1.8-1.5 4.1-3 6.2-1.4 2-3.4 3.6-6.3 4.9 4.7 1 9.6-.4 12.6-3.6 2.5-2.7 3.4-6.4 1.8-8.5Z"/>',
    'i-chili-fill': '<path d="M16.6 2.8c0 1.6.6 2.7 2 3.3"/><path d="M18.9 6.4c-1.7-1.3-4-.8-5.1 1-1.1 1.8-1.5 4.1-3 6.2-1.4 2-3.4 3.6-6.3 4.9 4.7 1 9.6-.4 12.6-3.6 2.5-2.7 3.4-6.4 1.8-8.5Z" fill="currentColor"/>',
    'i-clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    'i-users': '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c0-3.2 2.5-5.6 5.5-5.6s5.5 2.4 5.5 5.6"/><path d="M15.5 5.6a3.1 3.1 0 0 1 0 5.9M17.5 14.3c1.9.7 3 2.6 3 5.2"/>',
    'i-check': '<path d="m5 12.5 4.3 4.3L19 7"/>',
    'i-plus': '<path d="M12 5v14M5 12h14"/>',
    'i-minus': '<path d="M5 12h14"/>',
    'i-whatsapp': '<path d="M4.2 19.8 5.4 16A8.2 8.2 0 1 1 8.4 19l-4.2.8Z"/><path d="M9.3 8.4c-.2 2.9 2.9 6.3 6.2 6.3l.9-1.5-1.8-1-.9.8c-.9-.4-2-1.5-2.4-2.4l.8-.9-1-1.8-1.8.5Z"/>',
    'i-pin': '<path d="M12 21s-6.8-6-6.8-11.1a6.8 6.8 0 1 1 13.6 0C18.8 15 12 21 12 21Z"/><circle cx="12" cy="9.8" r="2.4"/>',
    'i-star': '<path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17.1 6.6 20l1.1-6.1-4.5-4.3 6.1-.8L12 3.2Z" fill="currentColor" stroke="none"/>',
    'i-leaf': '<path d="M5 19.5C4.6 10.8 10 5 19.6 4.4 19.8 13.5 14.4 19.6 5 19.5Z"/><path d="M5 19.5 14 10.5"/>',
    'i-factory': '<path d="M3.5 20V10.5l5 3v-3l5 3V5.5h4.2L18.8 20H3.5Z"/><path d="M7 17h2M11.5 17h2"/>',
    'i-truck': '<path d="M3 6.5h11v9.5H3zM14 9.5h3.8l3.2 3.3v3.2h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    'i-shield': '<path d="M12 3.2 5 6v5.8c0 4.4 2.9 7.6 7 9 4.1-1.4 7-4.6 7-9V6l-7-2.8Z"/><path d="m9 12 2.1 2.1L15.2 10"/>',
    'i-download': '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    'i-calendar': '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    'i-upload': '<path d="M12 20V9M7 13.5l5-5 5 5M5 4h14"/>',
    'i-lock': '<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
    'i-refresh': '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.6h-4.6"/>',
    'i-menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'i-phone': '<path d="M5.2 4h3.6l1.8 4.5-2.3 1.4a10.6 10.6 0 0 0 5.8 5.8l1.4-2.3 4.5 1.8v3.6a1.2 1.2 0 0 1-1.2 1.2C10.2 19.6 4.4 13.8 4 5.2A1.2 1.2 0 0 1 5.2 4Z"/>',
    'i-mail': '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="m4 7.5 8 5.8 8-5.8"/>',
    'i-send': '<path d="M4 11.5 20 4l-5.5 16-3-7-7.5-1.5Z"/><path d="m11.5 13 3.5-3.5"/>',
    'i-flame': '<path d="M12 21c-3.9 0-6.5-2.5-6.5-5.9 0-3.3 2.6-5.3 3.6-8.1 2.5 1.6 3.3 3.7 3.3 5.4 1-.7 1.6-1.8 1.8-3 2.3 1.8 4.3 3.9 4.3 6 0 3.2-2.5 5.6-6.5 5.6Z"/>',
    'i-box': '<path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4v-9Z"/><path d="m3.5 7.5 8.5 4 8.5-4M12 11.5v9"/>',
    'i-tag': '<path d="M3.5 12.2V4h8.2l8.8 8.8-8.2 8.2-8.8-8.8Z"/><circle cx="8" cy="8.5" r="1.4"/>',
    'i-bowl': '<path d="M3 11.5h18a9 9 0 0 1-18 0Z"/><path d="M8.5 8c0-1.4.9-1.8.9-3.3M12 8c0-1.4.9-1.8.9-3.3M15.5 8c0-1.4.9-1.8.9-3.3"/>',
    'i-file': '<path d="M6.5 3h7.5l4 4v14H6.5V3Z"/><path d="M14 3v4h4M9.5 12h5M9.5 15.5h5"/>',
    'i-info': '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    'i-wallet': '<rect x="3" y="6" width="18" height="13" rx="2.2"/><path d="M16 12.5h2.2M3 9.5h18"/>',
    'i-bank': '<path d="M3.5 9.5 12 4l8.5 5.5h-17ZM5.5 10v7.5M9.8 10v7.5M14.2 10v7.5M18.5 10v7.5M3.5 20h17"/>',
    'i-card': '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3 10h18M7 15h4"/>',
    'i-qr': '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2.5v2.5H14zM19.5 14v.01M14 19.5h.01M17 17h3v3h-3"/>',
    'i-sparkle': '<path d="M12 3.5 13.9 9 19.5 11 13.9 13 12 18.5 10.1 13 4.5 11 10.1 9 12 3.5Z"/><path d="M19 3.5v3M17.5 5h3"/>',
    'i-sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    'i-screen': '<rect x="3.5" y="4.5" width="17" height="12" rx="2"/><path d="M9 20h6M12 16.5V20"/>',
    'i-scale': '<path d="M12 4v16M5 20h14M6.5 8.5l-3 6a3 3 0 0 0 6 0l-3-6ZM17.5 8.5l-3 6a3 3 0 0 0 6 0l-3-6ZM6.5 8.5h11"/>',
    'i-gift': '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5C10.5 5 7.5 4.6 7.2 6.4 7 8 9.5 8.5 12 8.5ZM12 8.5c1.5-3.5 4.5-3.9 4.8-2.1.2 1.6-2.3 2.1-4.8 2.1Z"/>',
    'i-repeat': '<path d="M4 12a6 6 0 0 1 6-6h8.5M15.5 3l3 3-3 3M20 12a6 6 0 0 1-6 6H5.5M8.5 21l-3-3 3-3"/>',
    'i-user': '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.6-3.6 3.5-5.8 7-5.8s6.4 2.2 7 5.8"/>',
    'i-logout': '<path d="M14 4.5h4.5v15H14M10 8.5 6.5 12l3.5 3.5M6.5 12H15"/>'
  };

  let sprite = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true">';
  for (const [id, body] of Object.entries(icons)) sprite += stroke(id, body);
  // Bunga kantan (torch ginger): waxy bracts in two rings
  sprite += `<symbol id="bloom" viewBox="-50 -50 100 100"><g fill="currentColor">${petals(16, 31, 7.6, 17)}<circle r="30"/></g></symbol>`;
  sprite += `<symbol id="bloom-line" viewBox="-50 -50 100 100"><g fill="none" stroke="currentColor" stroke-width="1.7">${petals(16, 33, 7, 15)}</g></symbol>`;
  sprite += `<symbol id="bloom-mini" viewBox="-50 -50 100 100"><g fill="currentColor">${petals(9, 26, 12, 22)}<circle r="20" fill-opacity=".55"/></g></symbol>`;
  sprite += '</svg>';
  document.body.insertAdjacentHTML('afterbegin', sprite);
})();
