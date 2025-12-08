import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.TRACKER_GG_API_KEY;
  
  return NextResponse.json({
    apiKeyPresent: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'NOT FOUND',
    // Don't expose the full key
  });
}


