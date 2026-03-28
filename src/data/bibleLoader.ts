import { BIBLE_BOOKS_META } from './bibleMeta';

export interface VerseData {
  verse: number;
  text: string;
}

export interface ChapterData {
  chapter: number;
  verses: VerseData[];
}

// 完整圣经数据（懒加载，首次使用时从 public/cuv.json 获取）
let fullBibleData: Record<string, Record<string, VerseData[]>> | null = null;
let loadingPromise: Promise<void> | null = null;

async function ensureBibleLoaded(): Promise<void> {
  if (fullBibleData) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const response = await fetch('/cuv.json');
      if (!response.ok) throw new Error('Failed to fetch cuv.json');
      fullBibleData = await response.json();
    } catch (e) {
      console.error('圣经数据加载失败:', e);
      fullBibleData = {};
    }
  })();

  return loadingPromise;
}

// 内存缓存
const chapterCache = new Map<string, VerseData[]>();

function getCacheKey(bookId: string, chapter: number): string {
  return `${bookId}_${chapter}`;
}

// 获取章节数据
export async function getChapterData(bookId: string, chapterNum: number): Promise<VerseData[]> {
  const key = getCacheKey(bookId, chapterNum);

  // 检查内存缓存
  if (chapterCache.has(key)) {
    return chapterCache.get(key)!;
  }

  // 加载完整数据
  await ensureBibleLoaded();

  const bookData = fullBibleData?.[bookId];
  if (bookData) {
    const verses = bookData[String(chapterNum)];
    if (verses && verses.length > 0) {
      chapterCache.set(key, verses);
      return verses;
    }
  }

  // 降级：生成占位提示
  const book = BIBLE_BOOKS_META.find(b => b.id === bookId);
  const placeholder: VerseData[] = [
    { verse: 1, text: `${book?.name || bookId} 第${chapterNum}章数据暂时无法加载。` },
  ];
  return placeholder;
}

// 全文搜索（在已加载数据中搜索）
export interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export async function searchVerses(query: string, limit = 100): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  await ensureBibleLoaded();

  const results: SearchResult[] = [];
  const q = query.trim();

  if (!fullBibleData) return results;

  for (const [bookId, chapters] of Object.entries(fullBibleData)) {
    const book = BIBLE_BOOKS_META.find(b => b.id === bookId);
    if (!book) continue;

    for (const [chapterStr, verses] of Object.entries(chapters)) {
      for (const verse of verses) {
        if (verse.text.includes(q)) {
          results.push({
            bookId,
            bookName: book.name,
            chapter: parseInt(chapterStr),
            verse: verse.verse,
            text: verse.text,
          });
          if (results.length >= limit) return results;
        }
      }
    }
  }

  return results;
}
