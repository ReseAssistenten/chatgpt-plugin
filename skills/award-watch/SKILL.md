---
name: award-watch
description: Create or adjust SAS award-availability watches (bevakningar) for a route so the user is notified when seats open. Use when the user wants to be alerted about future award space rather than searching right now.
---

# Award watch (bevakning)

Set up and manage award watches on the user's own account via the `reseassistenten` connector.

## Tools
- `list_award_watches` / `get_award_watch` / `get_award_watch_matches` — see existing watches and their hits.
- `create_award_watch` / `update_award_watch` / `set_award_watch_active` — create, edit, pause/resume (require the `write` scope).
- `delete_award_watch` — remove a watch (destructive; needs `confirm: true`).

## Workflow
1. **Avoid duplicates.** Call `list_award_watches` first so you don't recreate an existing watch.
2. **Confirm details.** Route (origin → destination), cabin (default ECONOMY), trip type, dates vs open-ended, passengers. Echo them back before creating.
3. **Create.** Call `create_award_watch`. The product gates are enforced server-side: a `premium_required`, `skyteam` (provider) or longhaul credit-cap error is real — explain the limit plainly and what it would take to proceed; never pretend it succeeded.
4. **Confirm.** State what is now watched and how the user will be notified. Offer `get_award_watch_matches` to show current hits.
