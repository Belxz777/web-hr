
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { host } from '@/types';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('cf-auth-id')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${host}download/department/xlsx/`, {
        credentials: 'include',
        headers: {
            Cookie: `jwt=${token}`, 
        }
    }
         );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' ,statis:response.status,cookiesend:token}, { status: response.status });
    }
const date = new Date()
    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; ',
        'filename': `department-report-${date.toISOString().split('T')[0]}.xlsx`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
