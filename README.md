# Nielo Chryss Gigare Portfolio

This repository contains a simple, static portfolio website for Nielo Chryss Gigare.

What's new
- projects.json: a JSON data file with project entries (used by the site)
- Admin UI: You can add projects locally in the site (stored in your browser's localStorage)
- Export: Use the "Export JSON" button in the admin panel to copy the combined projects JSON (remote + local) to your clipboard so you can paste it into `projects.json` in this repo and commit it to persist changes.

How the "add project" system works
- The site reads `projects.json` (remote) and merges it with projects you add in the admin panel (local-only). The combined list is shown in the Projects section.
- Adding projects via the admin form stores them in your browser. To persist them to the repository, export the combined JSON and update `projects.json` in the repo.

Persisting projects to the repo
1. Click "Add / Manage Projects" on the live site and add projects.
2. Click "Export JSON" to copy the combined projects list as JSON.
3. Paste that JSON into `projects.json` in this repository and commit the change.

To update `projects.json` directly from your machine:

```bash
# clone the repo, edit projects.json, then push
git clone https://github.com/GdNying46-byte/nielo-chryss-gigare-portfolio.git
# edit projects.json
git add projects.json
git commit -m "Update projects"
git push origin main
```

Running locally
Open `index.html` in a browser, or serve it with a small local HTTP server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

