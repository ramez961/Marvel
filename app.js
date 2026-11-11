(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const state = { type: 'all', query: '', year: 'all', collection: 'all', order: 'asc' };
  const catalog = window.MARVEL_CATALOG;
  // Stable IDs and watch URLs are kept in catalog.js so updates never require layout edits.
  const sortDate = entry => entry.date.length === 4 ? entry.date + '-12-32' : entry.date;
  const all = [...catalog.releases].sort((a, b) => sortDate(a).localeCompare(sortDate(b)) || a.id.localeCompare(b.id));
  const numbers = new Map(all.map((entry, index) => [entry.id, String(index + 1).padStart(2, '0')]));
  const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  function safeUrl(value) {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  [...new Set(all.map(entry => entry.date.slice(0, 4)))].sort().forEach(year => {
    const option = element('option', '', year); option.value = year; $('#year').append(option);
  });
  function card(entry) {
    const url = safeUrl(entry.url);
    const node = element(url ? 'a' : 'article', `release${url ? ' available' : ''}`);
    if (url) { node.href = url; node.setAttribute('aria-label', `Watch ${entry.title}`); }
    node.append(element('span', 'release-number', numbers.get(entry.id)));
    const main = element('div', 'release-main');
    const meta = element('div', 'release-meta');
    meta.append(element('span', `kind ${entry.type}`, {movie:'Movie',series:'Series',special:'Special / short'}[entry.type]));
    const time = element('time', '', entry.date.length === 4 ? entry.date : dateFormat.format(new Date(entry.date + 'T00:00:00Z')));
    time.dateTime = entry.date; meta.append(time);
    meta.append(element('span', 'phase', {mcu:'MCU',fox:'Fox',sony:'Sony',animation:'Animation',imprints:'Marvel imprints',other:'Classics & other',documentary:'Documentary'}[entry.collection]));
    main.append(meta, element('h3', '', entry.title)); node.append(main);
    const status = element('span', 'release-status', url ? 'Watch now ' : 'Link coming soon');
    node.append(status); return node;
  }
  function render() {
    let entries = all.filter(entry => (state.type === 'all' || entry.type === state.type)
      && entry.title.toLocaleLowerCase().includes(state.query.toLocaleLowerCase())
      && (state.year === 'all' || entry.date.startsWith(state.year))
      && (state.collection === 'all' || (entry.collections || [entry.collection]).includes(state.collection)));
    if (state.order === 'desc') entries = entries.reverse();
    const fragment = document.createDocumentFragment();
    let currentYear, items;
    for (const entry of entries) {
      const year = entry.date.slice(0, 4);
      if (year !== currentYear) {
        currentYear = year;
        const group = element('section', 'year-group');
        group.setAttribute('aria-label', `Releases in ${year}`);
        const heading = element('h3', 'year-heading', year);
        const count = entries.filter(item => item.date.startsWith(year)).length;
        heading.append(element('span', '', `${count} RELEASE${count === 1 ? '' : 'S'}`));
        items = element('div', 'year-items'); group.append(heading, items); fragment.append(group);
      }
      items.append(card(entry));
    }
    $('#releases').replaceChildren(fragment);
    $('#count').textContent = `${entries.length} of ${all.length} releases`;
    $('#empty').hidden = entries.length > 0;
  }
  function updateTabs() {
    document.querySelectorAll('[data-type]').forEach(button => {
      const active = state.type === button.dataset.type;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
  }
  document.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => {
    state.type = button.dataset.type; updateTabs(); render();
  }));
  $('#search').addEventListener('input', event => { state.query = event.target.value.trim(); render(); });
  ['year', 'collection', 'order'].forEach(key => $('#' + key).addEventListener('change', event => {
    state[key] = event.target.value; render();
  }));
  $('#reset').addEventListener('click', () => {
    Object.assign(state, { type: 'all', query: '', year: 'all', collection: 'all', order: 'asc' });
    $('#search').value = ''; $('#year').value = 'all'; $('#collection').value = 'all'; $('#order').value = 'asc';
    updateTabs(); render(); $('#search').focus();
  });
  render();
})();
