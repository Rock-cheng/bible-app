import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useBibleStore } from '@/store/bibleStore';
import { getChapterData, BIBLE_VERSIONS } from '@/data/bibleLoader';
import type { VerseData, BibleVersion } from '@/data/bibleLoader';
import { BIBLE_BOOKS_META } from '@/data/bibleMeta';
import {
  ChevronLeft, ChevronRight, BookmarkPlus, BookmarkCheck,
  Highlighter, Type, Loader2, Columns2, BookOpen, X,
} from 'lucide-react';

const FONT_SIZE_MAP = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.175rem',
  xl: '1.35rem',
};

// ─────────────────────────────────────────────
// 判断字符是否为标点/空格（标点差异不高亮）
// ─────────────────────────────────────────────
function isPunct(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (
    (code >= 0x0021 && code <= 0x002f) || // ASCII 标点 !"#$%&'()*+,-./ 
    (code >= 0x003a && code <= 0x0040) || // :;<=>?@
    (code >= 0x005b && code <= 0x0060) || // [\]^_`
    (code >= 0x007b && code <= 0x007e) || // {|}~
    (code >= 0x2000 && code <= 0x206f) || // 常规标点
    (code >= 0x2e00 && code <= 0x2e7f) || // 补充标点
    (code >= 0x3000 && code <= 0x303f) || // CJK符号和标点（。，、：；！？「」『』【】〔〕…—～·　）
    (code >= 0xff00 && code <= 0xffef) || // 全角标点（，。！？；：）
    (code >= 0x201c && code <= 0x201d) || // ""
    (code >= 0x2018 && code <= 0x2019) || // ''
    ch === '\u00a0' || // 不换行空格
    /\s/.test(ch)     // 普通空格/换行等
  );
}

// 规范化：仅用于 isDiff 的整体判断（非渲染）
function normalizeForCompare(text: string): string {
  return [...text].filter(ch => !isPunct(ch)).join('');
}

// ─────────────────────────────────────────────
// 差异计算：对原文做字符级 LCS，标点字符强制不高亮
// 返回 token 数组 {text, diff: bool}，渲染时保留原文
// ─────────────────────────────────────────────
function computeDiff(a: string, b: string): Array<{ text: string; diff: boolean }> {
  if (normalizeForCompare(a) === normalizeForCompare(b)) return [{ text: a, diff: false }];

  // 对原文字符做 LCS
  const aChars = [...a];
  const bChars = [...b];
  const la = aChars.length;
  const lb = bChars.length;

  const dp: number[][] = Array.from({ length: la + 1 }, () => new Array(lb + 1).fill(0));
  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      dp[i][j] = aChars[i - 1] === bChars[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // 回溯，得到 a 中每个字符的 diff 标记
  const result: Array<{ text: string; diff: boolean }> = [];
  let i = la, j = lb;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aChars[i - 1] === bChars[j - 1]) {
      result.unshift({ text: aChars[i - 1], diff: false });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      j--;
    } else {
      // 标点字符即使"有差异"也不高亮
      result.unshift({ text: aChars[i - 1], diff: !isPunct(aChars[i - 1]) });
      i--;
    }
  }

  // 合并相邻同类型块
  const merged: Array<{ text: string; diff: boolean }> = [];
  for (const item of result) {
    const last = merged[merged.length - 1];
    if (last && last.diff === item.diff) {
      last.text += item.text;
    } else {
      merged.push({ ...item });
    }
  }
  return merged;
}

