import { NextResponse, type NextRequest } from 'next/server';

interface VerifyFileParams {
  params: Promise<{ file: string }>;
}

export async function GET(_request: NextRequest, { params }: VerifyFileParams) {
  const { file } = await params;
  const match = file.match(/^google([A-Za-z0-9_-]+)\.html$/);
  if (!match) {
    return new NextResponse('Not Found', { status: 404 });
  }
  const token = match[1];
  return new NextResponse(`google-site-verification: google${token}.html`, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}