# Changelog

All notable changes to the ReseAssistenten ChatGPT/Codex plugin are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

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
