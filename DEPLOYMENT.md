# PhysioHub Deployment Guide

This repository contains three main applications:

- **Physio-Backend**: NestJS API server
- **Physio-frontend**: Next.js frontend application
- **physio-admin**: Vite React admin dashboard

## Vercel Deployment (Frontend) - RECOMMENDED METHOD

### Method 1: Deploy Frontend Subdirectory

1. **In Vercel Dashboard**:
   - Click "New Project"
   - Import your GitHub repository: `drsaun2000/newphysiohub`
   - **IMPORTANT**: In "Configure Project" section:
     - Set **Root Directory** to `Physio-frontend`
     - Leave Build Command as default (`npm run build`)
     - Leave Install Command as default (`npm install`)
     - Leave Output Directory as default (`.next`)

2. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api/v1
   ```

3. **Deploy**: Click "Deploy" and it should work!

### Method 2: Alternative - Create Separate Frontend Repo (If Method 1 Fails)

1. Create a new repository for just the frontend
2. Copy contents of `Physio-frontend/` to the new repo
3. Deploy normally on Vercel

### Environment Variables

## Backend Deployment

The NestJS backend can be deployed to:
- Railway
- Heroku
- AWS
- DigitalOcean

Required environment variables (see `.env.example`):
- JWT_SECRET
- MONGO_URI
- NODEMAILER_*
- GOOGLE_CLIENT_*
- SIRV_*

## Admin Panel Deployment

The admin panel can be deployed to:
- Vercel
- Netlify
- AWS S3

Required environment variables:
- VITE_DEV_API_URL

## Local Development

1. Copy `.env.example` to `.env` in each directory
2. Fill in your environment variables
3. Run each service:

```bash
# Backend
cd Physio-Backend
npm install
npm run start:dev

# Frontend
cd Physio-frontend
npm install
npm run dev

# Admin
cd physio-admin
npm install
npm run dev
```