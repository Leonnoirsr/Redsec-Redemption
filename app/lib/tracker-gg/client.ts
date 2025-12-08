import { TrackerResponse } from './types';

export async function getPlayerStats(platform: string, username: string): Promise<TrackerResponse | null> {
  try {
    const res = await fetch(`/api/stats/${platform}/${username}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}


