# PhysioHub Deployment Guide

This repository contains three main applications:

- **Physio-Backend**: NestJS API server
- **Physio-frontend**: Next.js frontend application
- **physio-admin**: Vite React admin dashboard

## Vercel Deployment (Frontend)

To deploy the frontend to Vercel:

1. **Import from GitHub**: In Vercel dashboard, import the repository
2. **Root Directory**: Set the root directory to `Physio-frontend`
3. **Build Command**: `npm run build`
4. **Install Command**: `npm install`
5. **Output Directory**: `.next`

### Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_API_BASE_URL=your_backend_api_url
```

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