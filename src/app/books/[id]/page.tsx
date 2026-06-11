import { getBooks } from '@/lib/books';
import BookDetailClient from './BookDetailClient';

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((book) => ({ id: String(book.id) }));
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetailClient bookId={id} />;
}
