import fs from 'fs';
import path from 'path';

// Import friends list
const FRIENDS = [
  { username: 'LeonNoirSR', platform: 'psn' },
  { username: 'SmoothStaySaucin', platform: 'psn' },
  { username: 'Who_Else_But_Dee', platform: 'psn' },
  { username: 'Kjnumba_5', platform: 'psn' },
  { username: 'Blackmayo187', platform: 'psn' },
  { username: 'RJ__2K', platform: 'psn' },
  { username: 'KaioTheRuthless', platform: 'psn' },
  { username: 'Mrboss_statuz', platform: 'psn' },
  { username: 'Xx-LA_FiNE_ST-xX', platform: 'psn' },
];

async function fetchMockData() {
  console.log('🎮 Fetching Battlefield 6 stats for all friends...\n');
  
  const mockData: any = { psn: {} };
  let successCount = 0;
  let failCount = 0;

  for (const friend of FRIENDS) {
    try {
      const encodedUsername = encodeURIComponent(friend.username);
      const apiUrl = `https://api.tracker.gg/api/v2/bf6/standard/profile/${friend.platform}/${encodedUsername}`;
      
      console.log(`Fetching ${friend.username}...`);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
        },
        // @ts-ignore - credentials works in node fetch
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`❌ Failed to fetch ${friend.username}: ${response.status} ${response.statusText}`);
        failCount++;
        continue;
      }

      const data = await response.json();
      
      // Store the full API response
      mockData[friend.platform][friend.username] = data;
      
      console.log(`✅ Successfully fetched ${friend.username}`);
      successCount++;
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error fetching ${friend.username}:`, error);
      failCount++;
    }
  }

  // Write to JSON file
  const dataDir = path.join(process.cwd(), 'app', 'data');
  const filePath = path.join(dataDir, 'mock-stats.json');
  
  // Ensure directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, JSON.stringify(mockData, null, 2));
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Successfully fetched: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`\n💾 Data saved to: ${filePath}`);
}

fetchMockData().catch(console.error);

