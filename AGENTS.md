# Agent Instructions

## Tooling & Environment

- **Package Manager**: Always use `bun`. Do not use `npm` or `yarn`.

## Commands

| Task | Command |
|------|---------|
| Dev server | `bun run dev` |
| Build | `bun run build` (runs `tsc && vite build`) |
| Lint | `bun run lint` |
| Lint & fix | `bun run lint:fix` |
| Unit tests | `bun run test` |

**Order**: lint → typecheck (via `bun run build`) → test.

## Architecture

Bun monorepo. Main packages:

- `packages/cosmo-synth-engine` — Rust/WASM phase distortion engine
- `packages/cosmo-pd101` — reusable synth UI/library package; exports synth-specific components, hooks, preset utilities, and SysEx utilities consumed by the plugin webview
- `packages/cosmo-pd101-plugin` — VST3/CLAP/AUv2 plugin; contains a thin `webview/` app shell that embeds the shared `cosmo-pd101` library
- `packages/cosmo-pd101-plugin-auv3` — AUv3 plugin host xcode project
- `packages/xtask` — Build automation. Only used for auv3


### `packages/cosmo-pd101/src/`

- `components/` — Synth-specific UI components (controls, editor, renderer, panels)
- `features/synth/` — Synth feature domain: hooks (`useAudioEngine`, `useSynthState`, etc.) and preset management
- `lib/midi/` — CZ SysEx decoder (`czSysexDecoder`)
- `lib/synth/` — Synth bindings, preset converter, PD algorithms, worklet URLs
- `index.ts` — Public library entry point; exports components, hooks, and types for use by the plugin webview

### `packages/cosmo-pd101-plugin/`

- `src/` — Rust truce (truce.audio) plugin wrapper and native IPC bridge
- `webview/src/` — Thin plugin app shell, truce bridge, plugin-only harness/tests, update checks

## Conventions

- **TypeScript**: strict mode, `noUnusedLocals`, `noUnusedParameters` — no unused imports or variables
- **Components**: functional only, `PascalCase.tsx`; wrap expensive ones with `memo()`
- **Hooks**: `useCamelCase.ts`; utilities/lib: `camelCase.ts`
- **Context pattern**: `createContext` → typed interface → Provider → `useXxx` hook with guard. See `src/context/` for templates.
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS + DaisyUI; prefer DaisyUI semantic classes (`btn`, `badge-primary`, etc.) over raw Tailwind utilities. No inline `style=` attributes.
- **Formatting**: Biome — tabs, double quotes, organized imports (`bun run lint:fix`)
- **MIDI/SysEx**: Always use `Uint8Array` for raw MIDI data, never `number[]`. SysEx starts `0xF0`, ends `0xF7`.
- **Temporary code**: If a change is temporary, add an explicit `TODO:` comment at the relevant code location so follow-up work is trackable.

## Git & Pull Requests

- **Commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/) format: `type(scope): description`
- **PR titles**: Must follow conventional commits format (enforced)
- **Commit types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Breaking changes**: Use `!` before the colon for breaking changes: `feat!: remove old API` or add `BREAKING CHANGE:` in footer

## Testing

- Two Vitest projects: `unit` (happy-dom) and `browser` (Playwright/Chromium)
- Browser test files must use `*.browser.test.{ts,tsx}` naming
- Unit test files use `*.{test,spec}.{ts,tsx}` (excluding `.browser.test.`)
- Setup injects `fake-indexeddb/auto` and `vitest-axe/extend-expect` for unit tests
- CI runs `test:unit --run` then installs Playwright + runs `test:browser --run`

## React Best Practices

### Folder Structure
- **Feature-based**: Organize by feature (`features/presets/`, `features/setlists/`) not by file type
- Keep pages thin — delegate to feature components
- Create `lib/` for truly reusable code across features
- Use barrel exports (`index.ts`) for clean imports

### Component Architecture
- **Single responsibility**: Each component does one thing well
- **Composition over inheritance**: Use `children` prop and render props for flexibility
- Split components at ~200+ lines or when reusable
- Wrap expensive components with `React.memo()`
- Colocate related files (component + styles + tests + types)

### State Management
- **Local state first**: Use `useState` / `useReducer` for component-local state
- **Context**: App-wide state only (theme, auth, MIDI config) — avoid Context for frequently updated data
- **TanStack Query**: For server state (API data, presets from DB) — handles caching, background updates, deduping
- **Zustand**: Optional for complex client state without boilerplate

### Performance
- **Code splitting**: `React.lazy()` + `Suspense` for routes and heavy features
- **Lazy load third-party libs**: Split large dependencies
- **useMemo/useCallback**: Only for expensive calculations or stabilizing callback refs — avoid blanket memoization
- **Virtualization**: For long lists (use `@tanstack/react-virtual`)
- Measure with React DevTools Profiler before optimizing

### TypeScript
- Explicit types for component props and function returns
- Domain types in `src/types/` or alongside feature code
- Avoid `any` — use `unknown` when type is truly unknown
- Use `interface` for object shapes, `type` for unions/intersections

### Hooks Patterns
- Custom hooks for reusable logic (`useXxx.ts`)
- Always include cleanup functions in `useEffect`
- List all dependencies in dependency array — lint rule enforces this
- Use `useCallback` when passing callbacks to memoized components

### Testing
- **Colocate**: Tests next to code they test (`Component.test.tsx`)
- **Test pyramid**: 70% unit (components, hooks), 20% integration (feature tests), 10% E2E
- Test behavior, not implementation — prefer React Testing Library
- Mock external dependencies (IndexedDB, MIDI)

### Code Style
- Functional components only
- Name files: `PascalCase.tsx` for components, `camelCase.ts` for hooks/utils
- Path alias `@/*` for absolute imports
- No inline styles — use Tailwind/DaisyUI classes

<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "TanStack Router core concepts, type inference, and Register declaration"
    load: "node_modules/@tanstack/router-core/skills/router-core/SKILL.md"
  - task: "TanStack Router type safety, full type inference, link props, route API"
    load: "node_modules/@tanstack/router-core/skills/router-core/type-safety/SKILL.md"
  - task: "TanStack Router navigation, Link, useNavigate, preloading"
    load: "node_modules/@tanstack/router-core/skills/router-core/navigation/SKILL.md"
  - task: "TanStack Router dynamic path segments, URL parameters"
    load: "node_modules/@tanstack/router-core/skills/router-core/path-params/SKILL.md"
  - task: "Environment variables, .env files, process.env setup"
    load: "node_modules/dotenv/skills/dotenv/SKILL.md"
<!-- intent-skills:end -->