// Using GameTools.network API instead of Tracker.gg (no API key required!)
export async function fetchTrackerStats(platform: string, username: string): Promise<any> {
  // Map platform names: gametools uses 'ps5', 'xboxone', 'pc' etc.
  const platformMap: Record<string, string> = {
    'psn': 'ps5',
    'xbl': 'xboxone',
    'origin': 'pc',
    'pc': 'pc',
  };
  
  const mappedPlatform = platformMap[platform.toLowerCase()] || platform;
  const encodedUsername = encodeURIComponent(username);
  
  // Gametools.network API - no API key needed!
  const apiUrl = `https://api.gametools.network/bf6/stats/?name=${encodedUsername}&platform=${mappedPlatform}`;

  console.log('Fetching from GameTools:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      const text = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text || `HTTP ${response.status}` };
      }
      console.error(`GameTools API Error (${response.status}):`, errorData);
      return null;
    }

    const data = await response.json();
    
    // Check if gametools returned an error in the response body
    if (data.errors && data.errors.length > 0) {
      console.error('GameTools API Error:', data.errors[0]);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching stats from GameTools:', error);
    return null;
  }
}

