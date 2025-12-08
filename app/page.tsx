import Link           from 'next/link';
import { SearchForm } from './components/SearchForm';
import { Users, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">
            REDSEC <span className="text-red-600">REDEMPTION</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Battlefield Redsec Gamechat Stats
          </p>
        </div>

        <SearchForm />

        <div className="pt-8 space-y-4">
          <Link 
            href="/squad-wins" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <Trophy className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            <span>View Squad Wins</span>
          </Link>
          <Link 
            href="/individual-stats" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <Users className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            <span>View Individual Stats</span>
          </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        Data provided by{' '}
        <a 
          href="https://tracker.gg" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors underline"
        >
          Tracker.gg
        </a>
      </footer>
    </main>
  );
}
