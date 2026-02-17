# Vercel Deployment Guide - Leafinity

This guide explains how to deploy the Leafinity full-stack app to Vercel.

## Prerequisites

1. **Vercel account** – Sign up at https://vercel.com
2. **GitHub repository** – Push this project to GitHub (Vercel integrates with GitHub for auto-deployment)
3. **MongoDB Atlas** – Already set up (URI in `server/.env`)
4. **Cloudinary account** – Already configured

## Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Leafinity full-stack app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/leafinity.git
git push -u origin main
```

### 2. Create Vercel Project from GitHub

1. Go to https://vercel.com/new
2. Import repository → Select your GitHub repo
3. Vercel auto-detects it's a monorepo
4. Click **"Deploy"** (do NOT set environment variables yet)

### 3. Set Environment Variables in Vercel Dashboard

After initial deployment, go to your Vercel project → **Settings** → **Environment Variables**

Add all these (copy from `server/.env`):

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `5000` | Yes |
| `MONGODB_URI` | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | Your secret | Yes |
| `COOKIE_NAME` | `leafinity_token` | Yes |
| `COOKIE_SECURE` | `true` | Yes |
| `CLIENT_ORIGIN` | `https://your-vercel-domain.vercel.app` | Yes |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | Yes |
| `CLOUDINARY_API_KEY` | Your API key | Yes |
| `CLOUDINARY_API_SECRET` | Your API secret | Yes |

**Update `CLIENT_ORIGIN`:** After Vercel creates your domain, use it here. Example: `https://leafinity.vercel.app`

### 4. Update Client Environment (Local Development)

Create `client/.env.local`:

```
VITE_API_URL=https://your-vercel-domain.vercel.app/api
```

For local development, you can keep:

```
VITE_API_URL=http://localhost:5000/api
```

### 5. Trigger New Deployment

Once environment variables are set:

**Option A:** Push to GitHub (auto-deploys)
```bash
git add .
git commit -m "Update env config for Vercel"
git push
```

**Option B:** Re-deploy from Vercel Dashboard
- Go to Vercel project → **Deployments** → Click latest → **Redeploy**

### 6. Verify Deployment

1. Visit `https://your-vercel-domain.vercel.app`
2. Check `/api/health` – should return `{ ok: true, service: "leafinity-api", dbState: 1 }`
3. Try logging in with the seeded admin:
   - Email: `admin@leafinity.com`
   - Password: `admin123`

## Troubleshooting

### API calls fail with 503/502

- Check server logs: Vercel Dashboard → **Logs**
- Ensure all env vars are set
- Check MongoDB connection string allows Vercel IPs (MongoDB Atlas → Network Access)

### 401 Errors on static assets (/vite.svg, /assets/*)

**This happens when routes aren't configured correctly**

- Verify `vercel.json` has explicit routes for static files BEFORE the catch-all route:
  ```json
  "routes": [
    { "src": "/api/(.*)", "dest": "server/api/index.js" },
    { "src": "/assets/(.*)", "dest": "client/dist/assets/$1" },
    { "src": "/(.*)", "dest": "client/dist/index.html" }
  ]
  ```
- **After fixing `vercel.json`, redeploy:** `git push` or click **Redeploy** in dashboard
- Clear browser cache (Cmd+Shift+Del or Ctrl+Shift+Del)

### CORS errors

- Verify `CLIENT_ORIGIN` matches your Vercel domain
- Check that `COOKIE_SECURE=true` for production

### Database not seeding

Run seed script locally (it won't run automatically on Vercel):

```bash
cd server
node src/scripts/seed.js
```

### Static assets 404

Ensure `client/vite.config.js` has correct build output. It should be `dist/`.

## Project Structure for Vercel

```
urban/
├── server/               → Node.js/Express API (deployed to Vercel Functions)
│   ├── api/
│   │   └── index.js      → Vercel API handler
│   ├── src/
│   ├── .env              → Environment variables (keep secret!)
│   └── package.json
├── client/               → React + Vite SPA (deployed to Vercel Static)
│   ├── src/
│   ├── dist/             → Built static files
│   └── package.json
├── vercel.json          → Vercel configuration
└── .vercelignore        → Files to ignore during deployment
```

## Monitoring & Logs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Logs:** Project → **Logs** → View real-time and historical logs
- **Analytics:** Project → **Analytics** → Performance metrics

## Tips

1. **Database backups:** Use MongoDB Atlas automated backups
2. **Cloudinary limits:** Free tier has upload/storage limits
3. **Rate limiting:** Consider adding rate limiting middleware for production
4. **Error tracking:** Set up Sentry or similar for error monitoring

## Next Steps

- Set up custom domain in Vercel (Project → **Settings** → **Domains**)
- Enable CI/CD checks (branch protection in GitHub)
- Add monitoring and alerting

Good luck! 🚀
