'use client';

import React, { useState } from 'react';
import { FRIENDS } from '@/app/constants/friends';

export default function FetchMockDataPage() {
  const [mockData, setMockData] = useState<any>({ psn: {} });
  const [status, setStatus] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  const log = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setStatus(prev => prev + `[${timestamp}] ${message}\n`);
  };

  const fetchAllStats = async () => {
    setIsFetching(true);
    setStatus('');
    setMockData({ psn: {} });
    setShowDownload(false);
    
    log('🎮 Fetching Battlefield 6 stats for all friends...\n', 'info');
    
    let successCount = 0;
    let failCount = 0;
    const newMockData: any = { psn: {} };

    for (const friend of FRIENDS) {
      try {
        const encodedUsername = encodeURIComponent(friend.username);
        const apiUrl = `https://api.tracker.gg/api/v2/bf6/standard/profile/${friend.platform}/${encodedUsername}`;
        
        log(`Fetching ${friend.username}...`, 'info');
        
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          log(`❌ Failed to fetch ${friend.username}: ${response.status} ${response.statusText}`, 'error');
          failCount++;
          continue;
        }

        const data = await response.json();
        newMockData[friend.platform][friend.username] = data;
        
        log(`✅ Successfully fetched ${friend.username}`, 'success');
        successCount++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error: any) {
        log(`❌ Error fetching ${friend.username}: ${error.message}`, 'error');
        failCount++;
      }
    }

    log(`\n📊 Summary:`, 'info');
    log(`✅ Successfully fetched: ${successCount}`, 'success');
    log(`❌ Failed: ${failCount}`, 'error');
    
    setMockData(newMockData);
    
    if (successCount > 0) {
      setShowDownload(true);
      log(`\n💾 Ready to download! Click the download button below.`, 'success');
    } else {
      log(`\n⚠️ No data was fetched. Make sure you're logged into tracker.gg in this browser.`, 'error');
    }
    
    setIsFetching(false);
  };

  const downloadJSON = () => {
    const jsonStr = JSON.stringify(mockData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mock-stats.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    log(`\n📥 File downloaded! Save it to: app/data/mock-stats.json`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🎮 Fetch Battlefield 6 Mock Data</h1>
        <p className="text-gray-400 mb-6">
          This will fetch stats for all your friends and generate a JSON file you can save.
        </p>
        
        <button
          onClick={fetchAllStats}
          disabled={isFetching}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {isFetching ? 'Fetching...' : 'Fetch All Stats'}
        </button>
        
        {status && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg font-mono text-sm whitespace-pre-wrap min-h-[200px] max-h-[500px] overflow-y-auto">
            <div className="text-green-400">{status.split('\n').filter(line => line.includes('✅')).join('\n')}</div>
            <div className="text-red-400">{status.split('\n').filter(line => line.includes('❌')).join('\n')}</div>
            <div className="text-blue-400">{status.split('\n').filter(line => !line.includes('✅') && !line.includes('❌')).join('\n')}</div>
          </div>
        )}
        
        {showDownload && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-green-400">✅ Done! Download the JSON file:</h3>
            <button
              onClick={downloadJSON}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Download mock-stats.json
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              After downloading, save the file to: <code className="bg-gray-700 px-2 py-1 rounded">app/data/mock-stats.json</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


