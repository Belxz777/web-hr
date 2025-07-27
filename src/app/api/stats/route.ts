
import { NextResponse } from 'next/server';
import { host } from '@/types';

export async function GET() {
  try {

    const response = await fetch(`${host}app/statistics`, {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        
    }
         );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch ' ,status:response.status });
    }
    const data = await response.json();

return NextResponse.json(data);
  } catch (error) {
    console.error(' error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
