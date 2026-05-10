# Cross-Cutting Refactoring Plan

## Security — Immediate

- [ ] **Rotate compromised Neon database password** — `npg_FBXnxc3tmh7p` is exposed in `.env` tracked in git history. Rotate immediately via Neon console.
- [ ] **Purge `.env` from git history** — Use `git filter-repo` or `git-filter-branch` to remove `.env` from all commits.
- [ ] **Create `.env.example`** — Document all required env vars (`DATABASE_URL`, `VITE_NEON_AUTH_URL`, `VITE_NEON_DATA_API_URL`, `VITE_SYNC_API_BASE_URL`) with placeholder values.
- [ ] **Audit `.gitignore`** — Confirm it covers `.env`, `.env.*.local`, `*.log`, `dist/`, `target/`.

## Security — Code

- [ ] **Stop storing auth session in plaintext localStorage** — `packages/cz-explorer/src/lib/auth/onlineAuthSession.ts:14-17` — session data (`userId`, `displayName`, etc.) persists unencrypted and accessible to any JS on origin. Use sessionStorage (at minimum) or encrypted storage.
- [ ] **Stop using User ID as encryption key** — `packages/cz-explorer/src/lib/sync/remotePresetSyncAdapter.ts:66` — `sessionToken = session.userId` — User IDs are not secrets. Derive key from opaque session token instead.
- [ ] **Increase PBKDF2 iterations** — `packages/cz-explorer/src/lib/utils/crypto.ts:6` — 100k is below OWASP recommendation (600k+). Increase to 600k.
- [ ] **Fix `btoa` overflow** — `packages/cz-explorer/src/lib/utils/crypto.ts:102` — `btoa(String.fromCharCode(...combined))` hits JS engine argument limit (~125k) on large payloads. Use iterative chunking or a `Uint8Array`-to-base64 utility.

## CSS / Styling

- [ ] **Deduplicate CSS between app and library** — 250+ lines duplicated across `packages/cz-explorer/src/App.css` and `packages/cosmo-pd101/src/index.css` (`@plugin`, `@theme`, component classes). Have `App.css` import from `packages/cosmo-pd101/src/index.css` and layer only explorer-specific additions on top.
- [ ] **Fix `--color-gray-200` reference** — `App.css` uses `var(--color-gray-200, currentcolor)` which doesn't exist in Tailwind v4 theme — fallback `currentcolor` takes effect silently.
- [ ] **Convert hex to oklch** — `--color-accent: #3f8f98` breaks color system consistency. Convert to oklch.
- [ ] **Add `prefers-reduced-motion`** — Animation keyframes and transitions have no reduced-motion fallback.
- [ ] **Consolidate `.cz-section-slanted` / `.cz-section-gold`** — Both are identical (`@apply rounded-none text-center`). Remove one or merge.

## Build / Configuration

- [ ] **Pin `"tsdown": "latest"`** — In both `packages/cosmo-pd101/package.json:43` and `packages/cosmo-pd101-plugin/webview/package.json:35`. Pin to specific version.
- [ ] **Remove `postcss.config.js`** — `packages/cz-explorer/postcss.config.js` configures `@tailwindcss/postcss` but vite config already includes `@tailwindcss/vite` plugin. Redundant in Tailwind v4.
- [ ] **Remove `cross-env`** — Not needed with Bun (handles `KEY=VALUE` natively). Remove from root `devDependencies`.
- [ ] **Remove redundant `@biomejs/biome` per-package** — Root runs `bunx biome check .` for everything. Sub-package installs are redundant.
- [ ] **Remove `_host` dead variable** — Root `vite.config.ts` — `const _host = process.env.TAURI_DEV_HOST` is assigned but never referenced.
- [ ] **Move machine-specific hostname to env var** — `allowedHosts: ["macbook-pro.tailec1ed.ts.net"]` in vite configs — this is a personal Tailscale hostname.
- [ ] **Add `.editorconfig`** — No cross-editor formatting consistency (indent style, charset, end-of-line). Agrees with Biome's tab indentation.

## TypeScript

- [ ] **Create root `tsconfig.base.json`** — Shared options (`strict`, `skipLibCheck`, `isolatedModules`, `jsx: "react-jsx"`) currently duplicated across all package tsconfigs.
- [ ] **Align ES targets across packages** — `cz-explorer` targets `ES2022` while `cosmo-pd101` targets `ES2020`. Pick one.
- [ ] **Fix `ignoreDeprecations: "6.0"`** — Present in `cosmo-pd101/tsconfig.json` and plugin `webview/tsconfig.json`. This suppresses deprecation warnings instead of addressing them.
- [ ] **Scope `@testing-library/jest-dom` types** — `cz-explorer/tsconfig.json` has `"types": ["@testing-library/jest-dom"]` globally — extends `expect()` matchers in production code. Scope to test files only.

## Architecture / Code Quality

- [ ] **Extract `isBrowser()` utility** — `typeof window === "undefined"` repeated 7× across:
  - `packages/cz-explorer/src/lib/sync/onlineSyncSettings.ts:12,27`
  - `packages/cz-explorer/src/lib/auth/onlineAuthSession.ts:10,39,52,73`
  - `packages/cz-explorer/src/lib/presets/presetManager.ts:95`
- [ ] **Consolidate Noop/Disabled remote adapter** — `packages/cz-explorer/src/lib/sync/presetSync.ts:9-17` and `packages/cz-explorer/src/lib/sync/remotePresetSyncAdapter.ts:42-50` — identical implementations. Keep one.
- [ ] **Fix error swallowing** — 5+ locations catch all errors and return `null`/`false` with no logging:
  - `storage.ts:10-11` — JSON parse failure
  - `presetSync.ts:39-41,50-52` — backup/restore errors
  - `neonAuthClient.ts:130-132` — session retrieval errors
  - `remotePresetSyncAdapter.ts:80-82` — pull errors
- [ ] **Add retry/backoff to network operations** — Neon push/pull and auth sign-in fail immediately with no retry.
- [ ] **Use connection pooling for Neon client** — `remotePresetSyncAdapter.ts:61,86` — creates a fresh `getNeonDataClient()` on every push/pull.
- [ ] **Extract magic error code** — `remotePresetSyncAdapter.ts:98` — `"PGRST116"` is PostgREST-specific. Abstract database adapter layer.
- [ ] **Document `VITE_*` environment variables** — `COSMO_BINDINGS_RELEASE=1`, `COSMO_DEV_RELEASE=1` are magic vars with no documentation.

## Extract vite shared config

- [ ] **Create `packages/cz-explorer/vite-base.ts`** — Root `vite.config.ts` and `packages/cz-explorer/vite.config.ts` share ~80% boilerplate (Tauri server, WASM plugin, aliases). Extract shared preset.
- [ ] **Extract WASM dev plugin to standalone module** — Inline `wasmDevPlugin` definition duplicated in both configs.

## Tests

- [ ] **Expand `workspaceBackup.test.ts`** — Currently 27 lines testing only the type guard. `exportWorkspaceBackup()` and `importWorkspaceBackup()` have zero functional tests.
- [ ] **Expand `onlineSyncSettings.test.ts`** — 2 tests for 3 exports. Missing: SSR guard path, corrupted data, edge cases.
- [ ] **Expand `presetSync.test.ts`** — Missing: default constructor, runtime adapter switching, adapter that throws.
- [ ] **Remove `canvas` mock if jsdom supports it** — Check if modern jsdom can handle minimal canvas operations.
