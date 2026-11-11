// Curated viewing chronology within separate continuities, not one shared Marvel timeline.
// Series occupy one slot at their initial storyline. Unmapped titles stay explicitly unplaced.
// References: https://en.wikipedia.org/wiki/Marvel_Cinematic_Universe_timeline
// https://en.wikipedia.org/wiki/X-Men_(film_series)#Timeline
(() => {
  const groups = [];
  const placements = {};
  function group(id, label, titles) {
    const groupIndex = groups.length;
    groups.push({ id, label });
    titles.forEach(([title, year, type = 'movie'], rank) => {
      const entry = window.MARVEL_CATALOG.releases.find(item => item.title === title && item.date.startsWith(String(year)) && item.type === type);
      if (!entry) throw new Error(`Story entry not found: ${title} (${year}, ${type})`);
      if (placements[entry.id]) throw new Error(`Duplicate story placement: ${entry.id}`);
      placements[entry.id] = { group: id, groupIndex, rank };
    });
  }
  group('mcu', 'MCU · Main timeline', [
    ['Eyes of Wakanda',2025,'series'],
    ['Captain America: The First Avenger',2011],
    ['Agent Carter',2013,'special'],['Agent Carter',2015,'series'],
    ['Captain Marvel',2019],['Iron Man',2008],['Iron Man 2',2010],
    ['The Incredible Hulk',2008],['A Funny Thing Happened on the Way to Thor\'s Hammer',2011,'special'],
    ['Thor',2011],['The Consultant',2011,'special'],['The Avengers',2012],['Item 47',2012,'special'],
    ['Thor: The Dark World',2013],['Iron Man 3',2013],['All Hail the King',2014,'special'],
    ['Captain America: The Winter Soldier',2014],['Guardians of the Galaxy',2014],
    ['Guardians of the Galaxy Vol. 2',2017],['I Am Groot',2022,'series'],
    ['Daredevil',2015,'series'],['Jessica Jones',2015,'series'],
    ['Avengers: Age of Ultron',2015],['Ant-Man',2015],['Luke Cage',2016,'series'],
    ['Iron Fist',2017,'series'],['The Defenders',2017,'series'],
    ['Captain America: Civil War',2016],['Black Widow',2021],['Black Panther',2018],
    ['The Punisher',2017,'series'],['Spider-Man: Homecoming',2017],
    ['Doctor Strange',2016],['Thor: Ragnarok',2017],['Ant-Man and the Wasp',2018],
    ['Avengers: Infinity War',2018],['Avengers: Endgame',2019],
    ['WandaVision',2021,'series'],['Shang-Chi and the Legend of the Ten Rings',2021],
    ['The Falcon and the Winter Soldier',2021,'series'],['Spider-Man: Far From Home',2019],
    ['Eternals',2021],['Spider-Man: No Way Home',2021],
    ['Doctor Strange in the Multiverse of Madness',2022],['Hawkeye',2021,'series'],
    ['Moon Knight',2022,'series'],['Black Panther: Wakanda Forever',2022],['Echo',2024,'series'],
    ['She-Hulk: Attorney at Law',2022,'series'],['Ms. Marvel',2022,'series'],
    ['Thor: Love and Thunder',2022],['Ironheart',2025,'series'],['Werewolf by Night',2022,'special'],
    ['The Guardians of the Galaxy Holiday Special',2022,'special'],
    ['Ant-Man and the Wasp: Quantumania',2023],['Guardians of the Galaxy Vol. 3',2023],
    ['Secret Invasion',2023,'series'],['The Marvels',2023],['Agatha All Along',2024,'series'],
    ['Daredevil: Born Again',2025,'series'],['Captain America: Brave New World',2025],
    ['Thunderbolts*',2025],['The Punisher: One Last Kill',2026,'special'],
    ['Wonder Man',2026,'series'],['Spider-Man: Brand New Day',2026],['VisionQuest',2026,'series']
  ]);
  // Time travel changes the X-Men continuity. Shared prequels and the reset are shown
  // before the two branches; neither branch is presented as a continuation of the other.
  group('xmen-prequels','Fox · X-Men origins & timeline split',[
    ['X-Men: First Class',2011],['X-Men: Days of Future Past',2014]
  ]);
  group('xmen-original','Fox · Original X-Men branch',[
    ['X-Men Origins: Wolverine',2009],['X-Men',2000],['X2',2003],
    ['X-Men: The Last Stand',2006],['The Wolverine',2013]
  ]);
  group('xmen-revised','Fox · Revised X-Men branch',[
    ['X-Men: Apocalypse',2016],['Dark Phoenix',2019]
  ]);
  group('raimi','Sony · Spider-Man / Raimi',[
    ['Spider-Man',2002],['Spider-Man 2',2004],['Spider-Man 3',2007]
  ]);
  group('amazing','Sony · The Amazing Spider-Man',[
    ['The Amazing Spider-Man',2012],['The Amazing Spider-Man 2',2014]
  ]);
  group('venom','Sony · Venom',[
    ['Venom',2018],['Venom: Let There Be Carnage',2021],['Venom: The Last Dance',2024]
  ]);
  group('spiderverse','Sony · Animated Spider-Verse',[
    ['Spider-Man: Into the Spider-Verse',2018],['Spider-Man: Across the Spider-Verse',2023]
  ]);
  group('fox-fantastic','Fox · Fantastic Four',[
    ['Fantastic Four',2005],['Fantastic Four: Rise of the Silver Surfer',2007]
  ]);
  group('blade','Blade',[
    ['Blade',1998],['Blade II',2002],['Blade: Trinity',2004],['Blade: The Series',2006,'series']
  ]);
  group('ghost-rider','Sony · Ghost Rider',[
    ['Ghost Rider',2007],['Ghost Rider: Spirit of Vengeance',2012]
  ]);
  group('daredevil-fox','Fox · Daredevil & Elektra',[
    ['Daredevil',2003],['Elektra',2005]
  ]);
  group('hulk-classic','Classic Hulk',[
    ['The Incredible Hulk',1977,'movie'],['Return of the Incredible Hulk',1977,'movie'],
    ['The Incredible Hulk',1977,'series'],['The Incredible Hulk: Married',1978,'movie'],
    ['The Incredible Hulk Returns',1988],['The Trial of the Incredible Hulk',1989],
    ['The Death of the Incredible Hulk',1990]
  ]);
  window.MARVEL_STORY_ORDER = { groups, placements };
})();
