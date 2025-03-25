
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { host } from '@/types';

export async function GET() {
  try {

    const response = await fetch(`${host}statistics`, {
        credentials: 'include',
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
