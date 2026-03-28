import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BibleVersion } from '@/data/bibleLoader';

export interface Bookmark {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: number;
}

export interface Highlight {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
}

interface BibleStore {
  // 当前位置
  currentBookId: string;
  currentChapter: number;
  setLocation: (bookId: string, chapter: number) => void;

  // 译本
  currentVersion: BibleVersion;
  setVersion: (v: BibleVersion) => void;
  compareMode: boolean;
  setCompareMode: (on: boolean) => void;

  // 主题
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // 字号
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  setFontSize: (size: 'sm' | 'base' | 'lg' | 'xl') => void;

  // 收藏
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (bookId: string, chapter: number, verse: number) => boolean;

  // 高亮
  highlights: Highlight[];
  toggleHighlight: (highlight: Omit<Highlight, 'id'>) => void;
  isHighlighted: (bookId: string, chapter: number, verse: number) => boolean;

  // 阅读历史
  history: Array<{ bookId: string; chapter: number; visitedAt: number }>;
  addToHistory: (bookId: string, chapter: number) => void;
}

export const useBibleStore = create<BibleStore>()(
  persist(
    (set, get) => ({
      currentBookId: 'GEN',
      currentChapter: 1,
      setLocation: (bookId, chapter) => {
        set({ currentBookId: bookId, currentChapter: chapter });
        get().addToHistory(bookId, chapter);
      },

      currentVersion: 'cunps',
      setVersion: (v) => set({ currentVersion: v }),
      compareMode: false,
      setCompareMode: (on) => set({ compareMode: on }),

      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      fontSize: 'base',
      setFontSize: (fontSize) => set({ fontSize }),

      bookmarks: [],
      addBookmark: (bookmark) => {
        const id = `${bookmark.bookId}_${bookmark.chapter}_${bookmark.verse}_${Date.now()}`;
        set((state) => ({
          bookmarks: [...state.bookmarks, { ...bookmark, id, createdAt: Date.now() }],
        }));
      },
      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
      },
      isBookmarked: (bookId, chapter, verse) => {
        return get().bookmarks.some(
          (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
        );
      },

      highlights: [],
      toggleHighlight: (highlight) => {
        const existing = get().highlights.find(
          (h) => h.bookId === highlight.bookId && h.chapter === highlight.chapter && h.verse === highlight.verse
        );
        if (existing) {
          set((state) => ({
            highlights: state.highlights.filter((h) => h.id !== existing.id),
          }));
        } else {
          const id = `${highlight.bookId}_${highlight.chapter}_${highlight.verse}`;
          set((state) => ({
            highlights: [...state.highlights, { ...highlight, id }],
          }));
        }
      },
      isHighlighted: (bookId, chapter, verse) => {
        return get().highlights.some(
          (h) => h.bookId === bookId && h.chapter === chapter && h.verse === verse
        );
      },

      history: [],
      addToHistory: (bookId, chapter) => {
        set((state) => {
          const filtered = state.history.filter(
            (h) => !(h.bookId === bookId && h.chapter === chapter)
          );
          return {
            history: [{ bookId, chapter, visitedAt: Date.now() }, ...filtered].slice(0, 20),
          };
        });
      },
    }),
    {
      name: 'bible-store',
    }
  )
);

export function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
}
