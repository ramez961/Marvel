(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const state = { view: 'release' };
  const catalog = window.MARVEL_CATALOG;
  const storyOrder = window.MARVEL_STORY_ORDER;
  // Stable IDs and watch URLs are kept in catalog.js so updates never require layout edits.
  const sortDate = entry => entry.date.length === 4 ? entry.date + '-12-32' : entry.date;
  const upcoming = entry => entry.status === 'upcoming';
  const byRelease = (a, b) => Number(upcoming(a)) - Number(upcoming(b)) || sortDate(a).localeCompare(sortDate(b)) || a.id.localeCompare(b.id);
  const all = [...catalog.releases].sort(byRelease);
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
  function card(entry, storyNumber, storySetting) {
    const url = safeUrl(entry.url);
    const node = element(url ? 'a' : 'article', `release${url ? ' available' : ''}`);
    if (url) { node.href = url; node.setAttribute('aria-label', `Watch ${entry.title}`); }
    node.append(element('span', 'release-number', storyNumber === undefined ? numbers.get(entry.id) : String(storyNumber).padStart(2, '0')));
    const main = element('div', 'release-main');
    const meta = element('div', 'release-meta');
    const isOriginalSerial = entry.id === 'captain-america-1944-special';
    meta.append(element('span', `kind ${entry.type}`, isOriginalSerial ? 'Theatrical serial' : {movie:'Movie',series:'Series',special:'Special / short'}[entry.type]));
    const releaseLabel = upcoming(entry) ? 'Scheduled' : entry.type === 'series' ? 'Premiered' : 'Released';
    const releaseDate = entry.date.length === 4 ? entry.date : dateFormat.format(new Date(entry.date + 'T00:00:00Z'));
    const time = element('time', '', `${releaseLabel} ${releaseDate}`);
    time.dateTime = entry.date; meta.append(time);
    meta.append(element('span', 'phase', storySetting?.continuity || {mcu:'MCU',fox:'Fox',sony:'Sony',animation:'Animation',imprints:'Marvel imprints',other:'Classics & other',documentary:'Documentary'}[entry.collection]));
    const displayTitle = isOriginalSerial ? 'Captain America (1944 serial)' : entry.title;
    main.append(meta, element('h3', '', displayTitle)); node.append(main);
    if (storySetting) main.append(element('p', 'story-setting', `Story: ${storySetting.period}`));
    if (!storySetting && state.view === 'story' && storyOrder.nonLinear[entry.id]) main.append(element('p', 'story-setting', storyOrder.nonLinear[entry.id]));
    const status = element('span', 'release-status', upcoming(entry) ? 'Coming soon' : url ? 'Watch now' : 'Link coming soon');
    node.append(status); return node;
  }
  function render() {
    const storyView = state.view === 'story';
    const entries = storyView ? all.filter(entry => storyOrder.placements[entry.id]) : [...all];
    if (storyView) entries.sort((a, b) => {
      const left = storyOrder.placements[a.id];
      const right = storyOrder.placements[b.id];
      return left.year - right.year || left.rank - right.rank || byRelease(a, b);
    });
    const grouping = entry => storyView ? String(storyOrder.placements[entry.id].year) : `${upcoming(entry) ? 'upcoming-' : ''}${entry.date.slice(0, 4)}`;
    const groupCounts = new Map();
    entries.forEach(entry => { const key = grouping(entry); groupCounts.set(key, (groupCounts.get(key) || 0) + 1); });
    $('#timeline-heading').textContent = storyView ? 'Story timeline' : 'Release timeline';
    const fragment = document.createDocumentFragment();
    let currentGroup, items;
    let branchIndex = 0;
    for (const entry of entries) {
      const groupKey = grouping(entry);
      if (groupKey !== currentGroup) {
        currentGroup = groupKey;
        const label = groupKey.replace('upcoming-', '');
        const group = element('section', 'year-group');
        group.setAttribute('aria-label', storyView ? `Stories set around ${label}` : `${upcoming(entry) ? 'Upcoming releases' : 'Releases'} in ${label}`);
        const heading = element('h3', 'year-heading', label);
        const count = groupCounts.get(groupKey);
        heading.append(element('span', '', `${storyView ? 'STORY YEAR · ' : upcoming(entry) ? 'COMING SOON · ' : ''}${count} ${storyView ? 'PROJECT' : 'RELEASE'}${count === 1 ? '' : 'S'}`));
        items = element('div', 'year-items'); group.append(heading, items); fragment.append(group);
      }
      const branch = element('div', `branch ${branchIndex % 2 === 0 ? 'branch-left' : 'branch-right'}`);
      branchIndex++;
      branch.append(card(entry, storyView ? branchIndex : undefined, storyView ? storyOrder.placements[entry.id] : undefined));
      items.append(branch);
    }
    $('#releases').replaceChildren(fragment);
    const extras = $('#story-extras');
    extras.hidden = !storyView;
    extras.replaceChildren();
    if (storyView) {
      const extraGroups = [
        ['Earlier eras & nonlinear stories', entry => Boolean(storyOrder.nonLinear[entry.id])],
        ['Story placement not established', entry => !storyOrder.placements[entry.id] && !storyOrder.nonLinear[entry.id] && !upcoming(entry)],
        ['Upcoming · story placement unannounced', entry => upcoming(entry)]
      ];
      for (const [label, matches] of extraGroups) {
        const extraEntries = all.filter(matches);
        if (!extraEntries.length) continue;
        const details = element('details', 'story-extra-group');
        details.append(element('summary', '', `${label} (${extraEntries.length})`));
        const list = element('div', 'story-extra-list');
        extraEntries.forEach(entry => list.append(card(entry)));
        details.append(list); extras.append(details);
      }
    }
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
