---
name: destination-guide
description: Get the travel guide for a destination (practical facts and things to see nearby) or browse highlights across destinations by theme. Use when the user wants destination ideas for a trip or what to see and do near a place.
---

# Destination guide

Browse the non-personal destination catalogue via the `reseassistenten` connector.

## Tools
- `explore`: thematic browse ACROSS destinations. Pick a `theme` from the tool's schema; filters: `country` (ISO-2), `region` (continent), `award_list`, `min_rank` (top-N), `near` (city code) or `near_lat`+`near_lng`, `radius_km`, `sort` (rank|distance|name), `limit`.
- `search_destinations` → `get_destination_guide`: resolve a city, then its practical facts (timezone, languages, currency, power plug) + nearby highlights.

## Workflow
1. **Theme query** (e.g. "ideas for a trip to Greece"): call `explore` with a fitting theme + filters (`country`/`region`, `min_rank`, `sort`).
2. **City query** (e.g. "what to do in Tokyo"): resolve with `search_destinations`, then `get_destination_guide`.
3. **Both** (a theme near a city): use `explore` with the theme + `near` the city (or `country`), whichever fits.
4. **Summarise** the top picks with their location and why they stand out. Offer to save any to a trip.

Catalog data is non-personal and read-only; no account data is exposed here.
