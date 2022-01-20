## core

- media cards
  - [x] design
  - bookmark button
    - [x] when logged out, show an auth required message in a modal or tooltip
    - when logged in
      - [ ] if not on list, show bookmark icon, add to bookmarks on click
      - if on list, show edit menu icon which pops a menu on open
        - [ ] hold
        - [ ] drop
        - [ ] remove
        - [ ] rate -> shows a modal to rate the anime
        - [ ] set progress -> shows a modal to set the progress
  - [ ] links button, pops a menu on open, lists all the media external links
  - [ ] advance progress button, only show when on list and when progress is not 100%, advance progress by 1 on click
  - [ ] show watched count somewhere?
- [ ] schedule page
- [ ] watching page
- [x] deal with timezone difference between server and client
  - just using a fixed time zone for now. a setting can come later, and/or some client-side redirect to set the timezone

## ideas

- [ ] show a pretty banner on the user menu, like in anigreen fly
- settings
  - general
    - [ ] media title format
    - [ ] time zone
  - schedule
    - [ ] adult
    - [ ] country of origin
    - [ ] licensed
- [ ] search page
- [ ] show a loading spinner in the corner while loading or navigating
- [ ] click on a cover/banner to view the full image in a lightbox modal (or just in a new tab lol)
- [ ] media card: show full title in tooltip
