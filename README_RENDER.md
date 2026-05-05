Render deployment guide — Neo Bank backend

This file contains exact instructions and values to deploy the `backend/` service to Render using either the UI or the `render.yaml` manifest in this repo.

1) Option A — Import `render.yaml` (recommended)
- In Render dashboard: New → Import from Git.
- Connect GitHub and select the repository `your-github-username/neo-bank-system`.
- Render will detect `render.yaml`. Confirm the service `neo-bank-backend` and import.
- After import, open the service page and verify settings.

2) Option B — Create Web Service manually (UI)
- New → Web Service → Connect GitHub → select repo `neo-bank-system`.
- Name: `neo-bank-backend` (or your choice)
- Environment: `Node` (Node 20+ recommended)
- Branch: `main` (or your branch)
- Root Directory: `backend`
- Build Command:

  npm ci && npm run build

- Start Command:

  npm start

- Health Check Path: `/` (or `/api/health` if you add a health route)
- Auto Deploy: enable
- Create service and wait for the build to finish.

3) Environment Variables (critical)
Set these on the Render service Settings → Environment:
- NODE_ENV=production
- PORT=5000 (optional; Render sets PORT automatically)
- JWT_SECRET= (YOUR_STRONG_SECRET)
- RECAPTCHA_SECRET= (your google reCAPTCHA secret)
- EMAIL_USER= (SMTP username or email)
- EMAIL_PASS= (SMTP password or app password)
- EMAIL_FROM=Your Name <you@example.com>

4) Google reCAPTCHA setup
- In the Google reCAPTCHA admin console, register your Render domain:
  - Example: `neo-bank-backend.onrender.com` or your custom domain.
- Ensure the site key (used in frontend) is paired with the secret you set as `RECAPTCHA_SECRET`.

5) Verify deployment (smoke tests)
- Watch logs on Render: Service → Events/Logs.
- Test endpoints once service is live:

```bash
curl -i https://<your-render-service>.onrender.com/api/health
# or
curl -X POST https://<your-render-service>.onrender.com/api/send-otp \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com"}'
```

6) Optional: Add health route (quick)
- Add an endpoint in `backend/src/index.ts`:

```ts
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
```

- Rebuild and push — Render will auto-deploy.

7) Using Dockerfile (if preferred)
- Render supports Docker. If you want to use your `backend/Dockerfile`, create the Web Service and choose "Docker" in the UI and point root to `backend`.

8) Persistence & production notes
- Move from `data.json` to a managed DB (Supabase/Postgres) for production. Serverless or container instances may not preserve local files across deploys.
- Use SMTP provider or transactional email service (SendGrid, Mailgun) and store API keys in Render env vars.
- For security, use an app-specific password for Gmail (2FA) if using Gmail SMTP.

9) If you want, I can:
- Add `api/health` endpoint now and push to the repo.
- Create a `render.yaml` with your GitHub repo filled in (I added a template; replace `your-github-username`).
- Convert `data.json` persistence to Supabase as a simple migration.

Reply with which follow-up you want: "Add health route", "Fill render.yaml with my repo", or "Add Supabase migration".
