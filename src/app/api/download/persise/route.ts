  import { NextResponse } from 'next/server';
    import { cookies } from 'next/headers';
  import { json } from 'stream/consumers';

    export async function POST(request: any, response: any): Promise<any> {
        const cookieStore = cookies();
        const token = cookieStore.get('cf-auth-id')?.value;
        if (!token) {
          return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }
      try {
        console.log("POST")
        const data = await request.json()
        console.log(data)
        console.log(request.body)
        const response = await fetch('https://backend-pulse.onrender.com/api/v1/download/department/xlsx/persice/', {
          method: 'POST',
          credentials: 'include',
          body:data,
          headers: {
            'Content-Type': 'application/json',
            Cookie: `jwt=${token}`,
          }
        });

        if (!response.ok) {
          return NextResponse.json({ error: 'Failed to fetch file', status: response.status }, { status: response.status });
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