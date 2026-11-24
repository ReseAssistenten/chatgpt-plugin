---
name: add-booking
description: Add the user's bookings (flights, hotels, trains, activities, transport) and trips to ReseAssistenten the same proven way every time, without duplicates and linked to the right trip. Use when the user says "add my trip", "lägg in min resa/bokning", forwards a booking confirmation, or wants a flight or hotel saved on their account.
---

# Add booking (lägg in bokning)

Save bookings and trips on the user's own account via the `reseassistenten` connector. Writes need the `write` permission on the connection; `move_booking` also needs `delete` and `confirm: true`. A `scope_required` error names the missing permission: tell the user to reconnect and tick it.

## Tools
- `list_trips` / `get_trip`: find the trip the booking belongs to.
- `create_trip`: create the trip when none exists yet.
- `list_bookings`: check what is already saved, so you never add a second copy.
- `create_pnr_booking`: flights with SAS or a SkyTeam partner, from booking reference + surname.
- `create_booking`: everything else, and the fallback when the PNR lookup fails.
- `update_booking`: change a booking that is already saved.
- `set_segment_status`: switch a planned manual flight segment to `confirmed` once it is booked.
- `move_booking`: link a saved booking to a trip afterwards.
- `create_attachment_upload_link`: let the user attach the e-ticket or confirmation file in the browser.

## Workflow
1. **Find or create the trip.** Call `list_trips` (and `get_trip` if you need the details) and match on destination and dates. If no trip fits, ask whether to create one, then call `create_trip`. Keep the trip's `uuid` for the next steps.
2. **Check for duplicates.** Call `list_bookings` before writing anything. A booking forwarded by e-mail may already be saved: if the same flight, hotel or reference is there, change it with `update_booking` instead of creating a new one.
3. **Flights with SAS or a SkyTeam partner** (for example KLM, Air France, Delta, Virgin Atlantic, Korean Air) with a booking reference and surname: call `create_pnr_booking` with `pnr`, `last_name` and `trip_uuid`. This fetches the itinerary and arms the change watch.
   - **If it fails** (422 on `pnr`: the reference cannot be fetched, which happens for some partner bookings), do not retry variations of the code. Add the booking manually with `create_booking` (`booking_type` flight) and pass the same reference as `external_reference`. The error's `next` field points to this.
4. **Everything else** (other airlines, hotels and stays, trains, buses, ferries, car rental, activities): call `create_booking` with the right `booking_type` and `trip_uuid`. Always pass the booking or confirmation number as `external_reference` when the user has one, so a forwarded e-mail can match the booking instead of creating a copy.
5. **Not booked or paid yet:** create it with `create_booking` and set each flight segment's `status` (in `segments`) to `planned`. When the user books it later, call `set_segment_status` with `confirmed`.
6. **Handle duplicate answers.** `already_in_trip` / `already_standalone` are final: do not retry. `exists_elsewhere` means it is saved on another trip: ask the user, and only call again with `confirm_duplicate: true` if they want a second copy. A `possible_duplicate` in a success response means a similar booking exists: tell the user and offer to remove one.
7. **Link and confirm.** If the booking was created without a trip, link it with `move_booking`. Follow the `hints` in the response. Summarise for the user what was saved and on which trip, and mention that forwarding the booking confirmation e-mail to ReseAssistenten later updates this same booking rather than adding a new one.
8. **Attachments (optional).** If the user wants to attach the e-ticket or confirmation, call `create_attachment_upload_link` (`target` booking, `target_id` = the booking id) and give them the link. In Claude this is always the route, since files cannot be passed to tools here. Never ask for the file inline.

Be private: never repeat a booking reference, PNR or surname back in your summary unless the user asks, and never show or link to existing attachments.
