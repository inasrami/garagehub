# GarageHub retake plan

The specification requires at least five meaningful commits across at least three different days. This project is developed in separate milestones. Each major change gets its own ZIP and commit message when that work is completed. Do not combine all stages into one day's history.

The listed days are the intended local dates in Sofia. The specification gives a submission deadline of November 17, 2026 at 15:59; check the course page's displayed timezone. Aim to complete and deploy by November 16.

| Day | Milestone | Delivery |
| --- | --- | --- |
| November 14 | Phase 1: foundation, layout, public route shells | This ZIP; one commit after local verification |
| November 15 | Phase 2A: hosted database, catalog and details | Separate future ZIP and commit |
| November 15 | Phase 2B: registration, login, logout, session and route guards | Separate future ZIP and commit |
| November 16 | Phase 3A: create, edit, delete, My garage, ownership policies | Separate future ZIP and commit |
| November 16 | Phase 3B: comments, validation, error handling, integration checks | Separate future ZIP and commit |
| November 16 | Phase 4: production deployment and complete Functional Guide | Separate future ZIP and commit |

This gives at least six meaningful milestones across three dates, provided they are actually worked on and committed on those dates. Commit timestamps must reflect real work. GitHub publication, deployment and course submission remain required; a local ZIP alone is not a submission.

## Final application scope

Users publish car posts with a make, model, year, image URL, and story. Visitors can browse and read details. Logged-in members create their own posts, edit/delete only their own posts, and comment on cars. My garage lists the signed-in user's posts from the backend.

| Route | Purpose | Final access |
| --- | --- | --- |
| `/` | Home | Everyone |
| `/cars` | Dynamic catalog | Everyone |
| `/cars/:carId` | Dynamic car details and comments | Readable by everyone |
| `/my-garage` | Dynamic list of the user's cars | Signed-in users |
| `/cars/new` | Create car | Signed-in users |
| `/cars/:carId/edit` | Edit car | Owner only |
| `/login` | Sign in | Guests only |
| `/register` | Create account | Guests only |
| `/about` | Community information | Everyone |
| `*` | Not found | Everyone |

Catalog, details, and My garage provide three distinct data-driven pages. Details and edit provide two parameterized routes. Static Home/About and Login/Register do not count toward the three dynamic pages.

## Requirements to verify before submission

- [ ] Public repository with at least five meaningful commits over three different dates.
- [ ] At least five routes, three dynamic pages, and two parameterized routes.
- [ ] Register, login, logout, session restore, and AuthContext.
- [ ] Guest-only, private, and owner route guards.
- [ ] Real remote data with persistence across visits.
- [ ] Full car CRUD; backend policies enforce ownership.
- [ ] API-backed comments by logged-in users.
- [ ] Controlled forms and synthetic events.
- [ ] Input validation plus loading, error, empty, and missing-record states.
- [ ] Hook mount/update/unmount example with cleanup.
- [ ] External CSS and readable component/service organization.
- [ ] Test guest, owner, and second-user access independently.
- [ ] Production build passes and deployed frontend matches the submitted code.
- [ ] Hosted backend reachable; any free-tier limitations documented accurately.
- [ ] Deep-link refresh works on deployed routes.
- [ ] All 11 Functional Guide sections describe implemented and verified behavior.
- [ ] README includes installation/start commands and the actual deployment link.
- [ ] Repository link submitted through the course page before the deadline.

## Scope boundaries

Keep the project focused on posts and comments. Payments, chat, booking calendars, admin panels, and file uploads are outside the initial scope. Use a validated image URL field first. No mock data may masquerade as a real backend in the submitted application.
