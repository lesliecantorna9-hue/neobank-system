# NEO BANK SYSTEM - Complete Deployment Guide

This guide covers deploying both the **frontend (Netlify)** and **backend (Render)**.

---

## Step 1: Deploy Backend to Render

### Option A: Using render.yaml (Recommended)

1.  Push your code to GitHub (make sure your repo is public or connected to Render).
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New** → **Import from Git**.
4.  Connect your GitHub account and select your repository.
5.  Render will detect `render.yaml` and show the `neo-bank-backend` service. Click **Import**.
6.  After importing, go to your service's **Settings** → **Environment**.
7.  Add these environment variables:
    - `NODE_ENV` = `production`
    - `PORT` = `5000`
    - `JWT_SECRET` = (Generate a strong secret key, e.g., use `openssl rand -hex 32`)
    - `RECAPTCHA_SECRET` = (Your Google reCAPTCHA secret key - optional, can leave blank for testing)
    - `EMAIL_USER` = (Your Gmail address or SMTP username)
    - `EMAIL_PASS` = (Your Gmail app password - enable 2FA first then create an app password)
    - `EMAIL_FROM` = `Your Name <you@example.com>`
8.  Wait for Render to build and deploy your backend.
9.  Copy your backend URL (it will look like `https://your-service-name.onrender.com`).

### Option B: Manual Setup

1.  Go to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New** → **Web Service**.
3.  Connect your GitHub repo.
4.  Configure as follows:
    - Name: `neo-bank-backend`
    - Environment: `Node`
    - Branch: `main` (or your branch name)
    - Root Directory: `backend`
    - Build Command: `npm ci && npm run build`
    - Start Command: `npm start`
5.  Add environment variables as in Option A.
6.  Click **Create Web Service**.

---

## Step 2: Update Frontend with Your Backend URL

1.  Open `frontend/script.js`.
2.  Find the line:
    ```javascript
    const RENDER_BACKEND_URL = 'https://your-render-service.onrender.com/api'; // Replace this!
    ```
3.  Replace `https://your-render-service.onrender.com` with your actual Render backend URL (don't forget the `/api` at the end!).
4.  Save and commit the change to GitHub.

---

## Step 3: Deploy Frontend to Netlify

### Option A: Netlify UI (Recommended)

1.  Go to [Netlify](https://app.netlify.com/) and sign up/login.
2.  Click **Add new site** → **Import an existing project**.
3.  Connect to GitHub and select your repository.
4.  Configure:
    - Base directory: leave blank
    - Publish directory: `frontend`
    - Build command: leave blank (no build needed)
5.  Click **Deploy site**.
6.  After deployment, you can customize your site name in **Site settings**.

### Option B: Netlify CLI

1.  Install Netlify CLI:
    ```bash
    npm install -g netlify-cli
    ```
2.  Login:
    ```bash
    netlify login
    ```
3.  Initialize:
    ```bash
    netlify init
    ```
4.  Deploy:
    ```bash
    netlify deploy --dir=frontend --prod
    ```

---

## Test the Deployed App

1.  Open your Netlify site URL.
2.  Test login with:
    - Email: `admin@neobank.com`
    - Password: `admin123`
3.  Or register a new account.

---

## Troubleshooting

- **Backend not responding?** Check Render logs (Service → Logs).
- **CORS errors?** The backend already has CORS enabled, so this shouldn't be an issue.
- **Emails not sending?** Make sure you set up Gmail app password correctly.

---

## Optional: Supabase for Persistence

By default, the backend uses `data.json` which isn't persistent across Render deploys. For production, use Supabase (PostgreSQL):

1.  Create a Supabase project at [supabase.com](https://supabase.com/).
2.  Run the SQL in `backend/sql/create_app_state_table.sql`.
3.  Add these environment variables to Render:
    - `SUPABASE_URL` = (Your Supabase URL)
    - `SUPABASE_KEY` = (Your Supabase anon public key)
4.  Redeploy your Render backend.
