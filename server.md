# Server Configuration - SkyPro Web

## Hosting Information

- **Hosting Provider:** Hostinger
- **Server IP:** `<SERVER_IP>`
- **SSH User:** `<SSH_USER>`
- **SSH Command:** `ssh <SSH_USER>@<SERVER_IP>`

## Database Credentials

- **Host:** `<DB_HOST>`
- **Port:** `3306`
- **Database:** `skypro`
- **User:** `<DB_USER>`
- **Password:** `<DB_PASSWORD>`
- **Connection String:** `mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:3306/skypro`

## GitHub Repository

- **Repo URL:** `https://github.com/imhzm/SkyProLandingPage.git`
- **Branch:** `main`
- **Local Path:** `C:\Users\skywa\OneDrive\Desktop\SkyPro\skypro-web`
- **Server Path:** `/var/www/skypro.skywaveads.com`

## Pull Updates from GitHub to Server

```bash
# SSH into server
ssh <SSH_USER>@<SERVER_IP>

# Navigate to project directory
cd /var/www/skypro.skywaveads.com

# Pull latest changes
git pull origin main

# Install dependencies (if package.json changed)
npm install --legacy-peer-deps

# Rebuild the project
npm run build

# Restart the application
pm2 restart skypro-web --update-env
```

## Quick Deploy Command (from local)

```bash
# Add and commit changes
git add .
git commit -m "Your commit message"
git push origin main

# Then SSH to server and pull
ssh <SSH_USER>@<SERVER_IP> "set -e; cd /var/www/skypro.skywaveads.com; git pull origin main; npm run build; pm2 delete skypro-web || true; PORT=3200 HOSTNAME=127.0.0.1 pm2 start /var/www/skypro.skywaveads.com/.next/standalone/server.js --name skypro-web --cwd /var/www/skypro.skywaveads.com/.next/standalone --update-env; pm2 save"
```

## Application URLs

- **Website:** `https://skypro.skywaveads.com`
- **Admin Dashboard:** `https://skypro.skywaveads.com/admin`
- **Login Page:** `https://skypro.skywaveads.com/auth/login`
- **API Base:** `https://skypro.skywaveads.com/api`

## Production Process

- **PM2 App:** `skypro-web`
- **Port:** `3200`
- **Runtime:** Next.js standalone
- **Script:** `/var/www/skypro.skywaveads.com/.next/standalone/server.js`
- **CWD:** `/var/www/skypro.skywaveads.com/.next/standalone`

If the process needs to be recreated:

```bash
pm2 delete skypro-web
cd /var/www/skypro.skywaveads.com
PORT=3200 HOSTNAME=127.0.0.1 pm2 start /var/www/skypro.skywaveads.com/.next/standalone/server.js --name skypro-web --cwd /var/www/skypro.skywaveads.com/.next/standalone --update-env
pm2 save
```

## Secrets Policy

- Do not store real passwords, API keys, OAuth secrets, SMTP passwords, or database root credentials in this file or in Git.
- Keep production secrets only in `/var/www/skypro.skywaveads.com/.env` or the hosting control panel.
- If a secret is ever committed to Git history, rotate it from the provider dashboard even after removing it from the file.

## Admin Credentials (Template)

- **Email:** `<ADMIN_EMAIL>`
- **Password:** `<ADMIN_PASSWORD>`

## Test User Credentials (Template)

- **Email:** `<TEST_USER_EMAIL>`
- **Password:** `<TEST_USER_PASSWORD>`

## SMTP Configuration (for sending emails)

> ⚠️ **Note:** Update these in `/var/www/skypro.skywaveads.com/.env`

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=admin@skywaveads.com
SMTP_PASS=<configured-in-production-env>
SMTP_FROM=admin@skywaveads.com
SMTP_FROM_NAME=SkyPro
```

SMTP is currently configured in `/var/www/skypro.skywaveads.com/.env` and verified on 2026-05-02 with sender `admin@skywaveads.com`.

## NEXTAUTH Configuration

```env
NEXTAUTH_SECRET=<ROTATED_NEXTAUTH_SECRET>
NEXTAUTH_URL=https://your-domain.example
```

## Useful Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart all

# Check Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# Test database connection (on server)
mysql -h localhost -u <DB_USER> -p'<DB_PASSWORD>' skypro -e "SELECT COUNT(*) FROM users;"

# Delete all users (use with caution!)
node /var/www/skypro.skywaveads.com/prisma/delete-all-users.cjs
```
