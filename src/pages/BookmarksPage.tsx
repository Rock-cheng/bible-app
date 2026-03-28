import React from 'react';
import { useBibleStore } from '@/store/bibleStore';
import type { Bookmark } from '@/store/bibleStore';
import { BookmarkCheck, Trash2, BookOpen, Highlighter } from 'lucide-react';

interface BookmarksPageProps {
  onNavigate: (page: 'home' | 'read' | 'search' | 'bookmarks') => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({ onNavigate }) => {
  const { bookmarks, removeBookmark, setLocation, highlights, toggleHighlight } = useBibleStore();

  const sortedBookmarks = [...bookmarks].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="min-h-screen pb-24 pt-4 max-w-3xl mx-auto">
      <div className="px-4">
        <h1 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5 text-primary" />
          我的收藏
          <span className="text-sm font-normal text-muted-foreground">({bookmarks.length})</span>
        </h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <BookmarkCheck className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">还没有收藏任何经文</p>
            <p className="text-xs text-muted-foreground mt-1">阅读时点击经文即可收藏</p>
            <button
              onClick={() => onNavigate('read')}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              去阅读
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onRemove={() => removeBookmark(bookmark.id)}
                onNavigate={() => {
                  setLocation(bookmark.bookId, bookmark.chapter);
                  onNavigate('read');
                }}
              />
            ))}
          </div>
        )}

        {/* 高亮列表 */}
        {highlights.length > 0 && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Highlighter className="w-4 h-4 text-amber-500" />
              高亮标注
              <span className="text-sm font-normal text-muted-foreground">({highlights.length})</span>
            </h2>
            <div className="space-y-2">
              {highlights.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10"
                >
                  <button
                    onClick={() => {
                      setLocation(h.bookId, h.chapter);
                      onNavigate('read');
                    }}
                    className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                    {h.bookId} {h.chapter}:{h.verse}
                  </button>
                  <button
                    onClick={() => toggleHighlight({ bookId: h.bookId, chapter: h.chapter, verse: h.verse })}
                    className="p-1.5 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                    aria-label="取消高亮"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BookmarkCard: React.FC<{
  bookmark: Bookmark;
  onRemove: () => void;
  onNavigate: () => void;
}> = ({ bookmark, onRemove, onNavigate }) => {
  return (
    <div className="relative p-4 rounded-xl border border-border hover:border-primary/50 bg-card transition-all">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
      <div className="flex items-start justify-between gap-3 ml-2">
        <div className="flex-1 min-w-0">
          <button
            onClick={onNavigate}
            className="block text-left cursor-pointer w-full"
          >
            <p className="text-xs font-semibold text-primary mb-1.5">
              {bookmark.bookName} {bookmark.chapter}:{bookmark.verse}
            </p>
            <p className="text-sm text-foreground leading-relaxed verse-text line-clamp-3" style={{ fontSize: '0.9rem' }}>
              {bookmark.text}
            </p>
          </button>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(bookmark.createdAt).toLocaleDateString('zh-CN')}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 text-muted-foreground hover:text-destructive cursor-pointer transition-colors shrink-0 rounded-lg hover:bg-destructive/10"
          aria-label="删除收藏"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
