---
name: award-trip-planning
description: Plan a SAS award trip end to end — search availability (Europe or Longhaul), verify freshness before presenting anything as bookable, and summarise the best options with booking links. Use when the user wants to find, compare or book award flights with points.
---

# Award trip planning

Plan an award trip on the user's own ReseAssistenten account via the `reseassistenten` MCP connector.

## Tools
- `search_europe_awards` — short-haul / European award calendar (cached, read-only).
- `search_longhaul_awards` — intercontinental award calendar / day departures / round-trip & open-jaw journeys. Supports `verify=true` (live-verify) and, for `trip=rt`/`oj`, `require_bookable=true`.
- `search_airports` — resolve city/airport names to IATA codes.

## Workflow
1. **Scope the trip.** Get origin + destination (resolve names via `search_airports`), when (months `YYYY-MM` or a date range), cabin (default ECONOMY), party size, and whether it is one-way, round trip (`trip=rt`) or open jaw (`trip=oj`). Round trip / open jaw require Premium.
2. **Read the cache first.** Call the right tool (longhaul for intercontinental, europe for short-haul) with no verify. For `rt`/`oj`, you get priced outbound+return pairings (`journeys`) with summed `total_points` and a combined booking link.
3. **Respect freshness (critical).** A journey or cell marked `stale` carries `needs_verification: true` + `action: "verify"`. It may have been booked away since its last check — **never present it as bookable while stale**. Before offering it:
   - one-way: call again with `verify=true` (verifies that day / month);
   - round trip / open jaw: call with `require_bookable: true` — this runs the same availability check the website's **Book** button does on the top journeys and marks each `bookable: true|false` (`false` + `no_longer_available` when the award is gone). Pass `drop_unbookable: true` to drop vanished ones.
4. **Mind the quota.** Live verification spends the per-user live-search quota (free tier) and is rate-limited; the response carries `quota` (remaining / resets_at) and may carry `throttled` + `retry_after_ms` under a burst — back off and retry rather than hammering.
5. **Summarise.** Present the best few genuinely-bookable options: points, taxes, cabin, dates, stops, stay length, and the booking link(s). Offer to set up a watch (see the `award-watch` skill) if nothing suitable is available yet.

Never invent availability, and never hand out a booking link for a stale, unverified result.
