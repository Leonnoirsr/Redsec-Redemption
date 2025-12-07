# Mock Data System

This project includes a mock data system to work around Tracker.gg API restrictions while waiting for production approval.

## How It Works

The app can toggle between two data sources:
1. **Live API**: Fetches data directly from Tracker.gg (works locally with cookies)
2. **Mock Data**: Uses pre-fetched data stored in `app/data/mock-stats.json`

## Initial Setup

### Step 1: Fetch Real Data Locally

**Option A: Next.js Page (Recommended)**

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/fetch-mock-data`
3. Make sure you're logged into tracker.gg (or have visited it recently in this browser)
4. Click "Fetch All Stats" button
5. Wait for all stats to be fetched (you'll see progress)
6. Click "Download mock-stats.json" button
7. Save the downloaded file to `app/data/mock-stats.json` (replace the existing file)

**Option B: Standalone HTML File**

1. Open `scripts/fetch-mock-data.html` in your browser (double-click it)
2. Make sure you're logged into tracker.gg (or have visited it recently)
3. Click "Fetch All Stats" button
4. Wait for all stats to be fetched
5. Click "Download mock-stats.json" button
6. Save the file to `app/data/mock-stats.json` (replace the existing file)

**Option B: Command line (if you have browser cookies)**

Run this command **once** on your local machine (while you have tracker.gg cookies):

```bash
npm run fetch-mock-data
```

**Note:** The command-line script may fail with 403 errors if you don't have proper browser cookies. Use Option A instead.

### Step 2: Enable Mock Data

Add this to your `.env.local` file:

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Or for production (Vercel), add this environment variable:
- **Key**: `NEXT_PUBLIC_USE_MOCK_DATA`
- **Value**: `true`
- **Environment**: Production (and Preview if needed)

## Switching Between Live and Mock Data

### Use Mock Data (for production)
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Use Live API (for local development)
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
```

Or simply remove the variable entirely.

## Updating Mock Data

If you need to refresh the stats:

1. Navigate to `http://localhost:3000/fetch-mock-data` (or open `scripts/fetch-mock-data.html`)
2. Click "Fetch All Stats"
3. Download the new JSON file
4. Replace `app/data/mock-stats.json` with the downloaded file
5. Commit the updated file

## When API is Approved

Once Tracker.gg approves your API key for production:

1. Remove `NEXT_PUBLIC_USE_MOCK_DATA` from Vercel environment variables
2. (Optional) Delete `app/data/mock-stats.json`
3. (Optional) Delete `scripts/fetch-mock-data.ts`
4. (Optional) Delete `app/lib/stats-fetcher.ts` and revert to direct API calls

## File Structure

```
app/
  data/
    mock-stats.json           # Stores pre-fetched API responses
  lib/
    stats-fetcher.ts          # Utility that toggles between mock/live data
scripts/
  fetch-mock-data.ts          # Script to populate mock data
```

## Troubleshooting

### "Player not found in mock data"
Run `npm run fetch-mock-data` to populate the data.

### "Failed to fetch" errors when using mock data
Make sure `NEXT_PUBLIC_USE_MOCK_DATA=true` is set and `app/data/mock-stats.json` exists.

### Script fails to fetch data
Make sure you've visited tracker.gg in your browser recently (so you have cookies) before running the script.

