import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/app/lib/redis';

interface SquadWin {
  id: string;
  players: string[];
  date: string;
  createdAt: string;
}

const SQUAD_WINS_KEY = 'squad-wins';

export async function GET() {
  try {
    const redis = await getRedisClient();
    const data = await redis.get(SQUAD_WINS_KEY);
    const squadWins: SquadWin[] = data ? JSON.parse(data as string) : [];
    return NextResponse.json(squadWins);
  } catch (error) {
    console.error('Error reading squad wins:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { players } = body;

    if (!players || !Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        { error: 'Players array is required' },
        { status: 400 }
      );
    }

    const redis = await getRedisClient();
    
    // Read existing wins
    const data = await redis.get(SQUAD_WINS_KEY);
    const squadWins: SquadWin[] = data ? JSON.parse(data as string) : [];

    // Create new squad win
    const newWin: SquadWin = {
      id: Date.now().toString(),
      players: players.map((p: string) => p.trim()).filter((p: string) => p.length > 0),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      createdAt: new Date().toISOString(),
    };

    squadWins.push(newWin);

    // Save back to Redis
    await redis.set(SQUAD_WINS_KEY, JSON.stringify(squadWins));

    return NextResponse.json(newWin, { status: 201 });
  } catch (error) {
    console.error('Error saving squad win:', error);
    return NextResponse.json(
      { error: 'Failed to save squad win' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const adminToken = searchParams.get('token');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Check admin token if it's set
    const requiredToken = process.env.ADMIN_DELETE_TOKEN;
    if (requiredToken) {
      if (!adminToken || adminToken !== requiredToken) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin token required' },
          { status: 401 }
        );
      }
    }

    const redis = await getRedisClient();
    
    const data = await redis.get(SQUAD_WINS_KEY);
    const squadWins: SquadWin[] = data ? JSON.parse(data as string) : [];
    const filtered = squadWins.filter(win => win.id !== id);
    
    await redis.set(SQUAD_WINS_KEY, JSON.stringify(filtered));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting squad win:', error);
    return NextResponse.json(
      { error: 'Failed to delete squad win' },
      { status: 500 }
    );
  }
}
