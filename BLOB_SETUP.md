# Vercel Blob Storage Setup (Alternative)

This is an alternative to using Redis/KV. **Blob storage is designed for files**, but we can use it to store JSON data.

## ⚠️ Recommendation

**Redis from the Marketplace is the better choice** for this use case because:
- It's designed for key-value data
- Faster for frequent reads/writes
- Better suited for structured data

However, if you prefer Blob storage, here's how to set it up:

## Setup Steps

### 1. Create a Blob Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Blob**
6. Choose a name (e.g., "redsec-redemption-blob")
7. Select a region
8. Click **Create**

### 2. Get Environment Variables

After creating the Blob store, Vercel will add:
- `BLOB_READ_WRITE_TOKEN`

This is automatically available in your Vercel deployments.

### 3. Local Development

Add to your `.env.local`:
```env
BLOB_READ_WRITE_TOKEN=your_token_here
```

### 4. Switch to Blob Implementation

1. Rename `app/api/squad-wins/blob-route.ts.example` to `app/api/squad-wins/route.ts`
2. The existing `route.ts` will be overwritten
3. Make sure `@vercel/blob` is installed (already done)

## Why Redis is Better

- **Purpose-built**: Redis is designed for key-value storage
- **Performance**: Faster for frequent reads/writes
- **Simplicity**: Direct key-value operations
- **Cost**: Both have free tiers, but Redis is more efficient

Blob storage works, but it's like using a file system when you need a database.

