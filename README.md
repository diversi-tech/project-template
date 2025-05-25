# 🚀 Project template - Production Deployment Guide

A full-stack TypeScript monorepo with Express backend, React frontend, and Supabase database.

## 🚀 Quick Start

**Required tools:**
- Node.js 22+ 
- npm
- Git

```bash
# Clone the repository
git clone <your-repo-url>
cd base-project

# Install all dependencies
npm run install:all

# Build shared types package
cd packages/shared && npm run build && cd ../..

# Set up environment files
cd packages/backend && cp .env.example .env
cd ../frontend && cp .env.example .env && cd ../..

# Start both frontend and backend
npm run dev
```

**That's it!** 🎉
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [🔧 Prerequisites](#-prerequisites)
- [🗄️ Database Setup (Supabase)](#️-database-setup-supabase)
- [🖥️ Backend Deployment (Render)](#️-backend-deployment-render)
- [🌐 Frontend Deployment (Netlify)](#-frontend-deployment-netlify)
- [🔗 Final Configuration](#-final-configuration)
- [✅ Testing Your Production Setup](#-testing-your-production-setup)
- [🛠️ Troubleshooting](#️-troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Netlify)      │───▶│   (Render)      │───▶│   (Supabase)    │
│   React + TS    │    │   Express + TS  │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Live URLs after deployment:**
- Frontend: `https://your-app.netlify.app`
- Backend API: `https://your-backend.onrender.com/api`
- Database: Managed by Supabase

---

## 🔧 Prerequisites

Before starting, ensure you have accounts on:

- [GitHub](https://github.com) (for code repository)
- [Supabase](https://supabase.com) (database)
- [Render](https://render.com) (backend hosting)
- [Netlify](https://netlify.com) (frontend hosting)

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. **Sign up/Login** to [Supabase](https://supabase.com)
2. **Create New Project**
   - Project name: `project-template-db` (or your choice)
   - Database password: Generate and **save securely**
   - Region: Choose closest to your users
   - Click "Create new project"

3. **Wait for setup** (1-2 minutes)

### Step 2: Set Up Database Schema

1. Go to **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- Create the items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations on items" ON items
    FOR ALL 
    TO public
    USING (true)
    WITH CHECK (true);
```

4. Click **"RUN"** to execute

### Step 3: Get Your Credentials

1. Go to **Settings → API**
2. **Copy and save these values:**
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (for production)

> ⚠️ **Keep these credentials secure!** Never commit them to git.

---

## 🖥️ Backend Deployment (Render)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy to Render

1. **Sign up/Login** to [Render](https://render.com)
2. **Connect GitHub** account if not already connected
3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select your `project-template` repository

4. **Configure the service:**
   - **Name**: `project-template-backend`
   - **Region**: Oregon (or closest to your users)
   - **Branch**: `main`
   - **Root Directory**: `packages/backend`
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     cd ../shared && npm install && npm run build && cd ../backend && npm ci --include=dev && npm run build
     ```
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Set Environment Variables

In the Render dashboard, go to **Environment** tab and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `CORS_ORIGIN` | `https://your-frontend-url.netlify.app` | Update after frontend deployment |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | From Supabase dashboard |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` | From Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1...` | From Supabase dashboard (optional) |

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. **Test your backend**: Visit `https://your-backend.onrender.com/api/health`

> 📝 **Save your backend URL** - you'll need it for frontend configuration!

---

## 🌐 Frontend Deployment (Netlify)

### Step 1: Deploy to Netlify

1. **Sign up/Login** to [Netlify](https://netlify.com)
2. **Import Project**
   - Click "Add New..." → "Project"
   - Import from GitHub
   - Select your `project-template` repository

3. **Configure the project:**
   - **Project Name**: `project-template-frontend`
   - **Framework Preset**: Create React App
   - **Base Directory**: `packages/frontend`
   - **Build Command**: 
     ```bash
     cd ../shared && npm install && npm run build && cd ../frontend && npm install && npm run build
     ```
   - **Publish Directory**: `packages/frontend/build`

### Step 2: Set Environment Variables

In Netlify dashboard, go to **Settings** → **Environment Variables**:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com/api` | Production |
| `REACT_APP_ENV` | `production` | Production |

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. **Test your frontend**: Visit your Netlify URL

---

## 🔗 Final Configuration

### Update CORS Settings

1. **Go back to Render** (backend)
2. **Update Environment Variables**:
   - Set `CORS_ORIGIN` to your actual Netlify URL: `https://your-app.netlify.app`
3. **Redeploy** the backend service

### Enable Auto-Deploy (Optional)

**For Render:**
1. Go to **Settings** → **Build & Deploy**
2. Enable **Auto-Deploy**: `Yes`

**For Netlify:**
- Auto-deploy is enabled by default

---

## ✅ Testing Your Production Setup

### 1. Health Check
Visit: `https://your-backend.onrender.com/api/health`

**Expected response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-05-25T...",
    "uptime": 123.45,
    "environment": "production"
  }
}
```

### 3. Frontend Application
Visit: `https://your-app.netlify.app`

**Should show:**
- ✅ Items list loads successfully
- ✅ Backend status shows "healthy"
- ✅ Clicking items shows details
- ✅ No CORS errors in browser console

### 4. Database Verification
1. Go to **Supabase Dashboard** → **Table Editor**
2. Check **items** table has data
3. Verify new items appear when backend initializes

---

## 🎉 Success!

Your full-stack application is now running in production with:

- ✅ **Frontend** on Netlify with global CDN
- ✅ **Backend** on Render with auto-scaling
- ✅ **Database** on Supabase with backups
- ✅ **HTTPS** enabled everywhere
- ✅ **Auto-deployment** from GitHub

*Happy coding! 🚀*