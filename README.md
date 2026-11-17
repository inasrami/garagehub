# GarageHub

GarageHub is a React single-page application for car enthusiasts. Members share cars, manage their own posts, and discuss cars through comments. Visitors can browse the catalog and read car details without an account.

**Live frontend:** https://garagehubproject.netlify.app

**Repository:** https://github.com/inasrami/garagehub

The source implementation is prepared; connecting Supabase, verifying the live integration and deploying are still required. See [verification status](docs/VERIFICATION.md). Do not submit until the live URL above is filled and all checks pass.

## Install and run

Use Node.js 22.12+ within Node 22. Create a Supabase project, run migrations 001–003 in order, and configure email/password auth using [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md).

```bash
cp .env.example .env
# Fill in your Supabase Project URL and publishable key in .env.
npm install
npm run dev
```

After the first install, commit the updated package-lock.json. Future clean installs can use npm ci. No service-role or secret key belongs in browser code.

```bash
npm test
npm run build
npm run preview
```

Follow [deployment instructions](docs/DEPLOYMENT.md) for Netlify and [the test checklist](docs/TEST_CHECKLIST.md) for guest/owner/second-user checks. The live policy test needs two configured accounts and is run separately.

## Architecture

React function components, JavaScript, Vite, React Router, external CSS, and the Supabase JavaScript SDK. Supabase hosts Auth and Postgres, so there is no custom Express server. The original teal/light design is retained.

| Folder/file | Responsibility |
| --- | --- |
| src/App.jsx | Public, guest-only, private and owner route tree |
| src/contexts/AuthContext.jsx | Shared session, login, registration, logout, auth subscription |
| src/pages | Route-level views |
| src/components | Shared layout, cards, forms, comments and guards |
| src/hooks | Page titles and cancellable data loading |
| src/services | Car/comment API operations |
| src/lib/supabase.js | Configured SDK and request timeout |
| src/utils | Validation, payload normalization, error messages |
| src/styles | User's base palette plus plain feature styles |
| supabase | Ordered SQL migrations and database permissions |
| tests | Offline validation and payload tests |
| scripts/check-permissions.mjs | Live two-user database permission checks |
| netlify.toml | Build configuration and SPA fallback |

## Functional Guide

### 1. Project Overview

Application name: GarageHub. Category: car enthusiast community. Members publish car profiles containing a make, model, year, image and description. The application gives owners a place to share their cars and discuss other members' posts.

### 2. User Access and Permissions

Guests can access Home, Cars, About, individual car details and comments. They can search the catalog and open Login/Register. Authenticated users can access My garage, add cars and post comments. Only the car's owner can edit/delete that car. Only a comment's author can delete that comment; owning the car does not grant deletion of someone else's comment. Database RLS and column grants enforce permissions independently of the frontend.

### 3. Authentication and Session Handling

AuthProvider starts in a loading state, subscribes to Supabase auth changes, and reads the stored session. Guards wait for initialization. Login uses email/password; registration also supplies a display name which the database trigger copies to a public profile. When email confirmation is disabled, successful signup starts a session immediately. When enabled, signup without a session displays confirmation instructions. The provider shares user/loading/error and authentication functions through Context. Supabase manages session tokens in browser storage and refreshes them. Context mirrors session state; it is not the backend authorization boundary. Logout uses local session scope, clears the current session and updates navigation. The auth subscription is removed on unmount. Exact confirmation/provider settings must be verified in the configured project.

### 4. Routing Structure

All pages are children of Layout, which renders an Outlet. There are nine named page patterns plus the catch-all route.

| Route | Access and purpose |
| --- | --- |
| / | Public Home |
| /cars | Public dynamic catalog |
| /cars/:carId | Public dynamic details/comments |
| /about | Public information |
| /login | Guests only |
| /register | Guests only |
| /my-garage | Signed-in user's dynamic car list |
| /cars/new | Signed-in create form |
| /cars/:carId/edit | Signed-in car owner only |
| * | Not found |

Details and edit use the carId URL parameter. PrivateRoute redirects guests to login while retaining their requested path. GuestRoute redirects signed-in users to My garage. OwnerRoute fetches the car and blocks nonowners with an Access denied state; missing records receive a separate state.

