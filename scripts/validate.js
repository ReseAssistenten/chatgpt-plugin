#!/usr/bin/env node
'use strict';

/**
 * Lightweight sanity check for the ReseAssistenten Agent Plugin before packing.
 *
 * This is NOT a full JSON-Schema validation — the authoritative schemas live at
 * https://agent-plugins.org/schemas/1.0.0/ and can be run through any JSON-Schema
 * validator. This script only guards the few invariants that are easy to get
 * wrong by hand and that would ship a broken bundle: the two $schema URLs, the
 * kebab-case plugin name, a remote streamable-http MCP server, and — critically
 * — that NO client secret / token is baked into mcp.json.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

function readJson(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8'));
  } catch (err) {
    errors.push(`${name}: not valid JSON (${err.message})`);
    return null;
  }
}

const plugin = readJson('plugin.json');
const mcp = readJson('mcp.json');

if (plugin) {
  if (plugin.$schema !== 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json') {
    errors.push('plugin.json: $schema must be the Agent Plugins 1.0.0 plugin schema URL.');
  }
  if (typeof plugin.name !== 'string' || !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(plugin.name) || plugin.name.includes('--') || plugin.name.includes('..')) {
    errors.push('plugin.json: name must be kebab-case (lowercase alphanumeric with hyphens/periods, no leading/trailing symbol, no "--" or "..").');
  }
  // E171S02 — submission prerequisites: an https icon, a support contact, and the
  // live Privacy + Terms policy URLs (the platform catalogs require all of them).
  if (typeof plugin.icon !== 'string' || !/^https:\/\/.+\.(png|svg)$/i.test(plugin.icon)) {
    errors.push('plugin.json: icon must be an https URL to a .png or .svg connector icon.');
  }
  if (typeof plugin.contactEmail !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(plugin.contactEmail)) {
    errors.push('plugin.json: contactEmail must be a valid support email address.');
  }
  const iface = (plugin.extensions && plugin.extensions['com.openai'] && plugin.extensions['com.openai'].interface) || {};
  for (const [field, label] of [['privacyPolicyURL', 'privacy policy'], ['termsOfServiceURL', 'terms of service']]) {
    if (typeof iface[field] !== 'string' || !/^https:\/\//.test(iface[field])) {
      errors.push(`plugin.json: extensions.com.openai.interface.${field} must be an https ${label} URL.`);
    }
  }
}

if (mcp) {
  if (mcp.$schema !== 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json') {
    errors.push('mcp.json: $schema must be the Agent Plugins 1.0.0 mcp schema URL.');
  }
  const servers = mcp.mcpServers || {};
  const names = Object.keys(servers);
  if (names.length === 0) {
    errors.push('mcp.json: mcpServers must declare at least one server.');
  }
  for (const name of names) {
    const s = servers[name];
    if (s.type !== 'streamable-http') {
      errors.push(`mcp.json: server "${name}" must be type "streamable-http" (this is a remote MCP server).`);
    }
    if (typeof s.url !== 'string' || !/^https:\/\//.test(s.url)) {
      errors.push(`mcp.json: server "${name}" must have an https url.`);
    }
    // No secret may ever be baked in — OAuth is discovered from the server (DCR).
    const blob = JSON.stringify(s).toLowerCase();
    for (const forbidden of ['clientsecret', 'client_secret', 'authorization', 'bearer', 'token', 'apikey', 'api_key']) {
      if (blob.includes(forbidden)) {
        errors.push(`mcp.json: server "${name}" must not contain a secret ("${forbidden}") — OAuth is discovered from the server.`);
      }
    }
  }
}

// Schema versions must match when both files are present.
if (plugin && mcp && typeof plugin.$schema === 'string' && typeof mcp.$schema === 'string') {
  const pv = (plugin.$schema.match(/schemas\/([0-9.]+)\//) || [])[1];
  const mv = (mcp.$schema.match(/schemas\/([0-9.]+)\//) || [])[1];
  if (pv && mv && pv !== mv) {
    errors.push(`plugin.json (${pv}) and mcp.json (${mv}) must target the same Agent Plugins schema version.`);
  }
}

if (errors.length > 0) {
  console.error('Agent Plugin validation FAILED:');
  for (const e of errors) {
    console.error('  - ' + e);
  }
  process.exit(1);
}

console.log('Agent Plugin validation OK (plugin.json + mcp.json).');
