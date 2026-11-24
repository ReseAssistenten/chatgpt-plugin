# Changelog

All notable changes to the ReseAssistenten ChatGPT/Codex plugin are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-11-24

### Changed
- Catalog copy now describes SAS award trips, EuroBonus, Resekontroll and trip planning;
  third-party list names and venue-type marketing removed from the description,
  starter prompts and skills.
- Skill `explore-destinations` renamed to `destination-guide` with a neutral description.
  The tools it uses (`explore`, `search_destinations`, `get_destination_guide`) are unchanged.
- Shared catalog copy: one short and long description and five example questions, the same
  text as the web connector manifest, the MCP Registry entry and llms.txt. States that MCP
  access is included in Premium. Starter prompts use the shared example questions.

## [0.1.0] — 2026-11-09

### Added
- Initial release.
- Connector to the hosted, per-user-authenticated ReseAssistenten MCP server
  (`https://reseassistenten.se/mcp`, OAuth 2.1, no bundled secrets).
- Codex-native manifests (`.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`)
  and the cross-vendor agent-plugins.org manifest (`plugin.json`) with the OpenAI
  `interface` metadata (display name, privacy / terms URLs, icon).
- Five guided skills: `award-trip-planning`, `resekontroll`, `eurobonus-coach`,
  `award-watch`, `explore-destinations`.
