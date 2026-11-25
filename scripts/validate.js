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
  // The Agent Plugins 1.0.0 plugin schema has additionalProperties: false at the top
  // level. Any other key (e.g. `icon`, `contactEmail`) makes the whole manifest invalid,
  // so ChatGPT rejects the plugin. Client data belongs under `extensions`.
  const allowedTop = ['$schema', 'name', 'version', 'description', 'author', 'homepage', 'license', 'keywords', 'extensions'];
  for (const key of Object.keys(plugin)) {
    if (!allowedTop.includes(key)) {
      errors.push(`plugin.json: top-level "${key}" is not allowed by the Agent Plugins 1.0.0 schema (additionalProperties: false).`);
    }
  }
  if (plugin.author !== undefined) {
    const extra = Object.keys(plugin.author || {}).filter((k) => !['name', 'email', 'url'].includes(k));
    if (extra.length) {
      errors.push(`plugin.json: author may only contain name, email, url (found ${extra.join(', ')}).`);
    }
  }
  const iface = (plugin.extensions && plugin.extensions['com.openai'] && plugin.extensions['com.openai'].interface) || {};
  if (iface.defaultPrompt !== undefined && typeof iface.defaultPrompt !== 'string') {
    errors.push('plugin.json: extensions.com.openai.interface.defaultPrompt must be a single string.');
  }
  // Relative asset paths must ship in the bundle (see the pack scripts in package.json).
  for (const field of ['logo', 'composerIcon']) {
    if (typeof iface[field] === 'string' && iface[field].startsWith('./') && !fs.existsSync(path.join(ROOT, iface[field]))) {
      errors.push(`plugin.json: extensions.com.openai.interface.${field} points to ${iface[field]}, which does not exist.`);
    }
  }
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
    // No credential may ever be baked in. DCR registers dynamically, so a client
    // id/secret must never ship; nor may a bearer token / API key value. OAuth
    // endpoint URLs (authorizationUrl, tokenUrl, registrationUrl) are declarative
    // metadata — NOT secrets — so we check credential KEYS and secret-looking
    // VALUES, never substrings of those legitimate field names.
    const auth = (s.extensions && s.extensions['com.openai'] && s.extensions['com.openai'].auth) || {};
    const client = auth.client || {};
    for (const credKey of ['clientId', 'client_id', 'clientSecret', 'client_secret', 'apiKey', 'api_key']) {
      if (Object.prototype.hasOwnProperty.call(client, credKey) || Object.prototype.hasOwnProperty.call(auth, credKey)) {
        errors.push(`mcp.json: server "${name}" auth must not bake in a credential ("${credKey}") — DCR registers dynamically.`);
      }
    }
    const blob = JSON.stringify(s).toLowerCase();
    for (const forbidden of ['bearer ', 'clientsecret', 'client_secret', 'apikey', 'api_key']) {
      if (blob.includes(forbidden)) {
        errors.push(`mcp.json: server "${name}" must not contain a secret value ("${forbidden.trim()}").`);
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
