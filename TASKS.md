# Tasks

## Active

- [ ] **ABOUT: Add large-format opening image** - new hero image at top of About page, move "No Geographic Limits" text below it
- [ ] **FOOTER: Merge Contact into Footer** - remove Contact as standalone page/nav item; "Let's Work Together" stays footer focal headline, contact details organized within footer
- [ ] **WORK: Update project layout** - alternate single-video blocks with vertically-stacked two-video blocks in horizontal scroll, per reference

## Waiting On

- [ ] **WP-admin nav cleanup** - since 2026-11-09 - remove "Services" and "Contact" from the WP primary/footer menus once their pages are merged away; Header/Footer pull menu items live from WordPress, not hardcoded in this repo, so this needs a wp-admin edit, not a code change

## Someday

## Done

- [x] ~~HOME: Build preloader~~ (2026-11-09) - red bg, centered white logo, fade-out
- [x] ~~HOME: Rework initial layout + scroll behavior~~ (2026-11-09) - centered wordmark, social left / nav right
- [x] ~~HOME: Featured Work carousel~~ (2026-11-09) - already built (HomeFeaturedWork + WorkItemMedia, hover-autoplay cursor-follow preview), already wired below HomeHero; no change needed
  - ⚠️ client flagged this item as possibly chargeable extra - since it turned out to already exist, flag to client that no new dev cost applies here
- [x] ~~GENERAL: Add cinematic grain texture~~ (2026-11-09) - removed from hero video, added to Footer/AboutHero/AboutGallery/HomeCTA/ServicesCTA (already present elsewhere); sections with internal position:sticky skipped as a follow-up (see commit)
- [x] ~~GENERAL: Adjust color scheme~~ (2026-11-09) - confirmed with user: red stays an accent (preloader, footer CTA, hero curtain, services tint), dark theme stays the base. No further change.
- [x] ~~GENERAL: Custom typography treatment~~ (2026-11-09) - HomeCTA's "Let's Collaborate"/"Colaboremos" heading switched to the display font, one "E" stretched to echo the logo's elongated stroke
- [x] ~~GENERAL: Swap REC logo for full RECTÁNGULO logo~~ (2026-11-09) - already satisfied: only one logo asset exists (public/images/logo.svg), used everywhere; no abbreviated REC mark to restrict
- [x] ~~ABOUT: Merge Services into About page~~ (2026-11-09) - ServicesCapabilities + ServicesCTA folded into About, pages/services.js removed, dead /services refs cleaned up; nav-menu removal needs wp-admin (see Waiting On)
