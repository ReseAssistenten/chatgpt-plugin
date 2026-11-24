# ReseAssistenten: ChatGPT / Codex plugin

> **Svenska:** Reseplanering, SAS-bonusresor och EuroBonus för din AI-agent via MCP. Kräver
> ett ReseAssistenten-konto med Premium. Utgivare: Mindtravel.

Trip planning, SAS award flights and EuroBonus for your AI agent via MCP.

ReseAssistenten connects your AI agent via MCP to your own ReseAssistenten account for trip planning, SAS award flights and EuroBonus. The agent can manage your trips, bookings and travel documents, search SAS award flights in Europe and on Longhaul routes, watch a route for award seats, check that a trip is in order with Resekontroll and follow your EuroBonus status, with exactly the permissions you have on the web. Access uses OAuth with login and consent on ReseAssistenten, and no secret is stored in the agent. MCP access is included in Premium, at no extra cost. Free accounts have no MCP access.

## Example questions

- "Are there any SAS award seats in Business from Stockholm to Tokyo in March?"
- "Watch Copenhagen to New York in Plus for the first two weeks of June and tell me when seats open."
- "Is my trip to Lisbon in order? What do I still need to do before I leave?"
- "How many level points do I need for EuroBonus Gold, and how can I close the gap this year?"
- "Add my new booking to the trip to Bangkok."

## What it does & what data it sends

The plugin declares ReseAssistenten's hosted, **per-user-authenticated MCP server** at
`https://reseassistenten.se/mcp` as a remote server (`.mcp.json` / `mcp.json`), plus guided
skills.

- On first use your browser opens for **OAuth login + consent** on ReseAssistenten
  (dynamic client registration; **no tokens or secrets are stored in this plugin**).
- Once connected, the assistant reads (and, with the write permissions you grant, edits)
  **your own** trips, bookings, travel documents, award availability, EuroBonus status and
  destination catalogue, scoped to exactly what your ReseAssistenten web account can see.
- Data flows only between your agent client and `https://reseassistenten.se`.
- MCP access is included in Premium; purchases are never available through the connector.

Privacy policy: https://reseassistenten.se/privacy · Terms: https://reseassistenten.se/terms

## Requirements

- A **ReseAssistenten account** (https://reseassistenten.se).

## Install

**Codex CLI** (confirm the exact install verb against the current Codex plugin docs):

```bash
codex plugin marketplace add ReseAssistenten/chatgpt-plugin
codex plugin install reseassistenten@mindtravel
```

**ChatGPT:** this MCP server is submitted as a ChatGPT **app** via OpenAI's portal; once
approved it appears in ChatGPT's app catalogue (Apps & Connectors) and you enable it there.
Before then it can be added privately in **Developer Mode** (Settings → Apps & Connectors →
Advanced) using the server URL `https://reseassistenten.se/mcp`.

**Claude users:** use the companion Claude plugin in
[`ReseAssistenten/plugin`](https://github.com/ReseAssistenten/plugin).

## Manifests in this repo

| File | Purpose |
|---|---|
| `.codex-plugin/plugin.json` | Codex-native plugin manifest (references `./.mcp.json`). |
| `.agents/plugins/marketplace.json` | Codex-native marketplace entry (`policy.installation: AVAILABLE`). |
| `plugin.json` | Cross-vendor agent-plugins.org manifest with the OpenAI `interface` metadata. |
| `.mcp.json` / `mcp.json` | The remote MCP server (`https://reseassistenten.se/mcp`). |
| `skills/` | Guided workflows (award-trip-planning, resekontroll, eurobonus-coach, award-watch, destination-guide). |

> Skills/slash-commands are a Claude concept; in ChatGPT/Codex the workflow lives in the
> tool design + descriptions. The skills are included for Codex clients that read them.

## Publisher

**Mindtravel** · reseassistenten@mindtravel.se · https://mindtravel.se

## License

[MIT](./LICENSE).