### 5. List to Details Flow

The catalog fetches car records ordered newest first from Supabase. Cards show image, make/model, year and public owner name. A controlled search input filters the returned list by make/model. View details uses Link with the car UUID. CarDetailsPage uses useParams to fetch that record and its public owner name, then loads its comments. My garage fetches records filtered by the current user ID. The default hosted API response limit applies to lists; server-side pagination is not included in this exam scope.

### 6. Data Source and Backend

Hosted Supabase Auth and Postgres provide a real remote backend. profiles references Auth users, cars references profiles, and comments references both cars and profiles. The browser SDK makes remote API requests. There are no hardcoded car/comment arrays, simulated users, or localStorage database. Auth token persistence is separate from application record persistence. The database keeps records between visits; deleting a car cascades to its comments. Profile rows expose display names, not email addresses.

### 7. Data Operations

Create: a controlled form validates and normalizes car data, then inserts permitted fields. The database supplies UUID, owner ID and timestamp; the app navigates to the new details page.

Read: catalog, details, My garage and comments fetch from their service modules through the SDK.

Update: the owner guard loads the record; CarForm is prefilled. Saving updates permitted fields and navigates back to details, which fetches fresh data. RLS filters nonowners, and column grants prevent changing owner_id, id or created_at.

Delete: the owner confirms a browser confirmation dialog. On success the app returns to My garage. Errors remain visible; cancelled deletion does nothing. Zero-row update/delete results become explicit missing-record/permission errors.

Comments: signed-in users insert a body and car ID; the backend sets their author ID. Authors can confirm deletion of their own comments. Successful actions refetch the list.

### 8. Forms and Validation

Forms: registration, login, create car, edit car, comment, plus controlled catalog search. React state holds all input values, onChange updates them, and onSubmit prevents native page submission. Busy controls block duplicate submits.

| Field | Rules |
| --- | --- |
| Email | Trimmed, nonempty, basic email format; Auth provider validates credentials |
| Registration password | At least 8 characters; confirmation must match |
| Display name | Trimmed length 2–30 |
| Make | Trimmed length 2–40 |
| Model | Trimmed length 1–60 |
| Year | Four-digit integer from 1886 through current year plus one |
| Image URL | HTTPS, no URL credentials, length at most 2000; broken images show fallback |
| Description | Trimmed length 20–3000 |
| Comment | Trimmed length 1–1000 |

Field errors appear next to controls. API failures appear in alert regions and preserve unsaved values. SQL constraints also validate stored records; frontend validation alone is not trusted. Image address validation cannot guarantee the remote host permits embedding.

### 9. React Specific Techniques

useState manages forms, messages, search and request states. useEffect initializes/subscribes to auth and loads data. useCallback stabilizes service callbacks passed to useResource. On mount, useResource starts a request; changing its record/user key fetches again; cleanup aborts the old request and prevents stale completion from updating state. usePageTitle updates/restores the document title. AuthContext is consumed by Layout, guards, auth pages and user/owner interactions. Components use external global.css and features.css; there are no gradients or animation dependencies.

### 10. Typical User Flow

1. Browse Cars, optionally search, and open details.
2. Register or log in; visit My garage.
3. Add a car, read its details, edit it, and verify the saved changes.
4. Open another member's car and post a comment.
5. Delete an owned comment or disposable car, then log out.

### 11. Error and Edge Case Handling

Loading, API/network errors and Retry are shown for data requests. Network requests time out after 15 seconds. Empty lists, no search matches, invalid/missing car IDs and unknown routes have separate states. Broken images display a text placeholder. Authentication failures are surfaced, initial guards wait for session loading, and auth subscriptions are cleaned up. Missing environment configuration displays a setup error instead of crashing at startup. Unauthorized edits are blocked in the UI and database. Concurrent deletion produces a useful error rather than silently reporting success. The confirmation dialog prevents accidental deletions. Comments/text are rendered as React text rather than injected HTML.

## Verification and limitations

Offline validation tests pass during preparation. Full build, browser integration, SQL migrations and deployment still require verification in the user's environment; see docs/VERIFICATION.md. No production URL is claimed yet. If using an account plan with inactivity or availability limits, document the actual behavior here before submission. Keep the backend accessible to reviewers.
