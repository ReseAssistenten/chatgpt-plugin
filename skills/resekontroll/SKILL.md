---
name: resekontroll
description: Run ReseAssistenten's trip-readiness review (Resekontroll) on a trip and turn the report plus entry requirements into a prioritised action list. Use when the user asks whether a trip is in order, what's missing, or what to do before departure.
---

# Resekontroll (trip readiness)

Review a trip on the user's own account via the `reseassistenten` connector and produce a concrete action list.

## Tools
- `list_trips` — resolve which trip (by name) to a uuid.
- `get_trip_resekontroll` — the report card + issues (areas, their status, dismissed issues).
- `get_entry_requirements` — passport / visa / entry status for the trip.
- `get_trip` / `get_trip_timeline` — extra detail when you need to explain an issue.

## Workflow
1. **Resolve the trip.** If the user named a trip, find its uuid with `list_trips`; if ambiguous or unspecified, ask.
2. **Get the report.** Call `get_trip_resekontroll`. For an observer-shared trip the planner block may be omitted — say so rather than inventing a report.
3. **Fold in entry rules.** Call `get_entry_requirements`. A `pending` row means a check is still warming in the background — note it, don't treat it as a failure.
4. **Prioritise.** Produce an action list, most urgent first: critical blockers (un-ticketed segments, entry/visa gaps, documents expiring before travel), then warnings, then nice-to-haves. For each item: what to do and why.
5. **Be concrete and private.** Keep it short and actionable. Never expose booking references / PNRs or other sensitive values.
