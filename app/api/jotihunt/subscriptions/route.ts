import { NextRequest, NextResponse } from 'next/server';

function buildUpstreamUrl(search: URLSearchParams): string {
  const archive = search.get('archive');
  const ts = search.get('ts') || '20231005142154';
  if (archive === '1' || archive === 'true') {
    return `https://web.archive.org/web/${encodeURIComponent(
      ts
    )}/https://jotihunt.nl/api/2.0/subscriptions`;
  }
  return 'https://jotihunt.nl/api/2.0/subscriptions';
}

export async function GET(req: NextRequest) {
  const upstream = buildUpstreamUrl(req.nextUrl.searchParams);
  try {
    const res = await fetch(upstream, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error ${res.status}` },
        { status: 502 }
      );
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed, { status: 200 });
      } catch {
        return NextResponse.json(
          { error: 'Invalid upstream response' },
          { status: 502 }
        );
      }
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Fetch failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
