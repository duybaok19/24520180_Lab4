# UIT S3T - LAB 4 AI GOVERNANCE RULES

Attach this file to EVERY AI prompt. Work on ONE sub-task per prompt. Return only the file(s) requested for the current sub-task.

1. **STACK:** React 19 + Vite + React Router v7 (import from `'react-router'`) on the client; Node + Express on the server; ES2024. Mongoose 8 only when a database is introduced (homework).
2. **CONTRACT-FIRST LOOP:** (1) Contract -> (2) failing test -> (3) minimal implementation -> (4) refactor while tests stay green. Never write the implementation before a failing test exists.
3. **NO LEGACY APIS:** Ban React Router v5 (`<Switch>`, `<Redirect>`, `exact`, `activeClassName`, `component={...}`), `react-media`, `typeface-roboto`, Material-UI v4 (`@material-ui/core`), `defaultProps` (use default parameters), class components, `ReactDOM.render`, `keyCode`, `window.alert`.
4. **ROUTING:** Use `<Routes>` / `<Route element={...}>`, nested layouts with `<Outlet />`, `NavLink className={({ isActive }) => ...}`, and `useParams()`. Every lookup by route param must handle "not found" explicitly (`role="alert"` 404 state). Add a `path="*"` catch-all route.
5. **SYNCHRONOUS FORM VALIDATION:** Compute errors and form validity synchronously during render with a pure validate function (plain computation or `useMemo`). NEVER use `useEffect` to validate, sync form state, or sync derived state. Share form state with `createContext` / `useContext`. Every field uses `useId()`, `<label htmlFor>`, `aria-invalid`, and `aria-describedby` pointing to its error element (`role="alert"`).
6. **ASYNC & EFFECTS:** Every `fetch` inside `useEffect` creates its `AbortController` inside the effect, passes `{ signal }`, checks `signal.aborted` before every `setState`, ignores `AbortError`, and returns `() => controller.abort()`. No `didCancel` boolean flags. Dependency arrays are always complete; never omit them.
7. **SERVER:** Express with `cors({ origin: process.env.CLIENT_ORIGIN })`. Validate every POST body (400 on missing or invalid fields, trim strings, enforce max length). Generate IDs with `crypto.randomUUID()`. Use `async/await` with `try/catch`; no unhandled promise rejections.
8. **SECRETS:** No hardcoded connection strings, passwords, or keys. Read from `process.env` (server) / `import.meta.env` (client). Commit only `.env.example`; `.env` is gitignored. If a required variable is missing, throw at startup.
9. **MONGOOSE 8:** `async/await` only; no callbacks (`.exec((err, doc) => ...)` is removed); no `useNewUrlParser` / `useUnifiedTopology`; use `.lean()` for read-only queries.
10. **SEMANTIC & ACCESSIBLE UI:** Use `<main>`, `<nav>`, `<section>`, `<article>`, `<dl>/<dt>/<dd>`, `<output>`. Do not use `<div>` where a semantic element exists. Icon-only buttons need `aria-label`. Buttons are `type="button"` unless they submit. Keys are stable IDs, never array index or `Math.random()`. HTTPS URLs only.
11. **STATE HYGIENE:** Immutable updates only. Derived data is computed during render. Lift state only as high as needed; shareable UI state lives in the URL (`useParams`, `useSearchParams`).
12. **DEPENDENCIES:** Do not add a package that is not already in `package.json` without asking.
