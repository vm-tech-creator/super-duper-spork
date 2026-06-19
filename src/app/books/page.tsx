import { getBooks } from '@/lib/books';
import BooksClient from '@/components/BooksClient';

export const dynamic = 'force-static';

export default async function BooksPage() {
  const books = await getBooks();

  return <BooksClient initialBooks={books} />;
}
