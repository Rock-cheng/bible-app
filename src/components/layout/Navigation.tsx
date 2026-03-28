import React, { useState, useEffect, useRef } from 'react';
import { useBibleStore } from '@/store/bibleStore';
import { BIBLE_BOOKS_META } from '@/data/bibleMeta';
import { ChevronDown, BookOpen, Search } from 'lucide-react';

interface NavBarProps {
  currentPage: 'home' | 'read' | 'search' | 'bookmarks';
  onNavigate: (page: 'home' | 'read' | 'search' | 'bookmarks') => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentPage, onNavigate }) => {
  const { theme, setTheme, currentBookId, currentChapter } = useBibleStore();
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [testament, setTestament] = useState<'OT' | 'NT'>('OT');
  const pickerRef = useRef<HTMLDivElement>(null);

  const currentBook = BIBLE_BOOKS_META.find(b => b.id === currentBookId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowBookPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const otBooks = BIBLE_BOOKS_META.filter(b => b.testament === 'OT');
  const ntBooks = BIBLE_BOOKS_META.filter(b => b.testament === 'NT');

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="flex items-center justify-between px-4 h-14 max-w-3xl mx-auto">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer"
          aria-label="圣经浏览器首页"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm hidden sm:block text-foreground">圣经</span>
        </button>

        {/* 当前位置（阅读页显示书名） */}
        {currentPage === 'read' && (
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setShowBookPicker(!showBookPicker)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer text-sm font-medium text-foreground"
            >
              <span>{currentBook?.name || '创世记'} {currentChapter}章</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* 书卷选择器 */}
            {showBookPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 max-h-[70vh] bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setTestament('OT')}
                    className={`flex-1 py-2.5 text-sm font-medium cursor-pointer transition-colors ${testament === 'OT' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                  >
                    旧约
                  </button>
                  <button
                    onClick={() => setTestament('NT')}
                    className={`flex-1 py-2.5 text-sm font-medium cursor-pointer transition-colors ${testament === 'NT' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
                  >
                    新约
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[55vh] p-2">
                  <div className="grid grid-cols-4 gap-1">
                    {(testament === 'OT' ? otBooks : ntBooks).map(book => (
                      <button
                        key={book.id}
                        onClick={() => {
                          useBibleStore.getState().setLocation(book.id, 1);
                          setShowBookPicker(false);
                        }}
                        className={`px-1 py-2 text-xs rounded-lg cursor-pointer transition-colors text-center ${
                          book.id === currentBookId
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'hover:bg-secondary text-foreground'
                        }`}
                      >
                        {book.abbr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 右侧操作 */}
        <div className="flex items-center gap-1">
          {/* 主题切换 */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary cursor-pointer transition-colors text-muted-foreground"
            aria-label="切换深浅色主题"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* 底部导航指示 */}
    </header>
  );
};

interface BottomNavProps {
  currentPage: 'home' | 'read' | 'search' | 'bookmarks';
  onNavigate: (page: 'home' | 'read' | 'search' | 'bookmarks') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const items = [
    {
      key: 'home' as const,
      label: '首页',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      ),
    },
    {
      key: 'read' as const,
      label: '阅读',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
      ),
    },
    {
      key: 'search' as const,
      label: '搜索',
      icon: <Search width="22" height="22" />,
    },
    {
      key: 'bookmarks' as const,
      label: '收藏',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border safe-area-bottom">
      <div className="flex max-w-3xl mx-auto">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 cursor-pointer transition-colors ${
              currentPage === item.key
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
