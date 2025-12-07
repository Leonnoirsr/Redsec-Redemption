import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string; username: string }> }
) {
  const { platform, username } = await params;
  
  // Map platform names: gametools uses 'ps5', 'xboxone', 'pc' etc.
  const platformMap: Record<string, string> = {
    'psn': 'ps5', // PlayStation Network -> PS5
    'xbl': 'xboxone', // Xbox Live -> Xbox One
    'origin': 'pc', // Origin -> PC
    'pc': 'pc',
  };
  
  const mappedPlatform = platformMap[platform.toLowerCase()] || platform;
  const encodedUsername = encodeURIComponent(username);
  
  // Gametools.network API endpoint - no API key required!
  const apiUrl = `https://api.gametools.network/bf6/stats/?name=${encodedUsername}&platform=${mappedPlatform}`;

  console.log('Fetching from GameTools:', {
    url: apiUrl,
    originalPlatform: platform,
    mappedPlatform: mappedPlatform,
  });

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}` };
      }
      
      console.error(`GameTools API Error (${response.status}):`, errorData);
      
      return NextResponse.json(
        { 
          error: errorData.message || errorData.errors?.[0] || `Failed to fetch stats: ${response.statusText}`,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Check if gametools returned an error in the response body
    if (data.errors && data.errors.length > 0) {
      return NextResponse.json(
        { error: data.errors[0] || 'Player not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stats from GameTools:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching stats' },
      { status: 500 }
    );
  }
}

