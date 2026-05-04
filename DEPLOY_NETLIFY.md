Steps to deploy the frontend to Netlify

1) Option A — Quick (Netlify UI):
   - Create a Netlify account and new site from Git.
   - Connect your repository and set publish directory to `frontend`.
   - No build command is needed (static site). Save and deploy.

2) Option B — Netlify CLI (local deploy):
   - Install the CLI:

```bash
npm install -g netlify-cli
```

   - Login:

```bash
netlify login
```

   - From repository root, run a production deploy:

```bash
netlify deploy --dir=frontend --prod
```

Notes about the backend:
- This repo contains a Node/TypeScript backend (`backend/`) which runs on port 5000 locally. Netlify only hosts static sites and serverless functions.
- Options:
  - Host the backend elsewhere (Render, Vercel, Railway, Heroku) and update frontend API URLs to the deployed backend URL.
  - Convert backend endpoints into Netlify Functions (move handlers into `netlify/functions/`) — requires refactor from the existing Express/ts-node server.

If you want, I can:
- Configure the frontend to call a deployed backend URL.
- Create example Netlify Functions for 1-2 endpoints.
- Link the repo to Netlify (`netlify init`) using the CLI.
