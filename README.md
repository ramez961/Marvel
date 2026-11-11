# Marvel release and story timelines

A Marvel catch-up watch guide, starting with Blade (1998), with a single branching timeline and a Release order / Story order switch. Earlier releases are outside this guide.

## Open

Open `index.html`, or run `npm start` and visit http://127.0.0.1:4173. No dependencies are required.

## Release order

Starts with Blade (August 21, 1998). All projects released before that cutoff are removed from the catalog. Released projects progress by their original release dates. Announced upcoming projects follow with Scheduled and Coming soon labels. The November 11, 2026 catalog includes Avengers: Doomsday (December 18, 2026), Spider-Man: Beyond the Spider-Verse (June 18, 2027), and Avengers: Secret Wars (December 17, 2027).

The catalog contains 260 records: 197 have exact release dates and 63 retain year precision. Within a year, entries with no verified day follow dated released projects; their ordering is not a verified day-by-day sequence. Upcoming projects remain after released entries. Series occupy one entry at their first premiere; this is not a season-by-season release catalog. Alternate edits, regional reissues and some promotional compilations share their original title's entry.

## Story order

Uses separate story-setting metadata from `story-order.js`, sorted by story year across the catalog. It no longer restarts by franchise. The requested wartime start is represented by a 1944 anchor for Captain America: The First Avenger, whose principal story spans 1943–1945. Cards display that range separately from their actual release date.

87 projects currently have curated story-year placements. Stories in the same year use a viewing rank; this does not assert a precisely dated day-by-day chronology. Continuity labels distinguish MCU, Fox, Sony, alternate worlds and time-travel branches, even where their story years coincide.

Three expandable sections keep the remaining projects accessible outside the linear story spine:

- Earlier eras and nonlinear stories: Eyes of Wakanda spans 1260 BC–1896; Loki and other multiverse stories do not fit a single linear date. The wartime starting point is a requested viewing convention, not a claim that all Marvel stories begin in 1944.
- Story placement not established: no fictional year has been invented for these titles, standalone projects or documentaries. They retain release ordering in this section.
- Upcoming projects: release dates are known, but story dates have not been assumed.

Series appear once at their initial storyline, so later seasons can span subsequent years. Flashbacks and post-credit scenes do not determine the principal placement. Approximate and disputed dating is labeled on cards. Story order is curated, not a verified import of Marvel's official current timeline or a claim that separate universes share one continuity.

## Add watch links

MovizLand matching was checked on November 11, 2026. There are 104 linked entries, including the original owner-provided Blade link. Another 153 released entries had no verified match, and 3 upcoming films remain unlinked. All 260 catalog entries were accounted for. `link-audit.json` records matches, evidence pages and unmatched titles. HTTP responses and title identity were checked; video playback and availability can change independently.

Movie links open verified title/watch pages. Series use an all-seasons page where found, otherwise a verified first-season page with episode selection. Exact title checks reject similarly named works such as making-of documentaries. Existing owner-supplied destinations are preserved. Added records include `watchSource`, `watchCheckedAt` and `watchPageType` for maintenance.

Find a title in `catalog.js` and replace its empty `url` with the desired HTTP/HTTPS destination. The entire card becomes clickable in either mode. Existing watch links are preserved during catalog updates. The site hosts no video files.

## Maintain the catalog

Keep new records within the guide’s release scope (Blade, August 21, 1998 onward). The cutoff applies to publication dates, not fictional settings: The First Avenger (2011) still belongs in Story order’s wartime opening. Add records to `catalog.js` with a unique `id`, `title`, `date` (`YYYY-MM-DD` or `YYYY`), `type` (`movie`, `series`, `special`), `collection`, `collections`, `studios`, `animated`, `url` and `source`. Set `status: "upcoming"` for announced future releases; remove the status after release. Add separate story metadata only when supported. The application does not derive fictional dates from release dates.

The page does not fetch new releases automatically. Request a catalog refresh or supply new links to update it. No recurring automation has been set up.

## Sources

The initial broad catalog includes Marvel Studios, Fox, Sony, older films, television, animation, shorts, web series, motion comics, documentaries, and Marvel imprints. It is not a guarantee that every regional compilation or promotional video has been captured.

- https://en.wikipedia.org/wiki/List_of_films_based_on_Marvel_Comics_publications
- https://en.wikipedia.org/wiki/List_of_television_series_based_on_Marvel_Comics_publications
- https://en.wikipedia.org/wiki/Marvel_Cinematic_Universe_timeline
- https://en.wikipedia.org/wiki/X-Men_(film_series)#Timeline
- https://movies.disney.com/avengers-doomsday
- https://www.sonypicturesanimation.com/index.php/projects/films/spider-man-beyond-spider-verse
- https://www.disneyplus.com/explore/articles/marvel-movies-in-order
- https://thewaltdisneycompany.com/news/marvel-television-visionquest-disney-plus/

Each record retains its catalog source; newly audited release dates also retain their title-specific `releaseDateSource` where available. Modern film dates generally use US theatrical release; television and older works use their initial broadcast or available original release data.

The owner-provided https://www.marvel.com/articles/movies/mcu-timeline-order-disney-plus returned HTTP 403 during verification and has not been represented as a verified exact import.

## Check

`npm run check` checks JavaScript syntax. Google Fonts are optional; system fallbacks keep the page usable offline.
