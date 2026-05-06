Vite React Starter is a lightweight yet batteries-included front-end Everest. It combines Vite's lightning-fast build tooling with React 18, TailwindCSS, ESLint, Prettier, and Husky git hooks, giving you a clean, scalable foundation to ship features quickly and confidently. Clone → npm i → npm run dev — and you're coding.

## Demo build (this branch only)

This branch (`demo`) ships a fully self-contained, mock-backed build for sales demos. **No backend is required.** All `/v1/...` HTTP calls are intercepted in [src/services/NetworkUtils.jsx](src/services/NetworkUtils.jsx) and routed through the in-FE dispatcher under [src/mocks/](src/mocks/). The mocked dataset (5 companies, 50 workforce, 30 enquiries with CLIK-shaped results) lives in [src/mocks/fixtures/](src/mocks/fixtures/).

### Local

```sh
npm install
npm run dev
```

Sign in:

- **Email:** `superadmin@everest.io`
- **Password:** `Everest@2026!`

Any other credential combination returns a normal "invalid email or password" error.

### Vercel deployment

Project settings:

| Setting | Value |
|---|---|
| Root Directory | `backoffice` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Environment Variables | none required (the demo runs without any) |

**Required:** enable **Git → Include source files outside of the Root Directory** (so Vercel can clone the `interstellar-component` git submodule). The submodule must remain on its `everest` branch — do not change the pointer in this branch.

Routing fallback (for client-side `react-router-dom` paths) and the `/api-wilayah/*` passthrough are handled by [vercel.json](vercel.json). No additional rewrites needed.

### What is and isn't interactive

- **Read paths** (lists, details, dashboards) all serve realistic fixtures.
- **Write paths** (create / edit / delete forms) submit cleanly: button shows a brief loading state, the form closes silently, and no toast or error is fired. The fixture dataset does not mutate, so on reload the demo state is identical — predictable for replays.
- **Settings** screens display data but do not persist edits.
- **DocuSign enrollment** step 4 is stubbed (no real envelope is created).
- **Exports / downloads** resolve to `about:blank`. Imports return a synthetic success.

### Reverting to a real backend

The demo is wired through a single chokepoint. To hit a real API again:

1. Restore the previous `src/services/NetworkUtils.jsx` from git history.
2. Reset `VITE_API_BASE_URL` in `.env`.
3. Optionally delete `src/mocks/`.

Branches other than `demo` are unaffected — none of these changes are intended to merge into `dev`.
