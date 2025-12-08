# Admin Delete Protection Setup

To prevent unauthorized deletion of squad wins, the delete functionality is protected with an admin token.

## Setup

### 1. Create an Admin Token

Add this to your `.env.local` file (for local development):

```env
ADMIN_DELETE_TOKEN=your-secret-password-here
```

**Important:** Choose a strong password that only you know!

### 2. Add to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `ADMIN_DELETE_TOKEN`
   - **Value**: Your secret password
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

### 3. How It Works

- **Without `ADMIN_DELETE_TOKEN` set**: Anyone can delete (useful for development)
- **With `ADMIN_DELETE_TOKEN` set**: Only users who enter the correct password can delete

When someone tries to delete a squad win:
1. They'll be prompted to enter a password
2. If the password matches `ADMIN_DELETE_TOKEN`, deletion proceeds
3. If incorrect, they get an "Unauthorized" error

## Security Notes

- The token is checked server-side, so it can't be bypassed
- The password prompt is client-side, but the actual check happens on the server
- For production, always set `ADMIN_DELETE_TOKEN` in Vercel environment variables
- Never commit the token to git (it's in `.env.local` which should be gitignored)

