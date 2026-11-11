# Marvel release timeline

A simple, responsive Marvel screen-release timeline. No dependencies or build step.

## Open

Open `index.html` directly, or run `npm start` and visit http://127.0.0.1:4173.

## Add watch links

In `catalog.js`, find the title and replace its empty `url` with the link you want it to open. The entire timeline card becomes a link. Only HTTP and HTTPS URLs are accepted. Navigation stays in the same tab. Titles without links display “Link coming soon.”

Links are intentionally empty until supplied by the owner. The site hosts no video files.

## Add releases

Add an object to `releases` in `catalog.js`:

```js
{
  "id": "unique-title-2026-movie",
  "title": "New title",
  "date": "2026-11-11",
  "type": "movie",
  "collection": "sony",
  "collections": ["sony"],
  "animated": false,
  "studios": "Sony Pictures",
  "url": "",
  "source": "https://example.com/official-release-announcement"
}
```

Types: `movie`, `series`, `special`. Collections: `mcu`, `fox`, `sony`, `animation`, `imprints`, `other`, `documentary`. Collections can overlap: a Sony animated movie has `["animation", "sony"]`. MCU is a continuity label; Fox and Sony identify studio collections, not shared continuities.

Dates accept `YYYY-MM-DD` or `YYYY`. The timeline groups by year and sorts exact dates in release order. Year-only entries appear after dated entries in that year, alphabetically; they do not imply a verified day-by-day order. Update the reviewed date in `index.html` and `catalog.js` after catalog changes.

## Coverage and sources

Initial catalog: 310 entries, from the 1944 Captain America serial through releases known as of November 11, 2026. Includes MCU, Fox, Sony, older live-action films, TV movies, animation, web series, shorts, motion comics, documentaries and Marvel imprints such as Men in Black and Kingsman. Series are listed once at their initial premiere; seasons and episodes are not separate entries. Upcoming, canceled and unaired productions are excluded from the released timeline. Alternate edits and reissues generally share their original title's entry.

This is a broad initial catalog, not a claim that every regional compilation or promotional video is verified. Older entries retain year precision where a day has not been verified. Movie dates generally use US theatrical release; series dates use their original premiere. Correct or expand entries as needed.

Catalog reference lists (each record retains its source):

- https://en.wikipedia.org/wiki/List_of_films_based_on_Marvel_Comics_publications
- https://en.wikipedia.org/wiki/List_of_television_series_based_on_Marvel_Comics_publications

Recent release checks:

- https://www.disneyplus.com/explore/articles/marvel-movies-in-order
- https://thewaltdisneycompany.com/news/marvel-television-visionquest-disney-plus/
- https://thewaltdisneycompany.com/news/marvel-television-wonder-man/
- https://thewaltdisneycompany.com/news/the-punisher-one-last-kill/
- https://www.aboutamazon.com/news/entertainment/prime-video-movies-tv-shows-music-sports-may-2026

The catalog is maintained in this repository. It does not automatically fetch new releases or update itself. Provide new watch links or request a catalog refresh to update the page. No scheduled automation has been created.

Google Fonts are optional; local fallback fonts keep the page usable offline.

## Check

`npm run check` checks JavaScript syntax. Preview the page to verify filters, responsive layout, and navigation after adding links.
