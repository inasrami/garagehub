# Phase 1 setup and first commit

This ZIP is the first development milestone only. It does not satisfy the whole exam. Work through the files, run the app, and make your first real commit today, November 14, 2026.

## 1. Open the project

Extract the ZIP. Open the extracted `garagehub` folder in VS Code. Open the integrated terminal; it should be in the folder containing `package.json`.

```bash
node --version
npm install
npm run dev
```

Use a compatible Node version listed in README. Keep the terminal running and open the URL it prints. Stop it using Ctrl+C when needed.

## 2. Verify the milestone

- Home loads without browser console errors.
- Home, Cars, and About navigate without a full document reload.
- Active navigation matches the current page.
- An unknown path such as `/wrong-turn` shows the 404 page.
- Refresh on `/about` works in the local development server.
- At a 375px viewport, content fits without horizontal scrolling.
- Tab navigation shows visible focus; Skip to content works.
- All call-to-action links go to real routes.
- Cars shows the catalog-coming-soon shell, not fabricated data.

Stop the dev server, then run:

```bash
npm run build
npm run preview
```

Repeat basic navigation in preview. Do not claim the build passed unless it actually did. If installation or build fails, share the error before making the commit.

## 3. Understand the code

Read these files in order:

1. `src/main.jsx`: how React starts and where BrowserRouter is provided.
2. `src/App.jsx`: how URLs select page components.
3. `src/components/Layout.jsx`: how Outlet avoids duplicating the header and footer.
4. `src/pages/HomePage.jsx`: how JSX and Link build a page.
5. `src/hooks/usePageTitle.js`: how an effect runs and cleans up.
6. `src/styles/global.css`: how the shared styles adapt to mobile.

Practice explaining why navigation uses Link, what Outlet renders, and why the custom hook returns a cleanup function.

## 4. Commit

For this new project, run these commands once from the `garagehub` folder after your checks pass:

```bash
git init -b main
git add .
git status
git commit -m "feat: initialize React app with public routes and responsive layout"
```

Inspect `git status` before committing: include `package-lock.json`; exclude `node_modules`, build output, and secrets. If this folder is already an initialized repository, skip `git init`.

Create a new public GitHub repository named `garagehub`, without generating a README, license, or .gitignore on GitHub. Use the repository's actual URL:

```bash
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` before running that command. If origin is already configured, inspect it with `git remote -v` rather than adding it again.

## 5. Keep the same repository for every phase

Later ZIPs will be applied inside this same project folder. Preserve your `.git` directory, `.env`, and installed dependencies. Do not create a new repository for each ZIP. Follow each phase's change and deletion list, rerun its checks, and commit only when the milestone works and you understand it.

For the next phase, share your GitHub link and any problems from the checks above. Further stages will be prepared in later sessions as actual development milestones. No future commits have been made or scheduled for you.

## Simple design revision

The updated Phase 1 uses a white background, standard Arial font, blue buttons, simple borders, and a basic header and footer. There are no gradients, external fonts, decorative panels, or animations.

If Phase 1 has not been committed yet, use the original first-commit message above. If you already committed the previous layout, replace the updated files inside the same repository, check the pages and build, and make a separate commit:

```bash
git add src index.html README.md docs/PHASE_1.md
git commit -m "style: simplify layout with basic colors and typography"
```

Updated files: the four page components, Layout.jsx, global.css, index.html, README.md, and this guide. No files need deleting and dependencies are unchanged. Keep your existing .git folder and package-lock.json. This design revision does not replace the requirement to develop and commit on three different days.