// ─────────────────────────────────────────────
// 渲染带差异高亮的文字
// ─────────────────────────────────────────────
const DiffText: React.FC<{ text: string; altText: string }> = ({ text, altText }) => {
  const tokens = useMemo(() => computeDiff(text, altText), [text, altText]);
  return (
    <>
      {tokens.map((t, i) =>
        t.diff ? (
          <mark key={i} className="bg-amber-200/80 dark:bg-amber-700/50 text-foreground rounded-sm px-0.5 not-italic">
            {t.text}
          </mark>
        ) : (
          <span key={i}>{t.text}</span>
        )
      )}
    </>
  );
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

  const [versesCuv, setVersesCuv] = useState<VerseData[]>([]);
  const [versesNcv, setVersesNcv] = useState<VerseData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [showFontPanel, setShowFontPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentBook = BIBLE_BOOKS_META.find(b => b.id === currentBookId);

  // 当前显示的主版本经文
  const mainVerses = currentVersion === 'cuv' ? versesCuv : versesNcv;

  const loadChapter = useCallback(async () => {
    setLoading(true);
    setSelectedVerse(null);
    try {
      const [cuv, ncv] = await Promise.all([
        getChapterData(currentBookId, currentChapter, 'cuv'),
        getChapterData(currentBookId, currentChapter, 'ncv'),
      ]);
      setVersesCuv(cuv);
      setVersesNcv(ncv);
    } finally {
      setLoading(false);
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentBookId, currentChapter]);

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
    <div className="min-h-screen pb-24 flex flex-col max-w-4xl mx-auto" ref={containerRef}>
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
          {currentBook?.name} {currentChapter}章 · {mainVerses.length}节
        </span>
        <div className="flex items-center gap-1">
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
            onClick={() => { setShowFontPanel(!showFontPanel); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded-lg hover:bg-secondary"
          >
            <Type className="w-3.5 h-3.5" />
            字号
          </button>
        </div>
      </div>

      {/* ── 字号面板 ── */}
      {showFontPanel && (
        <div className="px-4 py-3 bg-secondary/50 border-b border-border flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-8">字号</span>
          <div className="flex gap-2 flex-1">
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
          <button onClick={() => setShowFontPanel(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── 对照模式标题栏 ── */}
      {compareMode && !loading && (
        <div className="grid grid-cols-2 divide-x divide-border border-b border-border bg-secondary/30">
          <div className="px-3 py-1.5 flex items-center justify-center gap-2">
            <span className="text-xs font-semibold text-primary">{BIBLE_VERSIONS['cuv'].shortLabel}</span>
            <span className="text-xs text-muted-foreground">和合本</span>
          </div>
          <div className="px-3 py-1.5 flex items-center justify-center gap-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{BIBLE_VERSIONS['ncv'].shortLabel}</span>
            <span className="text-xs text-muted-foreground">新译本</span>
          </div>
        </div>
      )}

      {/* ── 差异图例 ── */}
      {compareMode && !loading && (
        <div className="px-4 py-1.5 flex items-center gap-2 bg-amber-50/60 dark:bg-amber-950/20 border-b border-amber-200/50 dark:border-amber-800/30">
          <mark className="bg-amber-200/80 dark:bg-amber-700/50 text-xs px-1 rounded-sm not-italic">示例</mark>
          <span className="text-xs text-muted-foreground">= 两版本存在差异的部分</span>
        </div>
      )}

      {/* ── 经文内容 ── */}
      <div className="flex-1 px-3 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">正在加载经文…</p>
          </div>
        ) : compareMode ? (
          // ── 对照模式：双列逐节配对 ──
          <div className="space-y-0">
            {versesCuv.map((cuv, rowIdx) => {
              const ncv        = versesNcv.find(a => a.verse === cuv.verse);
              const highlighted = isHighlighted(currentBookId, currentChapter, cuv.verse);
              const bookmarked  = isBookmarked(currentBookId, currentChapter, cuv.verse);
              const selected    = selectedVerse === cuv.verse;
              const ncvText     = ncv?.text || '';
              const isDiff      = normalizeForCompare(cuv.text) !== normalizeForCompare(ncvText);
              // 斑马纹：偶数行（0-based）加淡底色
              const isEvenRow   = rowIdx % 2 === 0;

              return (
                <div
                  key={cuv.verse}
                  className={`border-b border-border/40 last:border-0 ${
                    isEvenRow ? 'bg-secondary/20 dark:bg-secondary/10' : ''
                  }`}
                >
                  <div
                    onClick={() => handleVerseClick(cuv.verse)}
                    className={`grid grid-cols-2 divide-x divide-border/60 cursor-pointer transition-all items-start ${
                      highlighted ? 'bg-amber-100/70 dark:bg-amber-900/25' : ''
                    } ${selected ? 'bg-primary/8 ring-1 ring-inset ring-primary/20' : 'hover:bg-primary/5'}`}
                  >
                    {/* 和合本列 */}
                    <div className={`pr-3 py-3 relative ${isDiff ? 'border-l-2 border-l-primary/40' : 'border-l-2 border-l-transparent'}`}>
                      {highlighted && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 rounded" />}
                      <p style={{ fontSize: FONT_SIZE_MAP[fontSize], lineHeight: 1.9 }} className="font-serif text-foreground">
                        <span className="inline-block min-w-[1.6em] text-xs text-muted-foreground/50 mr-1 font-sans font-normal select-none">
                          {cuv.verse}
                        </span>
                        {bookmarked && <span className="text-primary mr-0.5 text-xs">♦</span>}
                        {isDiff ? (
                          <DiffText text={cuv.text} altText={ncvText} />
                        ) : (
                          cuv.text
                        )}
                      </p>
                    </div>
                    {/* 新译本列 */}
                    <div className={`pl-3 py-3 ${isDiff ? 'border-l-2 border-l-emerald-500/40' : 'border-l-2 border-l-transparent'}`}>
                      <p style={{ fontSize: FONT_SIZE_MAP[fontSize], lineHeight: 1.9 }} className="font-serif text-foreground/80">
                        <span className="inline-block min-w-[1.6em] text-xs text-muted-foreground/50 mr-1 font-sans font-normal select-none">
                          {cuv.verse}
                        </span>
                        {isDiff ? (
                          <DiffText text={ncvText} altText={cuv.text} />
                        ) : (
                          ncvText || '—'
                        )}
                      </p>
                    </div>
                  </div>

                  {selected && (
                    <VerseActions
                      bookmarked={bookmarked}
                      highlighted={highlighted}
                      onBookmark={() => handleBookmark(cuv.verse, cuv.text)}
                      onHighlight={() => {
                        toggleHighlight({ bookId: currentBookId, chapter: currentChapter, verse: cuv.verse });
                        setSelectedVerse(null);
                      }}
                      onCopy={() => {
                        const ref = `${currentBook?.name} ${currentChapter}:${cuv.verse}`;
                        const text = `【和合本】${ref} "${cuv.text}"\n【新译本】${ref} "${ncvText}"`;
                        navigator.clipboard?.writeText(text);
                        setSelectedVerse(null);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // ── 单版本模式 ──
          <div className="space-y-0 max-w-2xl mx-auto">
            {/* 版本切换器（单版本模式下显示） */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mr-1">当前版本：</span>
              {(['cuv', 'ncv'] as BibleVersion[]).map(v => (
                <button
                  key={v}
                  onClick={() => setVersion(v)}
                  className={`text-xs px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    currentVersion === v
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {BIBLE_VERSIONS[v].shortLabel}
                </button>
              ))}
            </div>

            {mainVerses.map((v) => {
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
                      <span className="inline-block min-w-[1.6em] text-xs text-muted-foreground/60 mr-1 font-sans font-normal select-none">
                        {v.verse}
                      </span>
                      {bookmarked && <span className="text-primary mr-1 text-xs">♦</span>}
                      {v.text}
                    </p>
                  </div>

                  {selected && (
                    <VerseActions
                      bookmarked={bookmarked}
                      highlighted={highlighted}
                      onBookmark={() => handleBookmark(v.verse, v.text)}
                      onHighlight={() => {
                        toggleHighlight({ bookId: currentBookId, chapter: currentChapter, verse: v.verse });
                        setSelectedVerse(null);
                      }}
                      onCopy={() => {
                        navigator.clipboard?.writeText(`${currentBook?.name} ${currentChapter}:${v.verse} "${v.text}"`);
                        setSelectedVerse(null);
                      }}
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
  <div className="flex gap-2 mt-1 mb-2 ml-2 flex-wrap">
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
