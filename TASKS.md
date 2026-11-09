# Tasks

## Active

## Waiting On

- [ ] **WP-admin nav cleanup** - since 2026-11-09 - remove "Services" and "Contact" from the WP primary/footer menus now that their pages are merged away; Header/Footer pull menu items live from WordPress, not hardcoded in this repo, so this needs a wp-admin edit, not a code change
- [ ] **Follow-up: grain on sticky sections** - since 2026-11-09 - WorkFilmstrip, ServicesCapabilities, AboutInstalaciones and HomeFeaturedWork still have no cinematic grain texture; each has its own position:sticky internals, so the texture needs to go directly on the sticky element itself (same pattern HomeHero used to use), not on an ancestor wrapper

## Someday

## Done

- [x] ~~HOME: Build preloader~~ (2026-11-09) - red bg, centered white logo, fade-out
- [x] ~~HOME: Rework initial layout + scroll behavior~~ (2026-11-09) - centered wordmark, social left / nav right
- [x] ~~HOME: Featured Work carousel~~ (2026-11-09) - already built (HomeFeaturedWork + WorkItemMedia, hover-autoplay cursor-follow preview); no change needed
  - client flagged this item as possibly chargeable extra - since it turned out to already exist, flag to client that no new dev cost applies here
- [x] ~~GENERAL: Add cinematic grain texture~~ (2026-11-09) - removed from hero video, added to Footer/AboutHero/AboutGallery/HomeCTA/ServicesCTA; sticky-bearing sections left as a follow-up (see Waiting On)
- [x] ~~GENERAL: Adjust color scheme~~ (2026-11-09) - confirmed with user: red stays an accent (preloader, footer CTA, hero curtain, services tint), dark theme stays the base
- [x] ~~GENERAL: Custom typography treatment~~ (2026-11-09) - HomeCTA's "Let's Collaborate"/"Colaboremos" heading switched to the display font, one "E" stretched to echo the logo's elongated stroke
- [x] ~~GENERAL: Swap REC logo for full RECTÁNGULO logo~~ (2026-11-09) - already satisfied: only one logo asset exists, used everywhere
- [x] ~~ABOUT: Merge Services into About page~~ (2026-11-09) - ServicesCapabilities + ServicesCTA folded into About, pages/services.js removed
- [x] ~~ABOUT: Add large-format opening image~~ (2026-11-09) - full-bleed opener image above the hero text, replacing the small map graphic
- [x] ~~FOOTER: Merge Contact into Footer~~ (2026-11-09) - "Let's Work Together" band now opens Footer on every page, pages/contact.js + ContactHero removed
- [x] ~~WORK: Update project layout~~ (2026-11-09) - WorkFilmstrip now alternates single tiles with vertically-stacked video pairs
