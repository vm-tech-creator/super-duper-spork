import { getBooks, getBookContent } from '@/lib/books';
import BookDetailClient from './BookDetailClient';

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((book) => ({ id: String(book.id) }));
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const books = await getBooks();
  const book = books.find(b => b.id === parseInt(id));
  
  let content = '';
  if (book) {
    content = await getBookContent(book);
  }

  // Pass preloaded book metadata and full book list to the client to avoid relying
  // on runtime API routes which are not available for static export.
  return (
    <BookDetailClient
      bookId={id}
      initialContent={content}
      initialBook={book ?? null}
      initialBooks={books}
    />
  );
}
