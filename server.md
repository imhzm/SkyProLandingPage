# Server Configuration - SkyPro Web

## Hosting Information

- **Hosting Provider:** Hostinger
- **Server IP:** `147.79.66.116`
- **SSH User:** `root`
- **SSH Command:** `ssh root@147.79.66.116`

## Database Credentials

- **Host:** `147.79.66.116`
- **Port:** `3306`
- **Database:** `skypro`
- **User:** `root`
- **Password:** `Newjoker2k333`
- **Connection String:** `mysql://root:Newjoker2k333@147.79.66.116:3306/skypro`

## GitHub Repository

- **Repo URL:** `https://github.com/imhzm/SkyProLandingPage.git`
- **Branch:** `main`
- **Local Path:** `C:\Users\skywa\OneDrive\Desktop\SkyPro\skypro-web`
- **Server Path:** `/var/www/skypro.skywaveads.com`

## Pull Updates from GitHub to Server

```bash
# SSH into server
ssh root@147.79.66.116

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
ssh root@147.79.66.116 "cd /var/www/skypro.skywaveads.com && git pull origin main && npm run build && PORT=3200 HOSTNAME=0.0.0.0 pm2 restart skypro-web --update-env"
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
PORT=3200 HOSTNAME=0.0.0.0 pm2 start /var/www/skypro.skywaveads.com/.next/standalone/server.js --name skypro-web --cwd /var/www/skypro.skywaveads.com/.next/standalone --update-env
pm2 save
```

## Admin Credentials

- **Email:** `admin@skywaveads.com`
- **Password:** `Admin@2026`

## Test User Credentials

- **Email:** `test@skywaveads.com`
- **Password:** `Test@2026`

## SMTP Configuration (for sending emails)

> ⚠️ **Note:** Update these in `/var/www/skypro.skywaveads.com/.env`

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=admin@skywaveads.com
SMTP_PASS=<configured-in-production-env>
```

SMTP is currently configured in `/var/www/skypro.skywaveads.com/.env` and verified on 2026-05-02 with sender `admin@skywaveads.com`.

## NEXTAUTH Configuration

```env
NEXTAUTH_SECRET=1DyqSKlYQPk+Q6ctl7hwMPIebvYzbY7P7lCXfI1/j7Y=
NEXTAUTH_URL=https://skypro.skywaveads.com
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
mysql -h localhost -u root -p'Newjoker2k333' skypro -e "SELECT COUNT(*) FROM users;"

# Delete all users (use with caution!)
node /var/www/skypro.skywaveads.com/prisma/delete-all-users.cjs
```
