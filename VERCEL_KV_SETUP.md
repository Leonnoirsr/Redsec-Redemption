# Vercel KV Setup Guide

This app uses Vercel KV (Redis) to store squad wins data. It's lightweight, has a free tier, and works perfectly with Vercel deployments.

## Setup Steps

### 1. Create a Redis Database from Marketplace

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Scroll down to **Marketplace Database Providers**
6. Find **Redis** (or **Upstash** which provides Redis/KV)
7. Click **Create** on Redis
8. Follow the setup wizard to create your Redis database
9. Vercel will automatically add the required environment variables

### 2. Link to Your Project

After creating the KV database, Vercel will automatically add the required environment variables to your project:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

These are automatically available in your Vercel deployments.

### 3. Local Development Setup

For local development, you need to add these environment variables to your `.env.local` file:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Copy the values for:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
4. Add them to your `.env.local` file:

```env
KV_REST_API_URL=your_url_here
KV_REST_API_TOKEN=your_token_here
KV_REST_API_READ_ONLY_TOKEN=your_read_only_token_here
```

### 4. That's It!

The code is already set up to use Vercel KV. Once you've completed the steps above, your squad wins will be stored in the KV database.

## Free Tier Limits

Vercel KV free tier includes:
- 256 MB storage
- 30,000 commands/day
- Perfect for this hobby project!

## Benefits

- ✅ Lightweight (just Redis)
- ✅ Free tier available
- ✅ Works seamlessly with Vercel
- ✅ No complex setup
- ✅ Fast and reliable
- ✅ Scales if needed

