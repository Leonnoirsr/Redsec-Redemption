import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string; username: string }> }
) {
  const { platform, username } = await params;
  const apiKey = process.env.TRACKER_GG_API_KEY;
  
  if (!apiKey) {
    console.error('TRACKER_GG_API_KEY is not set');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }
  
  const encodedUsername = encodeURIComponent(username);
  const apiUrl = `https://api.tracker.gg/api/v2/bf6/standard/profile/${platform}/${encodedUsername}`;

  console.log('Fetching from Tracker.gg:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'TRN-Api-Key': apiKey,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://tracker.gg',
        'Referer': 'https://tracker.gg/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
      },
      cache: 'no-store',
    });

    console.log('Tracker.gg response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Tracker.gg API Error (${response.status}):`, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}` };
      }
      
      return NextResponse.json(
        { 
          error: errorData.message || `Failed to fetch stats: ${response.statusText}`,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully fetched data for:', username);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stats from Tracker.gg:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching stats' },
      { status: 500 }
    );
  }
}

