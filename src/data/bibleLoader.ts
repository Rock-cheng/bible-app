import { BIBLE_BOOKS_META } from './bibleMeta';

export interface VerseData {
  verse: number;
  text: string;
}

export interface ChapterData {
  chapter: number;
  verses: VerseData[];
}

// 支持的版本列表
export type BibleVersion = 'cuv' | 'ncv';

export const BIBLE_VERSIONS: Record<BibleVersion, { label: string; shortLabel: string; file: string }> = {
  cuv: { label: '和合本（简体）',  shortLabel: '和合本', file: '/cuv.json' },
  ncv: { label: '新译本（简体）',  shortLabel: '新译本', file: '/ncv.json' },
};

// 各版本数据缓存
const bibleDataCache: Partial<Record<BibleVersion, Record<string, Record<string, VerseData[]>> | null>> = {};
const loadingPromises: Partial<Record<BibleVersion, Promise<void>>> = {};

async function ensureVersionLoaded(version: BibleVersion): Promise<void> {
  if (bibleDataCache[version] !== undefined) return;
  if (loadingPromises[version]) return loadingPromises[version];

  loadingPromises[version] = (async () => {
    try {
      const { file } = BIBLE_VERSIONS[version];
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Failed to fetch ${file}`);
      bibleDataCache[version] = await response.json();
    } catch (e) {
      console.error(`圣经数据加载失败 (${version}):`, e);
      bibleDataCache[version] = null;
    }
  })();

  return loadingPromises[version];
}

// 内存缓存 key: `version_bookId_chapter`
const chapterCache = new Map<string, VerseData[]>();

// 获取章节数据
export async function getChapterData(
  bookId: string,
  chapterNum: number,
  version: BibleVersion = 'cuv'
): Promise<VerseData[]> {
  const key = `${version}_${bookId}_${chapterNum}`;
  if (chapterCache.has(key)) return chapterCache.get(key)!;

  await ensureVersionLoaded(version);

  const data = bibleDataCache[version];
  if (data) {
    const verses = data[bookId]?.[String(chapterNum)];
    if (verses && verses.length > 0) {
      chapterCache.set(key, verses);
      return verses;
    }
  }

  const book = BIBLE_BOOKS_META.find(b => b.id === bookId);
  return [{ verse: 1, text: `${book?.name || bookId} 第${chapterNum}章数据暂时无法加载。` }];
}

// 全文搜索
export interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export async function searchVerses(
  query: string,
  limit = 100,
  version: BibleVersion = 'cuv'
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  await ensureVersionLoaded(version);

  const data = bibleDataCache[version];
  if (!data) return [];

  const results: SearchResult[] = [];
  const q = query.trim();

  for (const [bookId, chapters] of Object.entries(data)) {
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
