// Story settings are independent from release dates. Principal storyline only;
// one slot per series, approximate placements explicitly labeled, flashbacks excluded.
// References: https://en.wikipedia.org/wiki/Marvel_Cinematic_Universe_timeline
// https://en.wikipedia.org/wiki/X-Men_(film_series)#Timeline
(() => {
  const placements = {};
  const rows = `Captain America: The First Avenger|2011|movie|1944|1943–1945|MCU
Agent Carter|2013|special|1946||MCU
Agent Carter|2015|series|1946|1946–1947|MCU
X-Men: First Class|2011|movie|1962||Fox · X-Men
The Fantastic Four: First Steps|2025|movie|1964||MCU · Earth-828
X-Men: Days of Future Past|2014|movie|1973|1973 / 2023 · time travel|Fox · X-Men
X-Men Origins: Wolverine|2009|movie|1979|1979 · main story|Fox · Original X-Men
X-Men: Apocalypse|2016|movie|1983||Fox · Revised X-Men
Dark Phoenix|2019|movie|1992||Fox · Revised X-Men
Captain Marvel|2019|movie|1995||MCU
X-Men|2000|movie|2000|Early 2000s|Fox · Original X-Men
Spider-Man|2002|movie|2002||Sony · Raimi
X2|2003|movie|2003|Early 2000s|Fox · Original X-Men
Spider-Man 2|2004|movie|2004||Sony · Raimi
Spider-Man 3|2007|movie|2005||Sony · Raimi
X-Men: The Last Stand|2006|movie|2006|Mid-2000s|Fox · Original X-Men
Iron Man|2008|movie|2008||MCU
Iron Man 2|2010|movie|2010||MCU
The Incredible Hulk|2008|movie|2010||MCU
A Funny Thing Happened on the Way to Thor's Hammer|2011|special|2010||MCU
Thor|2011|movie|2010||MCU
The Consultant|2011|special|2010||MCU
The Avengers|2012|movie|2012||MCU
Item 47|2012|special|2012||MCU
The Amazing Spider-Man|2012|movie|2012||Sony · Amazing Spider-Man
Iron Man 3|2013|movie|2012|Christmas 2012|MCU
The Wolverine|2013|movie|2013||Fox · Original X-Men
Thor: The Dark World|2013|movie|2013||MCU
All Hail the King|2014|special|2013||MCU
Agents of S.H.I.E.L.D.|2013|series|2013|2013 onward · multiple seasons / time travel|Marvel Television
The Amazing Spider-Man 2|2014|movie|2014||Sony · Amazing Spider-Man
Captain America: The Winter Soldier|2014|movie|2014||MCU
Guardians of the Galaxy|2014|movie|2014||MCU
Guardians of the Galaxy Vol. 2|2017|movie|2014||MCU
I Am Groot|2022|series|2014|Around 2014|MCU
Daredevil|2015|series|2014|2014–2018 · multiple seasons|MCU
Jessica Jones|2015|series|2015|2015–2019 · multiple seasons|MCU
Avengers: Age of Ultron|2015|movie|2015||MCU
Ant-Man|2015|movie|2015||MCU
Luke Cage|2016|series|2015|2015 onward · multiple seasons|MCU
Iron Fist|2017|series|2016|2016 onward · multiple seasons|MCU
The Defenders|2017|series|2016||MCU
Captain America: Civil War|2016|movie|2016||MCU
Black Widow|2021|movie|2016||MCU
Black Panther|2018|movie|2016||MCU
Spider-Man: Homecoming|2017|movie|2016||MCU
The Punisher|2017|series|2016|2016 onward · multiple seasons|MCU
Doctor Strange|2016|movie|2016|2016–2017|MCU
Deadpool|2016|movie|2016|Mid-2010s|Fox · Deadpool
Thor: Ragnarok|2017|movie|2017|2017–2018|MCU
Deadpool 2|2018|movie|2018|Late 2010s · time travel|Fox · Deadpool
Ant-Man and the Wasp|2018|movie|2018||MCU
Avengers: Infinity War|2018|movie|2018||MCU
Venom|2018|movie|2018||Sony · Venom
Venom: Let There Be Carnage|2021|movie|2019|After Venom · approximate|Sony · Venom
Venom: The Last Dance|2024|movie|2019|After Let There Be Carnage · approximate|Sony · Venom
Avengers: Endgame|2019|movie|2023|2018 / 2023 · time travel|MCU
WandaVision|2021|series|2023||MCU
Shang-Chi and the Legend of the Ten Rings|2021|movie|2024||MCU
The Falcon and the Winter Soldier|2021|series|2024||MCU
Spider-Man: Far From Home|2019|movie|2024||MCU
Eternals|2021|movie|2024|2024 · main story, with ancient flashbacks|MCU
Spider-Man: No Way Home|2021|movie|2024||MCU
Doctor Strange in the Multiverse of Madness|2022|movie|2024||MCU
Hawkeye|2021|series|2024|Christmas 2024|MCU
Moon Knight|2022|series|2025||MCU
Black Panther: Wakanda Forever|2022|movie|2025||MCU
Echo|2024|series|2025||MCU
She-Hulk: Attorney at Law|2022|series|2025||MCU
Ms. Marvel|2022|series|2025||MCU
Thor: Love and Thunder|2022|movie|2025||MCU
Ironheart|2025|series|2025||MCU
Werewolf by Night|2022|special|2025|Approximate placement|MCU
The Guardians of the Galaxy Holiday Special|2022|special|2025|Christmas 2025|MCU
Ant-Man and the Wasp: Quantumania|2023|movie|2026||MCU
Guardians of the Galaxy Vol. 3|2023|movie|2026||MCU
Secret Invasion|2023|series|2026||MCU
The Marvels|2023|movie|2026||MCU
Agatha All Along|2024|series|2026||MCU
Daredevil: Born Again|2025|series|2026|2026 onward · multiple seasons|MCU
Captain America: Brave New World|2025|movie|2027||MCU
Thunderbolts*|2025|movie|2027||MCU
The Punisher: One Last Kill|2026|special|2027|Around Born Again season 2|MCU
Wonder Man|2026|series|2027|Curated placement · disputed dating|MCU
Spider-Man: Brand New Day|2026|movie|2028||MCU
VisionQuest|2026|series|2028||MCU
Logan|2017|movie|2029||Fox · Wolverine`;
  rows.split('\n').forEach((row, rank) => {
    const [title, releaseYear, type, year, period, continuity] = row.split('|');
    const entry = window.MARVEL_CATALOG.releases.find(item => item.title === title && item.date.startsWith(releaseYear) && item.type === type);
    if (!entry) throw new Error(`Story entry not found: ${title} (${releaseYear}, ${type})`);
    placements[entry.id] = { year: Number(year), period: period || year, continuity, rank };
  });
  const nonLinear = {};
  for (const entry of window.MARVEL_CATALOG.releases) {
    if (['Eyes of Wakanda','Loki','What If...?','Marvel Zombies','Deadpool & Wolverine'].includes(entry.title)) {
      nonLinear[entry.id] = entry.title === 'Eyes of Wakanda' ? '1260 BC–1896 · anthology spanning earlier eras' : 'Multiple timelines / outside a single linear chronology';
    }
  }
  window.MARVEL_STORY_ORDER = { placements, nonLinear };
})();
