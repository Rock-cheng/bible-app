import React, { useEffect, useState } from 'react';
import { useBibleStore } from '@/store/bibleStore';
import { DAILY_VERSES, BIBLE_BOOKS_META } from '@/data/bibleMeta';
import { BookOpen, Search, Bookmark, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HomePageProps {
  onNavigate: (page: 'home' | 'read' | 'search' | 'bookmarks') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { history, setLocation } = useBibleStore();
  const [dailyVerse, setDailyVerse] = useState(DAILY_VERSES[0]);

  useEffect(() => {
    // 按日期选择每日经文
    const dayOfYear = Math.floor(Date.now() / 86400000) % DAILY_VERSES.length;
    setDailyVerse(DAILY_VERSES[dayOfYear]);
  }, []);

  const quickStartBooks = [
    { id: 'GEN', chapter: 1 },
    { id: 'PSA', chapter: 23 },
    { id: 'JHN', chapter: 3 },
    { id: 'MAT', chapter: 5 },
    { id: 'ROM', chapter: 8 },
    { id: 'PHP', chapter: 4 },
  ];

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 max-w-3xl mx-auto">
      {/* 每日经文 */}
      <Card className="mb-6 overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--accent))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">今日经文</span>
          </div>
          <p className="verse-text text-foreground leading-relaxed mb-3">
            「{dailyVerse.text}」
          </p>
          <p className="text-sm font-semibold text-primary">{dailyVerse.ref}</p>
        </CardContent>
      </Card>

      {/* 快速入口 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onNavigate('read')}
          className="flex items-center gap-3 p-4 rounded-xl bg-primary text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity active:scale-95"
        >
          <BookOpen className="w-5 h-5 shrink-0" />
          <div className="text-left">
            <div className="text-sm font-semibold">浏览圣经</div>
            <div className="text-xs opacity-80">按书卷章节阅读</div>
          </div>
        </button>
        <button
          onClick={() => onNavigate('search')}
          className="flex items-center gap-3 p-4 rounded-xl bg-secondary text-secondary-foreground cursor-pointer hover:opacity-90 transition-opacity active:scale-95"
        >
          <Search className="w-5 h-5 shrink-0 text-primary" />
          <div className="text-left">
            <div className="text-sm font-semibold text-foreground">搜索经文</div>
            <div className="text-xs text-muted-foreground">全文关键词搜索</div>
          </div>
        </button>
      </div>

      {/* 常读章节 */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          常读章节
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {quickStartBooks.map(({ id, chapter }) => {
            const book = BIBLE_BOOKS_META.find(b => b.id === id);
            if (!book) return null;
            return (
              <button
                key={`${id}-${chapter}`}
                onClick={() => {
                  setLocation(id, chapter);
                  onNavigate('read');
                }}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-border hover:border-primary hover:bg-secondary/50 cursor-pointer transition-all active:scale-95"
              >
                <Badge variant="secondary" className="text-xs mb-1 bg-primary/10 text-primary border-0">
                  {book.abbr}
                </Badge>
                <span className="text-xs text-muted-foreground">{chapter}章</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 最近阅读 */}
      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            最近阅读
          </h2>
          <div className="space-y-2">
            {history.slice(0, 5).map((item, idx) => {
              const book = BIBLE_BOOKS_META.find(b => b.id === item.bookId);
              if (!book) return null;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setLocation(item.bookId, item.chapter);
                    onNavigate('read');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary cursor-pointer transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    {book.name} {item.chapter}章
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {book.testament === 'OT' ? '旧约' : '新约'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 收藏入口 */}
      <button
        onClick={() => onNavigate('bookmarks')}
        className="mt-4 w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-secondary cursor-pointer transition-colors"
      >
        <Bookmark className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-foreground">我的收藏与标注</span>
      </button>
    </div>
  );
};
