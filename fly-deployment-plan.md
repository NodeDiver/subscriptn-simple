# Fly.io Deployment Plan

Fly.io no longer offers a traditional free tier for new accounts as of 2025. However, since you already have an account, you may have legacy free tier access. For new accounts, Fly.io offers a $5 trial credit.

Given this information, let me create a comprehensive deployment plan:

---

## 📋 Overview

Deploy Bitinfrashop (Next.js + PostgreSQL) to Fly.io using their containerized infrastructure. This plan covers both the application and database setup.

---

## 💰 Fly.io Pricing & Limits (2025)

### Current Pricing Model

- No traditional free tier for new accounts
- $5 trial credit for new users (one-time)
- Pay-as-you-go pricing after trial
- Legacy accounts may retain old free tier (3 shared-cpu-1x VMs with 256MB RAM)

### Estimated Monthly Costs (Low Usage)

- App VM: shared-cpu-1x (256MB RAM) = ~$2-3/month for light usage
- PostgreSQL VM: shared-cpu-1x (256MB RAM) = ~$2-3/month
- Storage: 3GB = ~$0.45/month ($0.15/GB)
- Bandwidth: First 100GB outbound included, then $0.02/GB
- **Total: ~$5-7/month for low-traffic operation**

### Why Fly.io is OK to Use

✅ **Advantages:**
1. Familiar platform - You already have an account and experience
2. Native Docker support - Your existing Dockerfile works as-is
3. Integrated PostgreSQL - Managed database with backups
4. Global edge deployment - Fast worldwide performance
5. Auto-scaling - Pay only for what you use
6. No time limits - Run indefinitely as long as you pay
7. Generous bandwidth - 100GB free outbound data transfer
8. Developer-friendly - Excellent CLI and documentation

✅ **Good fit for Bitinfrashop because:**
- Bitcoin subscription platform = low traffic initially
- Lightning payments are event-driven (not constant load)
- Small database (~10-50MB initially)
- Estimated usage well within low-cost tier
- Can scale up when needed

---

## 🚀 Deployment Steps

### Prerequisites

```bash
# 1. Install Fly CLI (if not already installed)
curl -L https://fly.io/install.sh | sh

# 2. Login to your Fly account
fly auth login

# 3. Navigate to project directory
cd /home/motoko/dev/subscriptn-simple
```

---

### Step 1: Create PostgreSQL Database

```bash
# Create a new Postgres cluster
fly postgres create \
  --name bitinfrashop-db \
  --region sjc \
  --initial-cluster-size 1 \
  --vm-size shared-cpu-1x \
  --volume-size 3
```

**Expected output will include:**
- Database name
- Connection string
- Internal URL

**What this does:**
- Creates a PostgreSQL 15 instance
- Single instance (no HA replica for cost savings)
- 256MB RAM, 3GB storage
- Region: San Jose (sjc) - change to nearest region

---

### Step 2: Initialize Fly App

```bash
# Create fly.toml configuration
fly launch --no-deploy
```

**During launch wizard:**
- App name: `bitinfrashop-app` (or your choice)
- Region: Same as database (sjc)
- Would you like to set up a Postgresql database? **NO** (we already created one)
- Would you like to set up an Upstash Redis database? **NO**
- Would you like to deploy now? **NO**

This creates `fly.toml` configuration file.

---

### Step 3: Attach Database to App

```bash
# Attach the database to your app
fly postgres attach bitinfrashop-db --app bitinfrashop-app

# This automatically sets DATABASE_URL secret
```

**What this does:**
- Creates connection between app and database
- Automatically injects `DATABASE_URL` environment variable
- Sets up private networking

---

### Step 4: Configure Environment Variables

```bash
# Set required secrets
fly secrets set \
  SESSION_SECRET="$(openssl rand -hex 32)" \
  NWC_ENCRYPTION_KEY="$(openssl rand -hex 16)" \
  NODE_ENV="production" \
  --app bitinfrashop-app

# Verify secrets are set
fly secrets list --app bitinfrashop-app
```

**Required environment variables:**
- `DATABASE_URL` - Auto-set by Fly when attaching database
- `SESSION_SECRET` - For NextAuth session encryption
- `NWC_ENCRYPTION_KEY` - For NWC connection string encryption
- `NODE_ENV` - Production mode

---

### Step 5: Create/Update fly.toml

Create or update `fly.toml` in your project root:

```toml
app = "bitinfrashop-app"
primary_region = "sjc"

[build]

[env]
  PORT = "3000"
  NODE_ENV = "production"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  memory = '256mb'
  cpu_kind = 'shared'
  cpus = 1
```

