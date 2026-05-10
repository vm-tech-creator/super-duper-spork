import { NextResponse } from 'next/server';
import { getBooks } from '@/lib/books';

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error reading books:', error);
    return NextResponse.json(
      { error: 'Failed to read books' },
      { status: 500 }
    );
  }
}
