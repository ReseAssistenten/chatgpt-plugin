# ReseAssistenten — ChatGPT / Codex plugin

> **Svenska:** Det här pluginet kopplar ChatGPT eller Codex till ditt eget
> ReseAssistenten-konto så att assistenten kan planera SAS award-resor, köra
> Resekontroll, coacha din EuroBonus-status och utforska prisbelönta destinationer —
> med exakt de rättigheter du har på webben. Kräver ett ReseAssistenten-konto.
> Utgivare: Mindtravel.

Connect ChatGPT or Codex to your own **ReseAssistenten** account — acting with exactly the
permissions you have on the web.

## What it does & what data it sends

The plugin declares ReseAssistenten's hosted, **per-user-authenticated MCP server** at
`https://reseassistenten.se/mcp` as a remote server (`.mcp.json` / `mcp.json`), plus guided
skills.

- On first use your browser opens for **OAuth login + consent** on ReseAssistenten
  (dynamic client registration — **no tokens or secrets are stored in this plugin**).
- Once connected, the assistant reads (and, with the write permissions you grant, edits)
  **your own** trips, bookings, travel documents, award availability, EuroBonus status and
  destination catalogue — scoped to exactly what your ReseAssistenten web account can see.
- Data flows only between your agent client and `https://reseassistenten.se`.
- Read is available on the free tier; purchases are never available through the connector.

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
| `skills/` | Guided workflows (award-trip-planning, resekontroll, eurobonus-coach, award-watch, explore-destinations). |

> Skills/slash-commands are a Claude concept; in ChatGPT/Codex the workflow lives in the
> tool design + descriptions. The skills are included for Codex clients that read them.

## Publisher

**Mindtravel** · reseassistenten@mindtravel.se · https://mindtravel.se

## License

[MIT](./LICENSE).
