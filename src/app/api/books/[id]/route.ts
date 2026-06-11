import { NextRequest, NextResponse } from 'next/server';
import { getBooks } from '@/lib/books';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((book) => ({ id: String(book.id) }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    // Get all books
    const allBooks = await getBooks();
    const book = allBooks.find(b => b.id === bookId);

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Construct path to the markdown file
    const categoryFolders: Record<string, string> = {
      preteen: 'preteens',
      teen: 'teens',
      adult: 'adults',
    };

    const categoryFolder = categoryFolders[book.category];
    const filePath = path.join(process.cwd(), 'books', categoryFolder, book.fileName);

    // Check if file exists and read it
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Book content not found', filePath },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    return NextResponse.json({ content, title: book.title, category: book.category });
  } catch (error) {
    console.error('Error reading book content:', error);
    return NextResponse.json(
      { error: 'Failed to read book content' },
      { status: 500 }
    );
  }
}
