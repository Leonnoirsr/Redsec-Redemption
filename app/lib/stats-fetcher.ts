import mockStats from '@/app/data/mock-stats.json';

/**
 * Fetches player stats from either mock data or live API
 * Based on NEXT_PUBLIC_USE_MOCK_DATA environment variable
 */
export async function fetchPlayerStats(platform: string, username: string): Promise<any> {
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  
  if (useMockData) {
    // Return mock data
    console.log(`[Mock Data] Fetching ${username} from mock data`);
    
    const platformData = (mockStats as any)[platform];
    if (!platformData) {
      throw new Error(`Platform ${platform} not found in mock data`);
    }
    
    const userData = platformData[username];
    if (!userData) {
      throw new Error(`User ${username} not found in mock data`);
    }
    
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return userData;
  } else {
    // Fetch from live API (client-side with cookies)
    console.log(`[Live API] Fetching ${username} from Tracker.gg`);
    
    const encodedUsername = encodeURIComponent(username);
    const apiUrl = `https://api.tracker.gg/api/v2/bf6/standard/profile/${platform}/${encodedUsername}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}` };
      }
      throw new Error(errorData.message || 'Failed to fetch stats');
    }
    
    return await response.json();
  }
}


