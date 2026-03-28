import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useBibleStore } from '@/store/bibleStore';
import { getChapterData, BIBLE_VERSIONS } from '@/data/bibleLoader';
import type { VerseData, BibleVersion } from '@/data/bibleLoader';
import { BIBLE_BOOKS_META } from '@/data/bibleMeta';
import {
  ChevronLeft, ChevronRight, BookmarkPlus, BookmarkCheck,
  Highlighter, Type, Loader2, Columns2, BookOpen,
} from 'lucide-react';

const FONT_SIZE_MAP = {
  sm: '0.9rem',
  base: '1.0625rem',
  lg: '1.25rem',
  xl: '1.4rem',
};

// ─────────────────────────────────────────────
// 主页面
// ─────────────────────────────────────────────
export const ReadPage: React.FC = () => {
  const {
    currentBookId, currentChapter, setLocation,
    fontSize, setFontSize,
    isBookmarked, addBookmark, removeBookmark,
    isHighlighted, toggleHighlight,
    bookmarks,
    currentVersion, setVersion,
    compareMode, setCompareMode,
  } = useBibleStore();

  const [verses, setVerses]           = useState<VerseData[]>([]);
  const [versesAlt, setVersesAlt]     = useState<VerseData[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [showVersionPanel, setShowVersionPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentBook = BIBLE_BOOKS_META.find(b => b.id === currentBookId);

  // 对照版本（另一本）
  const altVersion: BibleVersion = currentVersion === 'cunps' ? 'cuv' : 'cunps';

  const loadChapter = useCallback(async () => {
    setLoading(true);
    setSelectedVerse(null);
    try {
      const [main, alt] = await Promise.all([
        getChapterData(currentBookId, currentChapter, currentVersion),
        compareMode ? getChapterData(currentBookId, currentChapter, altVersion) : Promise.resolve([]),
      ]);
      setVerses(main);
      setVersesAlt(alt);
    } finally {
      setLoading(false);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentBookId, currentChapter, currentVersion, compareMode, altVersion]);

  useEffect(() => { loadChapter(); }, [loadChapter]);

  const goPrev = () => {
    if (currentChapter > 1) {
      setLocation(currentBookId, currentChapter - 1);
    } else {
      const idx = BIBLE_BOOKS_META.findIndex(b => b.id === currentBookId);
      if (idx > 0) {
        const prev = BIBLE_BOOKS_META[idx - 1];
        setLocation(prev.id, prev.chapterCount);
      }
    }
  };

  const goNext = () => {
    if (currentBook && currentChapter < currentBook.chapterCount) {
      setLocation(currentBookId, currentChapter + 1);
    } else {
      const idx = BIBLE_BOOKS_META.findIndex(b => b.id === currentBookId);
      if (idx < BIBLE_BOOKS_META.length - 1) {
        setLocation(BIBLE_BOOKS_META[idx + 1].id, 1);
      }
    }
  };

  const handleVerseClick = (verseNum: number) => {
    setSelectedVerse(selectedVerse === verseNum ? null : verseNum);
  };

  const handleBookmark = (verseNum: number, text: string) => {
    if (isBookmarked(currentBookId, currentChapter, verseNum)) {
      const bm = bookmarks.find(
        b => b.bookId === currentBookId && b.chapter === currentChapter && b.verse === verseNum
      );
      if (bm) removeBookmark(bm.id);
    } else {
      addBookmark({
        bookId: currentBookId,
        bookName: currentBook?.name || '',
        chapter: currentChapter,
        verse: verseNum,
        text,
      });
    }
    setSelectedVerse(null);
  };

  const fontSizeOptions: Array<'sm' | 'base' | 'lg' | 'xl'> = ['sm', 'base', 'lg', 'xl'];
  const fontSizeLabels = { sm: '小', base: '中', lg: '大', xl: '特大' };

  return (
    <div className="min-h-screen pb-24 flex flex-col max-w-3xl mx-auto" ref={containerRef}>
      {/* ── 章节导航栏 ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 sticky top-14 z-30">
        <button
          onClick={goPrev}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-secondary"
        >
          <ChevronLeft className="w-4 h-4" />
          上一章
        </button>
        <ChapterSelector bookId={currentBookId} currentChapter={currentChapter} onSelect={(ch) => setLocation(currentBookId, ch)} />
        <button
          onClick={goNext}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-secondary"
        >
          下一章
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── 工具栏 ── */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-border/50 gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">
          {currentBook?.name} {currentChapter}章 · {verses.length}节
        </span>

        <div className="flex items-center gap-1">
          {/* 版本选择 */}
          <div className="relative">
            <button
              onClick={() => { setShowVersionPanel(!showVersionPanel); setShowFontPanel(false); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded-lg hover:bg-secondary"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {currentVersion === 'cunps' ? '简体和合本' : '繁体和合本'}
            </button>
          </div>

          {/* 对照切换 */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-1.5 text-xs cursor-pointer px-2 py-1 rounded-lg transition-colors ${
              compareMode
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            title="版本对照"
          >
            <Columns2 className="w-3.5 h-3.5" />
            对照
          </button>

          {/* 字号 */}
          <button
            onClick={() => { setShowFontPanel(!showFontPanel); setShowVersionPanel(false); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded-lg hover:bg-secondary"
          >
            <Type className="w-3.5 h-3.5" />
            字号
          </button>
        </div>
      </div>

      {/* ── 版本选择面板 ── */}
      {showVersionPanel && (
        <div className="px-4 py-3 bg-secondary/40 border-b border-border">
          <p className="text-xs text-muted-foreground mb-2 font-medium">选择主译本</p>
          <div className="flex flex-col gap-1">
            {(Object.entries(BIBLE_VERSIONS) as [BibleVersion, typeof BIBLE_VERSIONS[BibleVersion]][]).map(([key, info]) => (
              <button
                key={key}
                onClick={() => { setVersion(key); setShowVersionPanel(false); }}
                className={`text-left text-sm px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentVersion === key
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                {info.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 字号面板 ── */}
      {showFontPanel && (
        <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-8">字号</span>
          <div className="flex gap-2">
            {fontSizeOptions.map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
                  fontSize === size ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-border text-foreground'
                }`}
              >
                {fontSizeLabels[size]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 对照模式标题栏 ── */}
      {compareMode && !loading && (
        <div className="grid grid-cols-2 divide-x divide-border border-b border-border bg-secondary/30">
          <div className="px-3 py-1.5 text-xs font-medium text-center text-primary truncate">
            {BIBLE_VERSIONS[currentVersion].label}
          </div>
          <div className="px-3 py-1.5 text-xs font-medium text-center text-muted-foreground truncate">
            {BIBLE_VERSIONS[altVersion].label}
          </div>
        </div>
      )}

      {/* ── 经文内容 ── */}
      <div className="flex-1 px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">正在加载经文…</p>
          </div>
        ) : compareMode ? (
          // ── 对照模式：双列 ──
          <div className="space-y-0">
            {verses.map((v) => {
              const altVerse = versesAlt.find(a => a.verse === v.verse);
              const highlighted = isHighlighted(currentBookId, currentChapter, v.verse);
              const bookmarked  = isBookmarked(currentBookId, currentChapter, v.verse);
              const selected    = selectedVerse === v.verse;

              return (
                <div key={v.verse}>
                  <div
                    onClick={() => handleVerseClick(v.verse)}
                    className={`grid grid-cols-2 divide-x divide-border/60 cursor-pointer rounded-lg transition-all -mx-2 px-2 py-2 ${
                      highlighted ? 'bg-amber-100/60 dark:bg-amber-900/20' : ''
                    } ${selected ? 'bg-primary/10' : 'hover:bg-secondary/50'}`}
                  >
                    {/* 主版本 */}
                    <div className="pr-3 relative">
                      {highlighted && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 rounded" />}
                      <p style={{ fontSize: FONT_SIZE_MAP[fontSize], lineHeight: 1.9 }} className="font-serif text-foreground">
                        <span className="verse-number">{v.verse}</span>
                        {bookmarked && <span className="text-primary mr-1 text-xs">♦</span>}
                        {v.text}
                      </p>
                    </div>
                    {/* 对照版本 */}
                    <div className="pl-3">
                      <p style={{ fontSize: FONT_SIZE_MAP[fontSize], lineHeight: 1.9 }} className="font-serif text-muted-foreground">
                        <span className="verse-number">{v.verse}</span>
                        {altVerse?.text || '—'}
                      </p>
                    </div>
                  </div>

                  {selected && (
                    <VerseActions
                      bookmarked={bookmarked}
                      highlighted={highlighted}
                      onBookmark={() => handleBookmark(v.verse, v.text)}
                      onHighlight={() => { toggleHighlight({ bookId: currentBookId, chapter: currentChapter, verse: v.verse }); setSelectedVerse(null); }}
                      onCopy={() => { navigator.clipboard?.writeText(`${currentBook?.name} ${currentChapter}:${v.verse} "${v.text}"`); setSelectedVerse(null); }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // ── 单版本模式 ──
          <div className="space-y-0">
            {verses.map((v) => {
              const highlighted = isHighlighted(currentBookId, currentChapter, v.verse);
              const bookmarked  = isBookmarked(currentBookId, currentChapter, v.verse);
              const selected    = selectedVerse === v.verse;

              return (
                <div key={v.verse} className="relative">
                  <div
                    onClick={() => handleVerseClick(v.verse)}
                    className={`relative py-2 px-3 -mx-3 rounded-lg cursor-pointer transition-all active:bg-primary/5 ${
                      highlighted ? 'bg-amber-100/60 dark:bg-amber-900/20' : ''
                    } ${selected ? 'bg-primary/10' : 'hover:bg-secondary/50'}`}
                  >
                    {highlighted && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 rounded" />
                    )}
                    <p style={{ fontSize: FONT_SIZE_MAP[fontSize], lineHeight: 1.9 }} className="font-serif text-foreground">
                      <span className="verse-number">{v.verse}</span>
                      {bookmarked && <span className="text-primary mr-1 text-xs">♦</span>}
                      {v.text}
                    </p>
                  </div>

                  {selected && (
                    <VerseActions
                      bookmarked={bookmarked}
                      highlighted={highlighted}
                      onBookmark={() => handleBookmark(v.verse, v.text)}
                      onHighlight={() => { toggleHighlight({ bookId: currentBookId, chapter: currentChapter, verse: v.verse }); setSelectedVerse(null); }}
                      onCopy={() => { navigator.clipboard?.writeText(`${currentBook?.name} ${currentChapter}:${v.verse} "${v.text}"`); setSelectedVerse(null); }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 底部翻页 ── */}
      {!loading && (
        <div className="px-4 pb-4 flex gap-3">
          <button
            onClick={goPrev}
            className="flex-1 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            上一章
          </button>
          <button
            onClick={goNext}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            下一章
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// 节操作按钮
// ─────────────────────────────────────────────
interface VerseActionsProps {
  bookmarked: boolean;
  highlighted: boolean;
  onBookmark: () => void;
  onHighlight: () => void;
  onCopy: () => void;
}

const VerseActions: React.FC<VerseActionsProps> = ({ bookmarked, highlighted, onBookmark, onHighlight, onCopy }) => (
  <div className="flex gap-2 mt-1 mb-2 ml-3 flex-wrap">
    <button
      onClick={onBookmark}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
        bookmarked ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-primary/20'
      }`}
    >
      {bookmarked ? <><BookmarkCheck className="w-3.5 h-3.5" />已收藏</> : <><BookmarkPlus className="w-3.5 h-3.5" />收藏</>}
    </button>
    <button
      onClick={onHighlight}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
        highlighted ? 'bg-amber-500 text-white' : 'bg-secondary text-foreground hover:bg-amber-100 dark:hover:bg-amber-900/30'
      }`}
    >
      <Highlighter className="w-3.5 h-3.5" />
      {highlighted ? '取消高亮' : '高亮'}
    </button>
    <button
      onClick={onCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full cursor-pointer bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      复制
    </button>
  </div>
);

// ─────────────────────────────────────────────
// 章节选择器
// ─────────────────────────────────────────────
interface ChapterSelectorProps {
  bookId: string;
  currentChapter: number;
  onSelect: (ch: number) => void;
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({ bookId, currentChapter, onSelect }) => {
  const [open, setOpen] = useState(false);
  const book = BIBLE_BOOKS_META.find(b => b.id === bookId);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!book) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors flex items-center gap-1"
      >
        第 {currentChapter} 章
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground rotate-90" />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 p-2 max-h-60 overflow-y-auto">
          <div className="grid grid-cols-5 gap-1 w-44">
            {Array.from({ length: book.chapterCount }, (_, i) => i + 1).map(ch => (
              <button
                key={ch}
                onClick={() => { onSelect(ch); setOpen(false); }}
                className={`py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${
                  ch === currentChapter
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