**Configuration notes:**
- `auto_stop_machines` - Stops when inactive (saves money)
- `auto_start_machines` - Starts on request
- `min_machines_running = 0` - Can scale to zero (no traffic = no charge)
- `memory = 256mb` - Minimal for low cost

---

### Step 6: Update next.config.ts

Add standalone output for Docker optimization:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
```

---

### Step 7: Deploy to Fly.io

```bash
# Deploy the application
fly deploy --app bitinfrashop-app

# Monitor deployment logs
fly logs --app bitinfrashop-app

# Check status
fly status --app bitinfrashop-app
```

**Deployment process:**
1. Builds Docker image using your Dockerfile
2. Uploads to Fly registry
3. Creates VM and starts container
4. Runs Prisma migrations (`npx prisma db push`)
5. Starts Next.js server

---

### Step 8: Verify Deployment

```bash
# Open app in browser
fly open --app bitinfrashop-app

# Check app info
fly info --app bitinfrashop-app

# View current machines
fly machine list --app bitinfrashop-app

# Check database status
fly postgres db list --app bitinfrashop-db
```

---

## 🔧 Post-Deployment Configuration

### Database Management

```bash
# Connect to PostgreSQL
fly postgres connect --app bitinfrashop-db

# Run SQL commands
\dt  # List tables
\q   # Quit

# Run database migrations manually if needed
fly ssh console --app bitinfrashop-app
npx prisma migrate deploy
exit
```

### Monitor Application

```bash
# Real-time logs
fly logs --app bitinfrashop-app

# Check metrics
fly dashboard --app bitinfrashop-app

# SSH into container
fly ssh console --app bitinfrashop-app
```

### Database Backups

```bash
# Fly automatically backs up PostgreSQL databases

# List backups
fly postgres backup list --app bitinfrashop-db

# Restore from backup (if needed)
fly postgres backup restore <backup-id> --app bitinfrashop-db
```

---

## 🔐 Security Considerations

✅ **Already configured:**
- Dockerfile runs as non-root user (`nextjs:nodejs`)
- Secrets managed via Fly Secrets (encrypted)
- HTTPS forced in `fly.toml`
- Private networking between app and database
- PostgreSQL not exposed publicly

⚠️ **Additional recommendations:**
- Set up custom domain with Fly
- Enable Fly's Web Application Firewall (WAF) if available
- Monitor access logs regularly
- Rotate secrets periodically

---

## 📊 Cost Optimization Tips

1. **Scale to zero** - Already configured with `min_machines_running = 0`
2. **Single database instance** - No replica for dev/testing
3. **Minimal VM size** - shared-cpu-1x with 256MB RAM
4. **Monitor usage** - Use fly dashboard to track spending
5. **Set spending limits** - Configure in Fly dashboard

---

## 🐛 Troubleshooting

### App won't start

```bash
fly logs --app bitinfrashop-app
```

**Check for:**
- Database connection errors
- Missing environment variables
- Prisma migration failures

### Database connection issues

```bash
# Verify attachment
fly postgres db list --app bitinfrashop-db

# Check DATABASE_URL is set
fly secrets list --app bitinfrashop-app
```

### Build failures

```bash
# Check Dockerfile syntax
docker build -t test .

# Verify next.config.ts has output: 'standalone'
```

---

## 📈 Scaling Strategy

**When traffic increases:**

1. **Increase VM size:**
   ```bash
   fly scale vm shared-cpu-2x --memory 512 --app bitinfrashop-app
   ```

2. **Add more instances:**
   ```bash
   fly scale count 2 --app bitinfrashop-app
   ```

3. **Upgrade database:**
   ```bash
   fly volumes extend <volume-id> --size 10 --app bitinfrashop-db
   ```

---

## 🎯 Why This Plan Works

✅ **For Bitinfrashop specifically:**
- Low initial traffic expected
- Bitcoin/Lightning payments are sporadic events
- Small database size (user accounts, shops, servers)
- Auto-scaling matches usage pattern
- Can grow with platform success

✅ **Cost-effective:**
- Estimated $5-7/month for low usage
- Auto-stop saves money during inactivity
- No separate database service fees
- Pay only for what you use

✅ **Production-ready:**
- Automated deployments
- Built-in backups
- HTTPS by default
- Global CDN
- Health checks

---

## 📝 Summary

This plan deploys Bitinfrashop to Fly.io with:
- **App:** Next.js on shared-cpu-1x VM (256MB)
- **Database:** PostgreSQL on shared-cpu-1x VM (3GB storage)
- **Cost:** ~$5-7/month for low traffic
- **Features:** Auto-scaling, backups, HTTPS, monitoring

**Estimated deployment time:** 15-20 minutes
