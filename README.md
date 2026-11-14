# GarageHub

GarageHub is a React single-page application for car enthusiasts. The finished application will let members publish their cars, manage their own posts, and comment on other cars.

**Current milestone: Phase 1 — project foundation and public layout. This is a development snapshot, not an exam-ready submission.**

## Run the project

Use Node.js 22.12 or newer in the Node 22 release line (Node 22.16 is suitable).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Before committing, also run:

```bash
npm run build
npm run preview
```

`npm install` creates `package-lock.json`. Commit that file with the source so later installs are reproducible. After it is committed, `npm ci` can install the locked dependencies.

## Current functionality

- Simple light layout with Arial text, blue buttons, and responsive cards.
- Shared header, navigation, footer, and nested layout route.
- Explore page shell; it deliberately contains no fake car records.
- About page and catch-all 404 page.
- Route-specific document titles and scroll reset on navigation.
- Keyboard focus styles, skip link, and no animations.

Not yet implemented: remote data, authentication, private routes, ownership checks, car CRUD, comments, and deployment. The catalog shell does not count as a completed dynamic page.

## Stack and architecture

React and JavaScript, Vite, React Router, and external CSS. The planned hosted backend is Supabase; it is not connected in this phase.

| Location | Responsibility |
| --- | --- |
| `src/main.jsx` | Mounts React, enables StrictMode, and provides BrowserRouter |
| `src/App.jsx` | Defines the route tree |
| `src/components/Layout.jsx` | Shared navigation, footer, Outlet, and scroll reset |
| `src/pages/` | One component per page |
| `src/hooks/usePageTitle.js` | Updates the page title and restores it during effect cleanup |
| `src/styles/global.css` | Shared visual styles and responsive breakpoints |
| `docs/` | Development phases and manual verification steps |

## Deployment

Not deployed yet. Before submission, this section must contain the actual public frontend URL. The backend must be hosted, persistent, and accessible. Direct navigation and refresh on nested frontend routes must work in production.

## Functional Guide

This guide records the Phase 1 state. All remaining sections must be updated with actual implemented behavior before submission.

### 1. Project Overview

Application name: GarageHub. Category: car enthusiast community. The intended purpose is to let people share cars, explain modifications and ownership stories, and discuss other members' builds. Phase 1 establishes the visual foundation and public routes.

### 2. User Access and Permissions

Guests can visit Home (`/`), Explore (`/cars`), and About (`/about`). There is currently no user account system or private area. Authenticated access and author-only permissions are scheduled for later phases.

### 3. Authentication and Session Handling

Not implemented in Phase 1. The planned implementation uses Supabase Auth and an AuthContext with an initial session-loading state, an auth subscription, and subscription cleanup. Login, registration, logout, refresh persistence, and expired sessions must be verified before this section is finalized.

### 4. Routing Structure

The current nested layout route wraps three public pages and a catch-all 404. BrowserRouter enables client-side navigation, and Layout renders child pages through Outlet. Parameterized routes and guards are not implemented yet. See `docs/PROJECT_PLAN.md` for the final route target.

### 5. List to Details Flow

The Explore route is currently a shell. It does not fetch or display records. A real catalog and a `/cars/:carId` details page will be implemented with remote data in Phase 2A.

### 6. Data Source and Backend

No backend is connected in Phase 1. Supabase is the planned provider for hosted Postgres and authentication. Real data persistence and database access policies must be implemented and tested; frontend-only permission checks are insufficient.

### 7. Data Operations

No CRUD operations are implemented yet. The planned `cars` collection will support create, read, update, and delete. Users must own a car post to edit or delete it. The UI and backend must both enforce this rule. Read operations are scheduled for Phase 2A; writes and ownership for Phase 3A.

### 8. Forms and Validation

No forms are implemented yet. Planned forms include registration, login, create/edit car, and comment. Candidate validated fields include email, password, car make/model, year, image URL, description, and comment body. The final guide must state the actual validation rules and error behavior.

### 9. React Specific Techniques

The current app uses function components, nested routes, Link, NavLink, useLocation, and useEffect. `usePageTitle` sets document.title when a page mounts or its title changes and restores the previous title in its cleanup. Layout resets scrolling when the pathname changes. StrictMode is enabled. Context and controlled form state are not implemented yet. Styling lives in an external CSS file.

### 10. Typical User Flow

Current flow: open Home, select Browse cars, see the catalog shell, visit About, and return using the shared navigation. Unknown routes display a useful 404 page. The final authenticated create/edit/comment flow will replace this description once implemented.

### 11. Error and Edge Case Handling

Unknown routes show the 404 page. There are no API calls or auth flows yet, so network errors, loading states, missing records, and authentication failures remain to be implemented and tested.

## Phase 1 verification

Source files and local import paths were checked during preparation. Dependency installation and the production build could not be run in the preparation environment because `registry.npmjs.org` could not be resolved. Run the commands above and complete `docs/PHASE_1.md` before committing.

## Reference documentation

- [React documentation](https://react.dev/learn)
- [Vite setup](https://vite.dev/guide/)
- [React Router declarative routing](https://reactrouter.com/start/declarative/routing)
- [Supabase React quickstart for the next phase](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
