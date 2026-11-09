---
name: explore-destinations
description: Explore award-winning experiences (restaurants, hotels, beaches, bars, vineyards, wonders) thematically across destinations, or get the full guide for one city. Use when the user wants destination ideas, "best X in Y", or what to see/eat/stay near a place.
---

# Explore destinations & experiences

Browse the non-personal award catalogue via the `reseassistenten` connector.

## Tools
- `explore` — thematic browse ACROSS destinations. `theme` = wonders | beaches | restaurants | bars | vineyards | hotels; filters: `country` (ISO-2), `region` (continent), `award_list`, `min_rank` (top-N), `near` (city code) or `near_lat`+`near_lng`, `radius_km`, `sort` (rank|distance|name), `limit`.
- `search_destinations` → `get_destination_guide` — resolve a city, then its practical facts (timezone, languages, currency, power plug) + nearby awarded experiences.

## Workflow
1. **Theme query** (e.g. "best beaches in Greece", "top 10 bars worldwide"): call `explore` with the theme + filters (`country`/`region`, `award_list`, `min_rank`, `sort`). Returns awarded experiences with their list + rank/year.
2. **City query** (e.g. "what to do in Tokyo"): resolve with `search_destinations`, then `get_destination_guide`.
3. **Both** (e.g. "best restaurants in Tokyo"): use `explore` with the theme + `near` the city (or `country`), whichever fits.
4. **Summarise** the top picks with award (list + rank/year), location and why they stand out. Offer to save any to a trip.

Catalog data is non-personal and read-only — no account data is exposed here.
