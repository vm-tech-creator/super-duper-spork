import fs from 'fs';
import path from 'path';

export interface BookData {
  id: number;
  title: string;
  category: 'preteen' | 'teen' | 'adult';
  fileName: string;
  coverPath: string;
}

const categoryMap: Record<string, 'preteen' | 'teen' | 'adult'> = {
  preteens: 'preteen',
  teens: 'teen',
  adults: 'adult',
};

export async function getBooks(): Promise<BookData[]> {
  const booksDir = path.join(process.cwd(), 'public', 'books');
  const categoryFolders = ['preteens', 'teens', 'adults'];
  const allBooks: BookData[] = [];

  let id = 1;

  for (const folder of categoryFolders) {
    const categoryPath = path.join(booksDir, folder);
    
    if (!fs.existsSync(categoryPath)) {
      console.warn(`Category folder not found: ${categoryPath}`);
      continue;
    }

    const files = fs.readdirSync(categoryPath);
    const mdFiles = files.filter(f => f.endsWith('.md')).sort((a, b) => {
      const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0');
      return numA - numB;
    });

    for (const file of mdFiles) {
      const match = file.match(/^(\d+)_(.+?)\.md$/);
      if (match) {
        const bookNum = match[1];
        const bookTitle = match[2];
        const title = bookTitle.replace(/_/g, ' ');
        const coverPath = `/books/${folder}/${bookNum}_COVER_${bookTitle}.svg`;
        const category = categoryMap[folder] || 'adult';

        allBooks.push({
          id,
          title,
          category,
          fileName: file,
          coverPath,
        });
        id++;
      }
    }
  }

  return allBooks;
}

export async function getBooksByCategory(category: 'preteen' | 'teen' | 'adult'): Promise<BookData[]> {
  const allBooks = await getBooks();
  return allBooks.filter(book => book.category === category);
}

export async function getBookContent(book: BookData): Promise<string> {
  const categoryFolders: Record<string, string> = {
    preteen: 'preteens',
    teen: 'teens',
    adult: 'adults',
  };

  const categoryFolder = categoryFolders[book.category];
  const filePath = path.join(process.cwd(), 'public', 'books', categoryFolder, book.fileName);

  if (!fs.existsSync(filePath)) {
    return 'Content not available for this book.';
  }

  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading book file ${filePath}:`, error);
    return 'Error loading book content.';
  }
}
