(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const state = { view: 'release' };
  const catalog = window.MARVEL_CATALOG;
  const storyOrder = window.MARVEL_STORY_ORDER;
  // Stable IDs and watch URLs are kept in catalog.js so updates never require layout edits.
  const sortDate = entry => entry.date.length === 4 ? entry.date + '-12-32' : entry.date;
  const all = [...catalog.releases].sort((a, b) => sortDate(a).localeCompare(sortDate(b)) || a.id.localeCompare(b.id));
  const numbers = new Map(all.map((entry, index) => [entry.id, String(index + 1).padStart(2, '0')]));
  const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
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
  function card(entry, storyNumber) {
    const url = safeUrl(entry.url);
    const node = element(url ? 'a' : 'article', `release${url ? ' available' : ''}`);
    if (url) { node.href = url; node.setAttribute('aria-label', `Watch ${entry.title}`); }
    node.append(element('span', 'release-number', storyNumber === undefined ? numbers.get(entry.id) : String(storyNumber).padStart(2, '0')));
    const main = element('div', 'release-main');
    const meta = element('div', 'release-meta');
    const isOriginalSerial = entry.id === 'captain-america-1944-special';
    meta.append(element('span', `kind ${entry.type}`, isOriginalSerial ? 'Theatrical serial' : {movie:'Movie',series:'Series',special:'Special / short'}[entry.type]));
    const releaseLabel = entry.type === 'series' ? 'Premiered' : 'Released';
    const releaseDate = entry.date.length === 4 ? entry.date : dateFormat.format(new Date(entry.date + 'T00:00:00Z'));
    const time = element('time', '', `${releaseLabel} ${releaseDate}`);
    time.dateTime = entry.date; meta.append(time);
    meta.append(element('span', 'phase', {mcu:'MCU',fox:'Fox',sony:'Sony',animation:'Animation',imprints:'Marvel imprints',other:'Classics & other',documentary:'Documentary'}[entry.collection]));
    const displayTitle = isOriginalSerial ? 'Captain America (1944 serial)' : entry.title;
    main.append(meta, element('h3', '', displayTitle)); node.append(main);
    const status = element('span', 'release-status', url ? 'Watch now ' : 'Link coming soon');
    node.append(status); return node;
  }
  function render() {
    const entries = [...all];
    const storyView = state.view === 'story';
    if (storyView) entries.sort((a, b) => {
      const left = storyOrder.placements[a.id];
      const right = storyOrder.placements[b.id];
      return (left?.groupIndex ?? 999) - (right?.groupIndex ?? 999)
        || (left?.rank ?? 999) - (right?.rank ?? 999)
        || sortDate(a).localeCompare(sortDate(b)) || a.id.localeCompare(b.id);
    });
    const grouping = entry => storyView ? (storyOrder.placements[entry.id]?.group || 'unplaced') : entry.date.slice(0, 4);
    const groupCounts = new Map();
    entries.forEach(entry => { const key = grouping(entry); groupCounts.set(key, (groupCounts.get(key) || 0) + 1); });
    $('#timeline-heading').textContent = storyView ? 'Story timeline' : 'Release timeline';
    const fragment = document.createDocumentFragment();
    let currentGroup, items, groupNumber = 0;
    let branchIndex = 0;
    for (const entry of entries) {
      const groupKey = grouping(entry);
      if (groupKey !== currentGroup) {
        currentGroup = groupKey;
        groupNumber = 0;
        const label = storyView ? (storyOrder.groups.find(group => group.id === groupKey)?.label || 'Story placement unconfirmed') : groupKey;
        const group = element('section', `year-group${storyView ? ' story-group' : ''}`);
        group.setAttribute('aria-label', storyView ? label : `Releases in ${label}`);
        const heading = element('h3', 'year-heading', label);
        const count = groupCounts.get(groupKey);
        heading.append(element('span', '', storyView && groupKey === 'unplaced' ? `${count} TITLES · RELEASE ORDER` : `${count} RELEASE${count === 1 ? '' : 'S'}`));
        items = element('div', 'year-items'); group.append(heading, items); fragment.append(group);
      }
      const branch = element('div', `branch ${branchIndex++ % 2 === 0 ? 'branch-left' : 'branch-right'}`);
      branch.append(card(entry, storyView ? ++groupNumber : undefined));
      items.append(branch);
    }
    $('#releases').replaceChildren(fragment);
  }
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    state.view = button.dataset.view;
    document.querySelectorAll('[data-view]').forEach(tab => {
      const active = tab.dataset.view === state.view;
      tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active));
    });
    render();
  }));
  render();
})();
