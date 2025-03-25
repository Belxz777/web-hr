  import { NextResponse } from 'next/server';
    import { cookies } from 'next/headers';
  import { json } from 'stream/consumers';
import { type } from 'os';
import { host } from '@/types';

    export async function POST(request: any, response: any): Promise<any> {
        const cookieStore = cookies();
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoyLCJleHAiOjE3NDE4Nzg4MzcsImlhdCI6MTc0MTAxNDgzN30.oD83lYn6HU1gqdx76OVcevxaA5YziKbAy0D8Je2CDuM"
        if (!token) {
          return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }
      try {
        const data = await request.json()
      
        const response = await fetch(`${host}download/department/xlsx/persice/`, {
          method: 'POST',
          credentials: 'include',
          body:JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Cookie: `jwt=${token}`,
          }
        });

        if (!response.ok) {
          return NextResponse.json({ error: 'Failed to fetch file', status: response.status,err2or:response.body }, { status: response.status });
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
        return NextResponse.json({ error: 'Internal Server Error',err:error }, { status: 500, });
      }
    }