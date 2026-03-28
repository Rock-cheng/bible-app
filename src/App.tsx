import { useEffect, useState } from 'react';
import { NavBar, BottomNav } from '@/components/layout/Navigation';
import { HomePage } from '@/pages/HomePage';
import { ReadPage } from '@/pages/ReadPage';
import { SearchPage } from '@/pages/SearchPage';
import { BookmarksPage } from '@/pages/BookmarksPage';
import { useBibleStore, applyTheme } from '@/store/bibleStore';

type Page = 'home' | 'read' | 'search' | 'bookmarks';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { theme } = useBibleStore();

  // 初始化主题
  useEffect(() => {
    applyTheme(theme);
    // 监听系统主题变化
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* pt-14 = 顶部导航高度; 内容区自然滚动 */}
      <main className="pt-14 max-w-3xl mx-auto">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'read' && <ReadPage />}
        {currentPage === 'search' && <SearchPage onNavigate={handleNavigate} />}
        {currentPage === 'bookmarks' && <BookmarksPage onNavigate={handleNavigate} />}
      </main>

      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
